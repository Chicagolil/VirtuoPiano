'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { convertMidiToSongFormat } from '@/common/utils/function';
import InfoTile from '@/features/performances/components/InfoTile';
import {
  Music,
  Gauge,
  Tags,
  Key,
  FileText,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { useCreateImport } from '@/customHooks/useCreateImport';
import { toast } from 'react-hot-toast';

const PianoRollViewer = dynamic(
  () => import('@/components/piano-roll/PianoRollViewer'),
  { ssr: false }
);

type ReviewData = {
  title: string;
  composer: string;
  difficulty: string;
  genre: string;
  songType: string;
  key: string;
  imageUrl: string | null;
  imageName: string | null;
  midiUrl: string | null;
  midiName: string | null;
};

export default function ImportReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<ReviewData | null>(null);
  const [tracksNotes, setTracksNotes] = useState<
    Array<{ track: number; notes: any[] }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<number>>(new Set());
  const [midiMeta, setMidiMeta] = useState<{
    tempo: number;
    timeSignature: string;
    duration_ms: number;
  } | null>(null);
  const createImport = useCreateImport();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('importReview:data');
      if (!raw) {
        router.push('/imports');
        return;
      }
      const parsed: ReviewData = JSON.parse(raw);
      setData(parsed);
    } catch (err) {
      router.push('/imports');
    }
  }, [router]);

  useEffect(() => {
    const loadMidi = async () => {
      if (!data?.midiUrl) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(data.midiUrl);
        const blob = await resp.blob();
        const file = new File([blob], data.midiName || 'song.mid', {
          type: 'audio/midi',
        });
        const result = await convertMidiToSongFormat(file);
        setMidiMeta({
          tempo: result.tempo,
          timeSignature: result.timeSignature,
          duration_ms: result.duration_ms,
        });
        // Regrouper par track
        const grouped = new Map<number, any[]>();
        for (const n of result.notes) {
          const arr = grouped.get(n.track) || [];
          arr.push({
            note: n.note,
            startBeat: n.startBeat,
            durationInBeats: n.durationInBeats,
          });
          grouped.set(n.track, arr);
        }
        const list = Array.from(grouped.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([track, notes]) => ({ track, notes }));
        setTracksNotes(list);
      } catch (e) {
        setError('Impossible de lire le MIDI');
      } finally {
        setLoading(false);
      }
    };
    loadMidi();
  }, [data]);

  // Sélectionner toutes les pistes par défaut lorsque chargées
  useEffect(() => {
    if (tracksNotes.length > 0) {
      setSelectedTracks(new Set(tracksNotes.map((t) => t.track)));
    } else {
      setSelectedTracks(new Set());
    }
  }, [tracksNotes]);

  const toggleTrack = (track: number) => {
    setSelectedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(track)) next.delete(track);
      else next.add(track);
      return next;
    });
  };

  const blobUrlToDataUrl = async (blobUrl: string): Promise<string> => {
    const resp = await fetch(blobUrl);
    const blob = await resp.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Conversion image échouée'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleConfirm = async () => {
    if (!data || !midiMeta) {
      toast.error('Données incomplètes pour créer la chanson');
      return;
    }
    const selectedTrackIds = tracksNotes
      .filter((t) => selectedTracks.has(t.track))
      .map((t) => t.track);
    if (selectedTrackIds.length === 0) {
      toast.error('Sélectionnez au moins une piste');
      return;
    }

    let imageDataUrl: string | null = null;
    try {
      if (data.imageUrl) {
        imageDataUrl = await blobUrlToDataUrl(data.imageUrl);
      }
    } catch (e) {
      console.warn(
        "Impossible de convertir l'image en Data URL, poursuite sans image."
      );
    }

    const payload = {
      title: data.title,
      composer: data.composer || null,
      difficulty: parseInt(data.difficulty, 10),
      genre: data.genre || null,
      songType: data.songType,
      keyName: data.key,
      imageDataUrl: imageDataUrl,
      midiMeta: midiMeta,
      tracks: tracksNotes,
      selectedTrackIds,
    };

    try {
      const res = await createImport.mutateAsync(payload);
      if (res?.success) {
        toast.success('Chanson importée avec succès');
        router.push('/imports');
      } else {
        toast.error(res?.message || "Échec de l'import");
      }
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de l'import");
    }
  };

  if (!data) return null;

  return (
    <div className="max-w-[98.5%] mx-auto bg-transparent shadow-md rounded-2xl p-6 border border-slate-200/20 dark:border-slate-700/20">
      <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 rounded-t-xl p-8 mb-6 -mx-6 -mt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-orange-500/30 rounded-lg flex items-center justify-center">
              <Music size={20} className="text-orange-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Récapitulatif de l'import
              </h1>
              <p className="text-white/70 text-sm">
                Vérifiez les informations avant de finaliser
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Informations générales en haut */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-col items-center">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={data.title}
                className="w-48 h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-white/10 rounded-lg flex items-center justify-center text-white/60">
                Pas d'image
              </div>
            )}
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-white">
                {data.title}
              </div>
              {data.composer && (
                <div className="text-white/70 text-sm">{data.composer}</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            <InfoTile
              icon={<Gauge className="text-orange-300" size={18} />}
              value={data.difficulty}
              label="Difficulté"
            />
            <InfoTile
              icon={<Tags className="text-orange-300" size={18} />}
              value={data.genre || '—'}
              label="Genre"
            />
            <InfoTile
              icon={<Music className="text-orange-300" size={18} />}
              value={data.songType}
              label="Type"
            />
            <InfoTile
              icon={<Key className="text-orange-300" size={18} />}
              value={data.key}
              label="Gamme"
            />
            <InfoTile
              icon={<FileText className="text-orange-300" size={18} />}
              value={data.midiName || '—'}
              label="Fichier MIDI"
            />
            <InfoTile
              icon={<Layers className="text-orange-300" size={18} />}
              value={tracksNotes.length}
              label="Pistes détectées"
            />
            <InfoTile
              icon={<Layers className="text-orange-300" size={18} />}
              value={selectedTracks.size}
              label="Pistes sélectionnées"
            />
          </div>
        </div>

        {/* Note d'avertissement et Piano rolls en dessous en une seule colonne */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200 text-sm flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-300 mt-0.5" />
          <div>
            <div className="font-medium">Attention</div>
            <p>
              Veuillez bien choisir les pistes à conserver, car elles auront un
              impact sur votre expérience de jeu.
            </p>
            <p className="mt-1">
              Idéalement, choisissez un fichier MIDI ne contenant que du piano
              sinon le nombre de pistes peut devenir très important.
            </p>
          </div>
        </div>
        {loading ? (
          <div className="bg-white/5 rounded-lg p-6 text-white/70">
            Chargement du MIDI...
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
            {error}
          </div>
        ) : tracksNotes.length === 0 ? (
          <div className="bg-white/5 rounded-lg p-6 text-white/70">
            Aucune piste détectée
          </div>
        ) : (
          tracksNotes.map(({ track, notes }) => (
            <div
              key={track}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    id={`track-${track}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-transparent"
                    checked={selectedTracks.has(track)}
                    onChange={() => toggleTrack(track)}
                  />
                  <label
                    htmlFor={`track-${track}`}
                    className="text-white/90 font-semibold cursor-pointer"
                  >
                    Piste #{track}
                  </label>
                </div>
                <span className="text-white/60 text-sm">
                  {notes.length} notes
                </span>
              </div>
              <div style={{ marginTop: 24, maxWidth: 1900, margin: '0 auto' }}>
                <PianoRollViewer
                  notes={notes}
                  width={'100%'}
                  minPitch={12}
                  maxPitch={108}
                  height={600}
                />
              </div>
            </div>
          ))
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
          <button
            onClick={() => router.push('/imports')}
            className="px-6 py-2 text-white/70 hover:text-white border border-white/20 hover:border-white/30 rounded-lg transition-colors duration-200"
          >
            Retour
          </button>
          <button
            onClick={handleConfirm}
            disabled={createImport.isPending}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {createImport.isPending
              ? 'Enregistrement...'
              : "Confirmer l'import"}
          </button>
        </div>
      </div>
    </div>
  );
}
