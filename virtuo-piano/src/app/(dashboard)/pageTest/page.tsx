'use client';
import dynamic from 'next/dynamic';
import BentoShadcnExample from '@/features/BentoGrid/BentoShadcnExample';
import PianoRollViewer from '@/components/piano-roll/PianoRollViewer';

const PianoRollEditor = dynamic(
  () => import('@/components/piano-roll/PianoRollEditor'),
  { ssr: false }
);

export default function LibraryPage() {
  return (
    <div>
      <BentoShadcnExample />
      <div style={{ marginTop: 24, maxWidth: 2200, margin: '0 auto' }}>
        <PianoRollEditor
          initialNotes={[
            { note: 'C4', startBeat: 0, durationInBeats: 1 },
            { note: 'D4', startBeat: 1, durationInBeats: 1 },
            { note: 'E4', startBeat: 2, durationInBeats: 1 },
          ]}
          width={'100%'}
          minPitch={12}
          maxPitch={108}
          height={480}
        />
        <PianoRollViewer
          notes={[
            { note: 'C4', startBeat: 0, durationInBeats: 1 },
            { note: 'D4', startBeat: 1, durationInBeats: 1 },
            { note: 'E4', startBeat: 2, durationInBeats: 1 },
          ]}
          width={'100%'}
          minPitch={12}
          maxPitch={108}
          height={480}
        />
      </div>
    </div>
  );
}
