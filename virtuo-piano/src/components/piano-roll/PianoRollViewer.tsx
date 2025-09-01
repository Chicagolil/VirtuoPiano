'use client';

import React from 'react';
import PianoRoll, { type PianoRollNote } from './PianoRoll';

export type PianoRollViewerProps = {
  notes:
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
};

export default function PianoRollViewer({
  notes,
  ...rest
}: PianoRollViewerProps) {
  return <PianoRoll initialNotes={notes} readOnly={true} {...rest} />;
}
