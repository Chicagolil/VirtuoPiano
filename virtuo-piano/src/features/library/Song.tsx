'use client';

import { castMsToMin } from '@/common/utils/function';
import { useEffect, useState } from 'react';
import { useSong } from '@/contexts/SongContext';
import {
  IconMusic,
  IconHeart,
  IconClock,
  IconCalendar,
  IconChartBar,
  IconUsers,
  IconStars,
  IconPiano,
} from '@tabler/icons-react';
import * as Progress from '@radix-ui/react-progress';
import * as Avatar from '@radix-ui/react-avatar';
import React from 'react';
import styles from './Song.module.css';
import { SongById } from '@/lib/actions/songs';
import DifficultyBadge from '@/components/DifficultyBadge';

export default function Song({ song }: { song: SongById }) {
  console.log(song);
  const { setCurrentSong } = useSong();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Mettre à jour le contexte avec la chanson actuelle
    setCurrentSong(song);

    // Nettoyer le contexte lorsque le composant est démonté
    return () => {
      setCurrentSong(null);
    };
  }, [song, setCurrentSong]);

  // Simulation de données pour les composants
  const difficultyLevel =
    song.tempo > 120
      ? 'avancé'
      : song.tempo > 90
      ? 'intermédiaire'
      : 'débutant';
  const popularity = Math.floor(Math.random() * 100);
  const userProgress = Math.floor(Math.random() * 100);

  // Badges de difficulté

  // Composant de barre de progression
  const ProgressBar = ({ value }: { value: number }) => (
    <Progress.Root
      className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2.5"
      value={value}
    >
      <Progress.Indicator
        className="bg-indigo-500 w-full h-full transition-transform duration-500 ease-in-out rounded-full"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
  );

  // Fonction pour générer un clavier de piano
  const PianoKeyboard = () => {
    // Liste de notes
    const baseNotes = [
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

    // Les notes de la gamme directement depuis les données de la chanson
    const scaleNotesNames: string[] =
      song.key && 'notes' in song.key && Array.isArray(song.key.notes)
        ? song.key.notes
        : []; // Tableau vide comme fallback si les notes ne sont pas disponibles

    // Si aucune note n'est fournie, on peut utiliser un ensemble de notes par défaut basé sur la tonalité
    const hasNotes = scaleNotesNames.length > 0;

    // Convertir les noms des notes en indices pour pouvoir les utiliser dans notre logique d'affichage
    const scaleNotes = hasNotes
      ? scaleNotesNames
          .map((noteName: string) => baseNotes.indexOf(noteName))
          .filter((index: number) => index !== -1)
      : [0, 2, 4, 5, 7, 9, 11]; // Gamme majeure de C par défaut s'il n'y a pas de notes

    return (
      <div className={styles.keyboardContainer}>
        <div className={styles.keyboardSection}>
          {/* Clavier de piano */}
          <div>
            <h3 className={styles.sectionTitle}>
              <IconPiano size={18} className={styles.sectionIcon} />
              Gamme de {song.key.name}
            </h3>

            <div className={styles.card}>
              <div className={styles.keyboard}>
                {/* Touches blanches avec libellés */}
                <div
                  className={`${styles.keyWhite} ${styles.keyWhiteRounded} ${
                    scaleNotes.includes(0) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    C
                  </span>
                </div>
                <div
                  className={`${styles.keyWhite} ${
                    scaleNotes.includes(2) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    D
                  </span>
                </div>
                <div
                  className={`${styles.keyWhite} ${
                    scaleNotes.includes(4) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    E
                  </span>
                </div>
                <div
                  className={`${styles.keyWhite} ${
                    scaleNotes.includes(5) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    F
                  </span>
                </div>
                <div
                  className={`${styles.keyWhite} ${
                    scaleNotes.includes(7) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    G
                  </span>
                </div>
                <div
                  className={`${styles.keyWhite} ${
                    scaleNotes.includes(9) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    A
                  </span>
                </div>
                <div
                  className={`${styles.keyWhite} ${
                    styles.keyWhiteRoundedRight
                  } ${
                    scaleNotes.includes(11) ? styles.keyWhiteHighlighted : ''
                  }`}
                >
                  <span
                    className={`${styles.keyLabel} ${styles.keyLabelWhite}`}
                  >
                    B
                  </span>
                </div>

                {/* Touches noires */}
                <div
                  className={`${styles.keyBlack} ${
                    scaleNotes.includes(1) ? styles.keyBlackHighlighted : ''
                  }`}
                  style={{ left: '10.7%' }}
                >
                  <span className={styles.keyLabelBlack}>C#</span>
                </div>
                <div
                  className={`${styles.keyBlack} ${
                    scaleNotes.includes(3) ? styles.keyBlackHighlighted : ''
                  }`}
                  style={{ left: '25%' }}
                >
                  <span className={styles.keyLabelBlack}>D#</span>
                </div>
                <div
                  className={`${styles.keyBlack} ${
                    scaleNotes.includes(6) ? styles.keyBlackHighlighted : ''
                  }`}
                  style={{ left: '53.6%' }}
                >
                  <span className={styles.keyLabelBlack}>F#</span>
                </div>
                <div
                  className={`${styles.keyBlack} ${
                    scaleNotes.includes(8) ? styles.keyBlackHighlighted : ''
                  }`}
                  style={{ left: '67.9%' }}
                >
                  <span className={styles.keyLabelBlack}>G#</span>
                </div>
                <div
                  className={`${styles.keyBlack} ${
                    scaleNotes.includes(10) ? styles.keyBlackHighlighted : ''
                  }`}
                  style={{ left: '82.1%' }}
                >
                  <span className={styles.keyLabelBlack}>A#</span>
                </div>
              </div>
            </div>

            {/* Notes de la gamme en ligne élégante */}
            <div className={styles.scaleNotesContainer}>
              {baseNotes.map((note, index) => (
                <div
                  key={index}
                  className={`${styles.scaleNoteItem} ${
                    scaleNotes.includes(index)
                      ? styles.scaleNoteHighlighted
                      : ''
                  }`}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* En-tête du morceau */}
      <div className={styles.header}>
        <div className={styles.headerGradient}>
          <div className={styles.headerContent}>
            <div className={styles.songImage}>
              {song.imageUrl ? (
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IconMusic size={36} className={styles.similarSongIconText} />
              )}
            </div>

            <div className={styles.songInfo}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className={styles.songTitle}>{song.title}</h1>
                  <p className={styles.songComposer}>
                    {song.composer || 'Compositeur inconnu'}
                  </p>
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`${styles.favoriteButton} ${
                    isFavorite ? styles.favoriteActive : ''
                  }`}
                >
                  <IconHeart
                    size={24}
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className={styles.songMeta}>
                <div className={styles.metaBadge}>
                  <IconClock size={14} className={styles.metaIcon} />
                  <span>{castMsToMin(song.duration_ms)}</span>
                </div>

                <div className={styles.metaBadge}>
                  <IconChartBar size={14} className={styles.metaIcon} />
                  <span>{song.tempo} BPM</span>
                </div>

                <div className={styles.metaBadge}>
                  <IconMusic size={14} className={styles.metaIcon} />
                  <span>{song.genre || 'Non spécifié'}</span>
                </div>

                <DifficultyBadge difficulty={song.Level} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}

      <div className={styles.tabContent}>
        <div className={`${styles.grid} ${styles.grid2Cols}`}>
          {/* Détails du morceau */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <IconMusic size={18} className={styles.sectionIcon} />
              Détails du morceau
            </h3>

            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Compositeur:</span>
                <span className={styles.detailValue}>
                  {song.composer || 'Inconnu'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Genre:</span>
                <span className={styles.detailValue}>
                  {song.genre || 'Non spécifié'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tempo:</span>
                <span className={styles.detailValue}>{song.tempo} BPM</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Durée:</span>
                <span className={styles.detailValue}>
                  {castMsToMin(song.duration_ms)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tonalité:</span>
                <span className={styles.detailValue}>
                  {song.key.name || 'C Majeur'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mesure:</span>
                <span className={styles.detailValue}>
                  {song.timeSignature || '4/4'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Difficulté:</span>
                <DifficultyBadge difficulty={song.Level} />
              </div>
            </div>
          </div>

          {/* Popularité et progression */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <IconChartBar size={18} className={styles.sectionIcon} />
              Votre progression
            </h3>

            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>Progression totale</span>
                <span>{userProgress}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressIndicator}
                  style={{ width: `${userProgress}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>Popularité</span>
                <span>{popularity}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressIndicator}
                  style={{ width: `${popularity}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={styles.card}>
                <span className={styles.detailLabel}>Sessions</span>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: 'var(--text-light)' }}
                >
                  {Math.floor(Math.random() * 10) + 1}
                </p>
              </div>
              <div className={styles.card}>
                <span className={styles.detailLabel}>Meilleur score</span>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: 'var(--text-light)' }}
                >
                  {Math.floor(Math.random() * 5000) + 1000}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ajout du clavier de piano */}
        <PianoKeyboard />

        {/* Recommandations similaires */}
        <div className={styles.similarSongs}>
          <h3 className={styles.sectionTitle}>
            <IconStars size={18} className={styles.sectionIcon} />
            Morceaux similaires
          </h3>

          <div className={`${styles.grid} ${styles.grid3Cols}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.similarSongCard}>
                <div className={styles.similarSongInfo}>
                  <div className={styles.similarSongIcon}>
                    <IconMusic
                      size={20}
                      className={styles.similarSongIconText}
                    />
                  </div>
                  <div>
                    <h4 className={styles.similarSongTitle}>
                      Titre similaire {i}
                    </h4>
                    <p className={styles.similarSongComposer}>
                      Compositeur {i}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.grid} ${styles.grid3Cols}`}
          style={{ marginBottom: '1.5rem' }}
        >
          <div
            className={styles.card}
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text-light)',
                marginBottom: '0.5rem',
              }}
            >
              {Math.floor(Math.random() * 10) + 5}
            </div>
            <p className={styles.detailLabel}>Sessions d'apprentissage</p>
          </div>
          <div
            className={styles.card}
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text-light)',
                marginBottom: '0.5rem',
              }}
            >
              {Math.floor(Math.random() * 10) + 5}
            </div>
            <p className={styles.detailLabel}>Sessions de jeu</p>
          </div>
          <div
            className={styles.card}
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text-light)',
                marginBottom: '0.5rem',
              }}
            >
              {Math.floor(Math.random() * 1000) + 2000}
            </div>
            <p className={styles.detailLabel}>Meilleur score</p>
          </div>
        </div>

        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <h3 className={styles.sectionTitle}>Historique des sessions</h3>

          <div className="space-y-3">
            {[1, 2, 3].map((session) => (
              <div key={session} className={styles.exerciseCard}>
                <div className={styles.exerciseHeader}>
                  <div className={styles.similarSongInfo}>
                    <div className={styles.similarSongIcon}>
                      <IconCalendar
                        size={18}
                        className={styles.similarSongIconText}
                      />
                    </div>
                    <div>
                      <h4 className={styles.similarSongTitle}>
                        Session du {new Date().toLocaleDateString()}
                      </h4>
                      <p className={styles.similarSongComposer}>
                        {Math.floor(Math.random() * 10) + 1} min · Score:{' '}
                        {Math.floor(Math.random() * 1000) + 1000}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <IconUsers size={18} className={styles.sectionIcon} />
            Classement des joueurs
          </h3>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((rank) => (
              <div
                key={rank}
                className={`${styles.exerciseCard} ${
                  rank === 3 ? styles.keyWhiteHighlighted : ''
                }`}
                style={{
                  background:
                    rank === 3
                      ? 'var(--primary-color-faded, rgba(99, 102, 241, 0.1))'
                      : '',
                  border:
                    rank === 3
                      ? '1px solid var(--primary-color-border, rgba(99, 102, 241, 0.2))'
                      : '',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div className={styles.similarSongInfo}>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '9999px',
                      backgroundColor:
                        'var(--bg-card, rgba(255, 255, 255, 0.1))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: 'var(--text-light, rgba(255, 255, 255, 0.9))',
                    }}
                  >
                    {rank}
                  </div>
                  <Avatar.Root className="h-8 w-8 rounded-full mr-2">
                    <Avatar.Fallback
                      className={styles.similarSongIcon}
                      style={{ borderRadius: '9999px' }}
                    >
                      U{rank}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="flex-1">
                    <div className={styles.similarSongTitle}>
                      {rank === 3 ? 'Vous' : `Utilisateur ${rank}`}
                    </div>
                  </div>
                  <div
                    className={styles.detailValue}
                    style={{ fontWeight: 'bold' }}
                  >
                    {Math.floor(Math.random() * 2000) + 3000}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
