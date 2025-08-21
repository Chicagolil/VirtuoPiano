'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Midi } from '@tonejs/midi';

export type PianoRollNote = {
  pitch: number; // MIDI number 0-127
  start: number; // grid step index (1 step = 1/16 note)
  duration: number; // in steps
  velocity?: number; // 0..1
};

type ExternalNote = {
  note: string;
  startBeat: number;
  durationInBeats: number;
};

type PianoRollProps = {
  initialNotes?: Array<PianoRollNote | ExternalNote>;
  minPitch?: number; // inclusive
  maxPitch?: number; // inclusive
  bars?: number; // total bars in the canvas
  stepsPerBeat?: number; // default 4 (sixteenth notes)
  beatsPerBar?: number; // default 4
  tempo?: number; // BPM for MIDI export
  ppq?: number; // pulses per quarter for MIDI export
  onChange?: (notes: PianoRollNote[]) => void;
  height?: number; // viewport height
  width?: number | string; // viewport width (e.g., 900 or '100%')
  readOnly?: boolean; // disable editing and toolbar when true
  noteFillColor?: string; // single color for all notes
};

type InteractionState =
  | { type: 'idle' }
  | { type: 'creating'; pitch: number; startStep: number; currentStep: number }
  | {
      type: 'dragging';
      noteIndex: number;
      dragStartXStep: number;
      noteStartAtDrag: number;
      notePitchAtDrag: number;
    }
  | {
      type: 'resizing';
      noteIndex: number;
      resizeAnchor: 'left' | 'right';
      dragStartXStep: number;
      originalStart: number;
      originalDuration: number;
    };

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Convert a note name like "C#4" to MIDI number
function noteNameToMidi(name: string): number | null {
  const match = name.trim().match(/^([A-Ga-g])([#b]?)(-?\d+)$/);
  if (!match) return null;
  const letter = match[1].toUpperCase();
  const accidental = match[2];
  const octave = parseInt(match[3], 10);
  const baseMap: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  let semitone = baseMap[letter];
  if (semitone === undefined) return null;
  if (accidental === '#') semitone += 1;
  if (accidental === 'b') semitone -= 1;
  if (semitone < 0) semitone += 12;
  if (semitone > 11) semitone -= 12;
  const midi = (octave + 1) * 12 + semitone;
  return clamp(midi, 0, 127);
}

// Normalize incoming notes (either internal or external shape) to internal shape
function convertToInternal(
  items: Array<PianoRollNote | ExternalNote>,
  stepsPerBeat: number
): PianoRollNote[] {
  const out: PianoRollNote[] = [];
  for (const it of items || []) {
    if (typeof (it as any).pitch === 'number') {
      const n = it as PianoRollNote;
      out.push({
        pitch: n.pitch,
        start: n.start,
        duration: n.duration,
        velocity: n.velocity,
      });
      continue;
    }
    const e = it as ExternalNote;
    const midi = noteNameToMidi(e.note);
    if (midi == null) continue;
    const start = Math.max(0, Math.round(e.startBeat * stepsPerBeat));
    const duration = Math.max(1, Math.round(e.durationInBeats * stepsPerBeat));
    out.push({ pitch: midi, start, duration, velocity: 0.9 });
  }
  return out;
}

export default function PianoRoll(props: PianoRollProps) {
  const {
    initialNotes = [],
    minPitch = 36, // C2
    maxPitch = 84, // C6
    bars = 16,
    stepsPerBeat = 4,
    beatsPerBar = 4,
    tempo = 120,
    ppq = 480,
    onChange,
    height = 420,
    width = '100%',
    readOnly = false,
    noteFillColor = '#fa8c16',
  } = props;

  const stepsPerBar = stepsPerBeat * beatsPerBar; // 16 by default
  const [stepWidth, setStepWidth] = useState<number>(24); // px per step (horizontal zoom)
  const [rowHeight, setRowHeight] = useState<number>(18); // px per semitone row (vertical zoom)
  const keyboardWidth = 64; // left piano keyboard width

  const [numBars, setNumBars] = useState<number>(bars);
  const totalSteps = numBars * stepsPerBar;
  const numRows = maxPitch - minPitch + 1;
  const canvasWidth = keyboardWidth + totalSteps * stepWidth;
  const canvasHeight = numRows * rowHeight;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [notes, setNotes] = useState<PianoRollNote[]>(() =>
    convertToInternal(
      initialNotes as Array<PianoRollNote | ExternalNote>,
      stepsPerBeat
    )
  );
  const [interaction, setInteraction] = useState<InteractionState>({
    type: 'idle',
  });
  const [hoveredNoteIndex, setHoveredNoteIndex] = useState<number | null>(null);

  const gridBg = '#1f1f1f';
  const gridLine = '#2b2b2b';
  const beatLine = '#353535';
  const barLine = '#444';

  // All notes share the same color (configurable via prop)

  const toStep = (x: number) => Math.floor((x - keyboardWidth) / stepWidth);
  const toPitch = (y: number) =>
    clamp(maxPitch - Math.floor(y / rowHeight), minPitch, maxPitch);

  const midiToNoteName = (midi: number) => {
    const names = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const name = names[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${name}${octave}`;
  };

  // removed useCallback version (now defined earlier before useState)

  const isBlack = (midiNote: number) => {
    const pc = midiNote % 12;
    return pc === 1 || pc === 3 || pc === 6 || pc === 8 || pc === 10;
  };

  const ensureCapacity = useCallback(
    (requiredStepInclusive: number) => {
      if (requiredStepInclusive < totalSteps) return;
      const requiredBars = Math.ceil((requiredStepInclusive + 1) / stepsPerBar);
      setNumBars((prev) => (requiredBars + 1 > prev ? requiredBars + 1 : prev));
    },
    [totalSteps, stepsPerBar]
  );

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // rect already reflects the current scroll offset inside the container,
    // so do NOT add container.scrollLeft/Top here to avoid double counting
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const noteAt = (pitch: number, step: number) => {
    for (let i = 0; i < notes.length; i += 1) {
      const n = notes[i];
      if (n.pitch !== pitch) continue;
      if (step >= n.start && step < n.start + n.duration) return i;
    }
    return -1;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // respect device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvasWidth;
    const cssH = canvasHeight;
    if (
      canvas.width !== Math.floor(cssW * dpr) ||
      canvas.height !== Math.floor(cssH * dpr)
    ) {
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // background
    ctx.fillStyle = gridBg;
    ctx.fillRect(0, 0, cssW, cssH);

    // keyboard background
    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, keyboardWidth, cssH);

    // piano keys and labels
    for (let p = maxPitch; p >= minPitch; p -= 1) {
      const y = (maxPitch - p) * rowHeight;
      ctx.fillStyle = isBlack(p) ? '#222' : '#eee';
      ctx.fillRect(0, y, keyboardWidth - 1, rowHeight);
      ctx.strokeStyle = isBlack(p) ? '#333' : '#ccc';
      ctx.beginPath();
      ctx.moveTo(0, y + rowHeight + 0.5);
      ctx.lineTo(keyboardWidth - 1, y + rowHeight + 0.5);
      ctx.stroke();
      if (p % 12 === 0) {
        const octave = Math.floor(p / 12) - 1;
        ctx.fillStyle = isBlack(p) ? '#ddd' : '#111';
        ctx.font = '10px sans-serif';
        ctx.fillText(`C${octave}`, 6, y + rowHeight - 5);
      }
    }

    // separator line
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(keyboardWidth + 0.5, 0);
    ctx.lineTo(keyboardWidth + 0.5, cssH);
    ctx.stroke();

    // horizontal pitch lines
    for (let r = 0; r <= numRows; r += 1) {
      const y = r * rowHeight + 0.5;
      ctx.strokeStyle = gridLine;
      ctx.beginPath();
      ctx.moveTo(keyboardWidth, y);
      ctx.lineTo(cssW, y);
      ctx.stroke();
    }

    // vertical time lines
    for (let s = 0; s <= totalSteps; s += 1) {
      const x = keyboardWidth + s * stepWidth + 0.5;
      if (s % stepsPerBar === 0) ctx.strokeStyle = barLine;
      else if (s % stepsPerBeat === 0) ctx.strokeStyle = beatLine;
      else ctx.strokeStyle = gridLine;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssH);
      ctx.stroke();
    }

    // draw notes
    for (let i = 0; i < notes.length; i += 1) {
      const n = notes[i];
      const x = keyboardWidth + n.start * stepWidth;
      const y = (maxPitch - n.pitch) * rowHeight;
      const w = n.duration * stepWidth;
      const h = rowHeight - 2;
      const isHovered = i === hoveredNoteIndex;
      ctx.fillStyle = noteFillColor;
      ctx.globalAlpha = isHovered ? 0.9 : 0.8;
      ctx.fillRect(x + 1, y + 1, w - 2, h);
      ctx.globalAlpha = 1;

      // edge for resize affordance
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(x + w - 4, y + 1, 3, h);
    }
  }, [
    notes,
    canvasWidth,
    canvasHeight,
    numRows,
    rowHeight,
    stepWidth,
    totalSteps,
    maxPitch,
    hoveredNoteIndex,
    stepsPerBar,
    stepsPerBeat,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    onChange?.(notes);
  }, [notes, onChange]);

  // Zoom handling: Ctrl/⌘ + wheel → horizontal zoom, Alt + wheel → vertical zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const isHorizontalZoom = e.ctrlKey || e.metaKey;
    const isVerticalZoom = e.altKey && !isHorizontalZoom;
    if (!isHorizontalZoom && !isVerticalZoom) return; // normal scroll

    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const pointerX = e.clientX - rect.left; // within container
    const pointerY = e.clientY - rect.top;

    if (isHorizontalZoom) {
      const MIN_STEP = 6;
      const MAX_STEP = 48;
      // Anchor: current step under cursor
      const anchorX = container.scrollLeft + pointerX - keyboardWidth;
      const anchorStep = anchorX > 0 ? anchorX / stepWidth : 0;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const next = clamp(stepWidth * factor, MIN_STEP, MAX_STEP);
      if (next === stepWidth) return;
      setStepWidth(next);
      // Preserve anchor under cursor
      const newAnchorX = anchorStep * next;
      const newScrollLeft = Math.max(0, keyboardWidth + newAnchorX - pointerX);
      // Schedule after state applied
      requestAnimationFrame(() => {
        container.scrollLeft = newScrollLeft;
      });
      return;
    }

    if (isVerticalZoom) {
      const MIN_ROW = 12;
      const MAX_ROW = 36;
      const anchorY = container.scrollTop + pointerY;
      const anchorRow = anchorY / rowHeight;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const next = clamp(rowHeight * factor, MIN_ROW, MAX_ROW);
      if (next === rowHeight) return;
      setRowHeight(next);
      const newAnchorY = anchorRow * next;
      const newScrollTop = Math.max(0, newAnchorY - pointerY);
      requestAnimationFrame(() => {
        container.scrollTop = newScrollTop;
      });
    }
  };

  // Auto-étendre la longueur (nombre de mesures) pour couvrir toutes les notes affichées
  useEffect(() => {
    if (!notes || notes.length === 0) return;
    const farthestStepExclusive = notes.reduce(
      (max, n) => Math.max(max, n.start + n.duration),
      0
    );
    const requiredBars = Math.ceil((farthestStepExclusive + 1) / stepsPerBar);
    setNumBars((prev) => (requiredBars > prev ? requiredBars : prev));
  }, [notes, stepsPerBar]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { x, y } = getMousePos(e);
    const rawStep = toStep(x);
    if (rawStep >= totalSteps - 2) {
      ensureCapacity(rawStep + stepsPerBar * 2);
    }
    const step = clamp(rawStep, 0, totalSteps - 1);
    const pitch = toPitch(y);

    if (x < keyboardWidth && interaction.type === 'idle') {
      setHoveredNoteIndex(null);
      return;
    }

    if (interaction.type === 'creating') {
      setInteraction({ ...interaction, currentStep: step });
      return;
    }

    if (interaction.type === 'dragging') {
      const delta = step - interaction.dragStartXStep;
      setNotes((prev) =>
        prev.map((n, idx) => {
          if (idx !== interaction.noteIndex) return n;
          let newStart = interaction.noteStartAtDrag + delta;
          if (newStart < 0) newStart = 0;
          const endStep = newStart + n.duration;
          if (endStep >= totalSteps - 1) ensureCapacity(endStep + stepsPerBar);
          const newPitch = clamp(pitch, minPitch, maxPitch);
          return { ...n, start: newStart, pitch: newPitch };
        })
      );
      return;
    }

    if (interaction.type === 'resizing') {
      const delta = step - interaction.dragStartXStep;
      setNotes((prev) =>
        prev.map((n, idx) => {
          if (idx !== interaction.noteIndex) return n;
          if (interaction.resizeAnchor === 'right') {
            let nextDuration = interaction.originalDuration + delta;
            if (nextDuration < 1) nextDuration = 1;
            const endStep = n.start + nextDuration;
            if (endStep >= totalSteps - 1)
              ensureCapacity(endStep + stepsPerBar);
            return { ...n, duration: nextDuration };
          } else {
            let newStart = interaction.originalStart + delta;
            let newDuration = interaction.originalDuration - delta;
            if (newStart < 0) {
              newDuration += newStart; // reduce duration by the overflow
              newStart = 0;
            }
            if (newDuration < 1) newDuration = 1;
            const endStep = newStart + newDuration;
            if (endStep >= totalSteps - 1)
              ensureCapacity(endStep + stepsPerBar);
            return { ...n, start: newStart, duration: newDuration };
          }
        })
      );
      return;
    }

    // hover logic when idle
    const hitIndex = noteAt(pitch, step);
    setHoveredNoteIndex(hitIndex === -1 ? null : hitIndex);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    // Only react to left click
    if (e.button !== 0) return;
    const { x, y } = getMousePos(e);
    const step = clamp(toStep(x), 0, totalSteps - 1);
    const pitch = toPitch(y);
    if (x < keyboardWidth) return; // ignore clicks on keyboard area
    const idx = noteAt(pitch, step);

    if (idx >= 0) {
      // determine if resizing vs dragging based on proximity to right edge
      const note = notes[idx];
      const localX = x - keyboardWidth - note.start * stepWidth;
      const isResizeRight = localX > note.duration * stepWidth - 8;
      if (isResizeRight) {
        setInteraction({
          type: 'resizing',
          noteIndex: idx,
          resizeAnchor: 'right',
          dragStartXStep: step,
          originalStart: note.start,
          originalDuration: note.duration,
        });
      } else {
        setInteraction({
          type: 'dragging',
          noteIndex: idx,
          dragStartXStep: step,
          noteStartAtDrag: note.start,
          notePitchAtDrag: note.pitch,
        });
      }
      return;
    }

    // create new note
    setInteraction({
      type: 'creating',
      pitch,
      startStep: step,
      currentStep: step + 1,
    });
  };

  const handleMouseUp = () => {
    if (interaction.type === 'creating') {
      const start = Math.min(interaction.startStep, interaction.currentStep);
      const end = Math.max(
        interaction.startStep + 1,
        interaction.currentStep + 1
      );
      const duration = clamp(end - start, 1, totalSteps - start);
      setNotes((prev) => [
        ...prev,
        { pitch: interaction.pitch, start, duration, velocity: 0.9 },
      ]);
      setInteraction({ type: 'idle' });
      return;
    }
    setInteraction({ type: 'idle' });
  };

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    // Only left-button double click should remove
    if (e.button !== 0) return;
    const { x, y } = getMousePos(e);
    const step = clamp(toStep(x), 0, totalSteps - 1);
    const pitch = toPitch(y);
    if (x < keyboardWidth) return;
    const idx = noteAt(pitch, step);
    if (idx >= 0) {
      setNotes((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const clearAll = () => setNotes([]);

  const exportJSON = () => {
    const beatsPerStep = 1 / stepsPerBeat; // steps are sixteenths when stepsPerBeat=4
    const normalized = notes
      .map((n) => ({
        note: midiToNoteName(n.pitch),
        startBeat: n.start * beatsPerStep,
        durationInBeats: n.duration * beatsPerStep,
      }))
      .sort((a, b) => a.startBeat - b.startBeat);

    const dataStr = JSON.stringify(normalized, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'piano-roll.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMIDI = () => {
    const midi = new Midi();
    midi.header.setTempo(tempo);
    const track = midi.addTrack();
    const effectivePpq = midi.header.ppq; // use MIDI default ppq
    const ticksPerStep = effectivePpq / stepsPerBeat;
    for (const n of notes) {
      const startTicks = Math.round(n.start * ticksPerStep);
      const durationTicks = Math.max(1, Math.round(n.duration * ticksPerStep));
      track.addNote({
        midi: n.pitch,
        ticks: startTicks,
        durationTicks,
        velocity: n.velocity ?? 0.9,
      });
    }
    const bytes = midi.toArray();
    const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'piano-roll.mid';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Allow external update of initialNotes (if prop changes)
  useEffect(() => {
    setNotes(
      convertToInternal(
        initialNotes as Array<PianoRollNote | ExternalNote>,
        stepsPerBeat
      )
    );
  }, [initialNotes, stepsPerBeat]);

  const toolbar = (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '8px 12px',
        alignItems: 'center',
        background: '#151515',
        borderBottom: '1px solid #2b2b2b',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <button onClick={exportMIDI} style={buttonStyle}>
        Exporter MIDI
      </button>
      <button onClick={exportJSON} style={buttonStyle}>
        Exporter JSON (note/startBeat/durationInBeats)
      </button>
      <button onClick={clearAll} style={buttonStyle}>
        Effacer
      </button>
      <div style={{ color: '#aaa', marginLeft: 8 }}>
        Astuce: double-clic pour supprimer, tirer le bord droit pour
        redimensionner
      </div>
    </div>
  );

  return (
    <div
      style={{
        border: '1px solid #2b2b2b',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#111',
        width: '100%',
      }}
    >
      {!readOnly && toolbar}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '8px 12px',
          alignItems: 'center',
          background: '#151515',
          borderBottom: '1px solid #2b2b2b',
        }}
      >
        <div style={{ color: '#ddd', fontSize: 12, marginRight: 4 }}>Zoom</div>
        <button
          onClick={() => setStepWidth((v) => Math.max(6, v / 1.1))}
          style={buttonStyle}
        >
          − H
        </button>
        <button
          onClick={() => setStepWidth((v) => Math.min(48, v * 1.1))}
          style={buttonStyle}
        >
          + H
        </button>
        <div style={{ width: 8 }} />
        <button
          onClick={() => setRowHeight((v) => Math.max(12, v / 1.1))}
          style={buttonStyle}
        >
          − V
        </button>
        <button
          onClick={() => setRowHeight((v) => Math.min(36, v * 1.1))}
          style={buttonStyle}
        >
          + V
        </button>
        <div style={{ width: 8 }} />
        <button
          onClick={() => {
            setStepWidth(24);
            setRowHeight(18);
          }}
          style={buttonStyle}
        >
          Reset
        </button>
      </div>
      <div
        ref={containerRef}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height,
          overflow: 'scroll',
          position: 'relative',
          background: gridBg,
        }}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseMove={readOnly ? undefined : handleMouseMove}
          onMouseDown={readOnly ? undefined : handleMouseDown}
          onMouseUp={readOnly ? undefined : handleMouseUp}
          onDoubleClick={readOnly ? undefined : handleDoubleClick}
          onContextMenu={readOnly ? undefined : (e) => e.preventDefault()}
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  background: '#2f2f2f',
  border: '1px solid #3a3a3a',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: 6,
  cursor: 'pointer',
};
