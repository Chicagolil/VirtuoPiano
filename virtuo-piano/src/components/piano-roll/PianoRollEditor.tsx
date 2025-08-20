'use client';

import React from 'react';
import PianoRoll, { type PianoRollNote } from './PianoRoll';

export type PianoRollEditorProps = {
  initialNotes?:
    | PianoRollNote[]
    | Array<{ note: string; startBeat: number; durationInBeats: number }>;
  minPitch?: number;
  maxPitch?: number;
  height?: number;
  width?: number | string;
  stepsPerBeat?: number;
  beatsPerBar?: number;
  bars?: number;
  tempo?: number;
  onChange?: (notes: PianoRollNote[]) => void;
};

export default function PianoRollEditor(props: PianoRollEditorProps) {
  return <PianoRoll {...props} readOnly={false} />;
}
