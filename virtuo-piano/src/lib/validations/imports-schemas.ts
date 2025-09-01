import { z } from 'zod';

export const noteSchema = z.object({
  note: z.string().min(1),
  startBeat: z.number().min(0),
  durationInBeats: z.number().min(0),
});

export const trackSchema = z.object({
  track: z.number().int().min(0),
  notes: z.array(noteSchema),
});

export const createImportSchema = z.object({
  title: z.string().min(1),
  composer: z.string().optional().nullable(),
  difficulty: z.number().int().min(1).max(10),
  genre: z.string().optional().nullable(),
  songType: z.enum(['song', 'scaleEx', 'chordEx', 'rythmEx', 'arpeggioEx']),
  keyName: z.string().min(1),
  imageDataUrl: z.string().url().optional().nullable(),
  midiMeta: z.object({
    tempo: z.number().min(1),
    timeSignature: z.string().min(1),
    duration_ms: z.number().min(0),
  }),
  tracks: z.array(trackSchema),
  selectedTrackIds: z.array(z.number().int()).min(1),
});

export type CreateImportInput = z.infer<typeof createImportSchema>;
