'use client';

import { castMsToMin, getLearnScores } from '@/common/utils/function';
import { useEffect, useState, useTransition } from 'react';
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
  IconGauge,
  IconCategory,
} from '@tabler/icons-react';

import React from 'react';
import styles from './Song.module.css';
import { SongById, toggleFavorite } from '@/lib/actions/songs';
import DifficultyBadge from '@/components/DifficultyBadge';
import SongTypeBadge from '@/components/SongTypeBadge';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';

export default function Song({
  song,
  userId,
}: {
  song: SongById;
  userId: string;
}) {
  const router = useRouter();
  const { setCurrentSong } = useSong();
  const [isFavorite, setIsFavorite] = useState(song.isFavorite || false);
  const [isPending, startTransition] = useTransition();

  const userMaxScore =
    song.globalMaxScore.filter((user) => user.user.id === userId)[0]
      ?.totalPoints || 0;

  const wrongNotes = song.learnSessions?.[0]?.wrongNotes || 0;
  const correctNotes = song.learnSessions?.[0]?.correctNotes || 0;
  const missedNotes = song.learnSessions?.[0]?.missedNotes || 0;

  const { performance, accuracy } = getLearnScores(
    wrongNotes,
    correctNotes,
    missedNotes
  );

  useEffect(() => {
    // Mettre à jour le contexte avec la chanson actuelle
    setCurrentSong(song);

    // Nettoyer le contexte lorsque le composant est démonté
    return () => {
      setCurrentSong(null);
    };
  }, [song, setCurrentSong]);

  const handleSimilarSongClick = (songId: string) => {
    router.push(`/library/${songId}`);
  };

  // Fonction pour gérer le clic sur le bouton favori
  const handleFavoriteClick = () => {
    // Mettre à jour l'état local immédiatement pour une meilleure expérience utilisateur
    setIsFavorite(!isFavorite);

    // Appeler l'action serveur
    startTransition(async () => {
      try {
        const result = await toggleFavorite(song.id);

        if (result.success) {
          toast.success(result.message);
        } else {
          // En cas d'échec, revenir à l'état précédent
          setIsFavorite(isFavorite);
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        // En cas d'erreur, revenir à l'état précédent
        setIsFavorite(isFavorite);
        toast.error(
          'Une erreur est survenue lors de la modification des favoris'
        );
      }
    });
  };

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
              <div className="flex items-start">
                <div>
                  <h1 className={styles.songTitle}>{song.title}</h1>
                  <p className={styles.songComposer}>
                    {song.composer || 'Compositeur inconnu'}
                  </p>
                </div>

                <button
                  onClick={handleFavoriteClick}
                  className={`${styles.favoriteButton} ml-3 ${
                    isFavorite ? styles.favoriteActive : ''
                  }`}
                  disabled={isPending}
                >
                  <IconHeart
                    size={41}
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
        <div>
          {/* Détails du morceau transformés en info-tuiles */}
          <div>
            <h3 className={styles.sectionTitle}>
              <IconMusic size={18} className={styles.sectionIcon} />
              Détails du morceau
            </h3>

            <div className={styles.infoTilesGrid}>
              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconMusic size={20} />
                </div>
                <div className={styles.infoTileLabel}>Compositeur</div>
                <div className={styles.infoTileValue}>
                  {song.composer || 'Inconnu'}
                </div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconChartBar size={20} />
                </div>
                <div className={styles.infoTileLabel}>Tempo</div>
                <div className={styles.infoTileValue}>{song.tempo} BPM</div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconClock size={20} />
                </div>
                <div className={styles.infoTileLabel}>Durée</div>
                <div className={styles.infoTileValue}>
                  {castMsToMin(song.duration_ms)}
                </div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconPiano size={20} />
                </div>
                <div className={styles.infoTileLabel}>Tonalité</div>
                <div className={styles.infoTileValue}>
                  {song.key.name || 'C Majeur'}
                </div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconMusic size={20} />
                </div>
                <div className={styles.infoTileLabel}>Genre</div>
                <div className={styles.infoTileValue}>
                  {song.genre || 'Non spécifié'}
                </div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconCalendar size={20} />
                </div>
                <div className={styles.infoTileLabel}>Mesure</div>
                <div className={styles.infoTileValue}>
                  {song.timeSignature || '4/4'}
                </div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconGauge size={20} />
                </div>
                <div className={styles.infoTileLabel}>Difficulté</div>
                <DifficultyBadge difficulty={song.Level} />
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconCategory size={20} />
                </div>
                <div className={styles.infoTileLabel}>Type</div>
                <SongTypeBadge songType={song.SongType} />
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoTileIcon}>
                  <IconCalendar size={20} />
                </div>
                <div className={styles.infoTileLabel}>Date de création</div>
                <div className={styles.infoTileValue}>
                  {song.releaseDate
                    ? new Date(song.releaseDate).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'Non spécifiée'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommandations similaires */}
        <div className={styles.similarSongs}>
          <h3 className={styles.sectionTitle}>
            <IconStars size={18} className={styles.sectionIcon} />
            Morceaux similaires
          </h3>

          {song.similarSongs && song.similarSongs.length > 0 ? (
            <div className={`${styles.grid} ${styles.grid3Cols}`}>
              {song.similarSongs.map((similarSong) => (
                <div
                  key={similarSong.id}
                  className={styles.similarSongCard}
                  onClick={() => {
                    handleSimilarSongClick(similarSong.id);
                  }}
                >
                  <div className={styles.similarSongInfo}>
                    <div className={styles.similarSongIcon}>
                      <IconMusic
                        size={20}
                        className={styles.similarSongIconText}
                      />
                    </div>
                    <div>
                      <h4 className={styles.similarSongTitle}>
                        {similarSong.title}
                      </h4>
                      <p className={styles.similarSongComposer}>
                        {similarSong.composer || 'Compositeur inconnu'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Aucun morceau similaire trouvé pour le moment.</p>
            </div>
          )}
        </div>

        {/* Votre progression */}
        <h3 className={styles.sectionTitleStandalone}>
          <IconChartBar size={18} className={styles.sectionIcon} />
          Votre progression
        </h3>

        {/* Tuiles de statistiques ajoutées ici */}
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
              {song.playSessions?.length}
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
              {song.learnSessions?.length}
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
              {userMaxScore}
            </div>
            <p className={styles.detailLabel}>Meilleur score</p>
          </div>
        </div>

        {/* Barres de progression déplacées ici */}
        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>
              <span>Progression totale</span>
              <span>{performance}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressIndicator}
                style={{ width: `${performance}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.grid} ${styles.grid2Cols}`}
          style={{ marginBottom: '1.5rem' }}
        >
          {/* Historique des sessions de jeu */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <IconCalendar size={18} className={styles.sectionIcon} />
              Historique des sessions de jeu
              <div className={styles.titleButtonSpacer}></div>
              <button className={styles.titleButton}>Voir plus</button>
            </h3>

            <div className="space-y-3">
              {song.playSessions?.slice(0, 3).map((session) => (
                <div key={session.id} className={styles.exerciseCard}>
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
                          Session du{' '}
                          {session.sessionStartTime.toLocaleDateString(
                            'fr-FR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          )}
                        </h4>
                        <p className={styles.similarSongComposer}>
                          Score: {session.totalPoints}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historique des sessions d'apprentissage */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <IconCalendar size={18} className={styles.sectionIcon} />
              Historique des sessions d'apprentissage
              <div className={styles.titleButtonSpacer}></div>
              <button className={styles.titleButton}>Voir plus</button>
            </h3>

            <div className="space-y-3">
              {song.learnSessions?.slice(0, 3).map((session) => (
                <div key={session.id} className={styles.exerciseCard}>
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
                          Session du{' '}
                          {session.sessionStartTime.toLocaleDateString(
                            'fr-FR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          )}
                        </h4>
                        <p className={styles.similarSongComposer}>
                          Progression:{' '}
                          {
                            getLearnScores(
                              session.wrongNotes || 0,
                              session.correctNotes || 0,
                              session.missedNotes || 0
                            ).performance
                          }
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <IconUsers size={18} className={styles.sectionIcon} />
            Classement des joueurs
            <div className={styles.titleButtonSpacer}></div>
            <button className={styles.titleButton}>Voir plus</button>
          </h3>

          <div className="space-y-2">
            {/* Affichage des 5 premiers joueurs */}
            {song.globalMaxScore?.slice(0, 5).map((rank, index) => {
              const isCurrentUser = rank.user.id === userId || false;

              return (
                <div
                  key={rank.user.id}
                  className={`${styles.exerciseCard} ${
                    isCurrentUser ? styles.keyWhiteHighlighted : ''
                  }`}
                  style={{
                    background: isCurrentUser
                      ? 'var(--primary-color-faded, rgba(99, 102, 241, 0.1))'
                      : '',
                    border: isCurrentUser
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
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className={styles.similarSongTitle}>
                        {isCurrentUser ? 'Vous' : rank.user.userName}
                      </div>
                    </div>
                    <div
                      className={styles.detailValue}
                      style={{ fontWeight: 'bold' }}
                    >
                      {rank.totalPoints}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Affichage de la position de l'utilisateur actuel s'il n'est pas dans les 5 premiers */}
            {song.globalMaxScore &&
              song.globalMaxScore.length > 5 &&
              (() => {
                // Recherche de la position de l'utilisateur actuel dans le classement complet
                const userRankIndex = song.globalMaxScore.findIndex(
                  (rank) => rank.user.id === userId
                );

                // Si l'utilisateur est trouvé et qu'il n'est pas dans les 5 premiers
                if (userRankIndex !== -1 && userRankIndex >= 5) {
                  const userRank = song.globalMaxScore[userRankIndex];

                  return (
                    <div
                      key={userRank.user.id}
                      className={`${styles.exerciseCard} ${styles.keyWhiteHighlighted}`}
                      style={{
                        background:
                          'var(--primary-color-faded, rgba(99, 102, 241, 0.1))',
                        border:
                          '1px solid var(--primary-color-border, rgba(99, 102, 241, 0.2))',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        marginTop: '0.5rem',
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
                            color:
                              'var(--text-light, rgba(255, 255, 255, 0.9))',
                          }}
                        >
                          {userRankIndex + 1}
                        </div>

                        <div className="flex-1">
                          <div className={styles.similarSongTitle}>Vous</div>
                        </div>
                        <div
                          className={styles.detailValue}
                          style={{ fontWeight: 'bold' }}
                        >
                          {userRank.totalPoints}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
          </div>
        </div>
        <PianoKeyboard />
      </div>
    </div>
  );
}
