'use client';

import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
  getHeatmapData,
  getSessionsByDate,
} from '@/lib/actions/heatmap-actions';
import {
  ScoreDurationData,
  SessionDetail,
} from '@/lib/services/performances-services';
import { Spinner } from './spinner';

// Styles CSS pour les animations
const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;

// Définition des couleurs bleues
const GREEN_COLORS = [
  '#161b22', // 0 contribution
  '#0c2d48', // 1-3 contributions
  '#1e3a8a', // 4-7 contributions
  '#3b82f6', // 8-15 contributions
  '#60a5fa', // 16+ contributions
];

// Définition des couleurs oranges
const ORANGE_COLORS = [
  '#161b22', // 0 contribution
  '#7c2d12', // 1-3 contributions
  '#ea580c', // 4-7 contributions
  '#fb923c', // 8-15 contributions
  '#fed7aa', // 16+ contributions
];

// Type pour une semaine de contributions (7 jours)
type Week = (number | null)[];

const monthNames = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Jun',
  'Jul',
  'Aoû',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];

// Fonction pour générer les données d'une année complète avec les vraies données
function generateYearData(
  year: number,
  performanceData: ScoreDurationData[]
): Week[] {
  const startDate = new Date(year, 0, 1); // 1er janvier
  const endDate = new Date(year, 11, 31); // 31 décembre

  // Calculer le jour de la semaine du 1er janvier (0 = dimanche, 1 = lundi, etc.)
  const startDayOfWeek = startDate.getDay();
  // Convertir pour que lundi = 0, dimanche = 6
  const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Calculer le nombre total de jours dans l'année
  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  // Calculer le nombre de semaines nécessaires
  const totalCells = mondayStartDay + totalDays;
  const weeksNeeded = Math.ceil(totalCells / 7);

  // Créer un Map pour accéder rapidement aux données par date
  const dataMap = new Map<string, number>();
  performanceData.forEach((item) => {
    // Utiliser une méthode qui respecte le fuseau horaire local
    const year = item.date.getFullYear();
    const month = String(item.date.getMonth() + 1).padStart(2, '0');
    const day = String(item.date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`; // Format YYYY-MM-DD
    dataMap.set(dateKey, item.durationInMinutes);
  });

  const weeks: Week[] = [];

  for (let weekIndex = 0; weekIndex < weeksNeeded; weekIndex++) {
    const week: (number | null)[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const cellIndex = weekIndex * 7 + dayIndex;

      if (cellIndex < mondayStartDay) {
        // Jours avant le 1er janvier
        week.push(null);
      } else if (cellIndex >= mondayStartDay + totalDays) {
        // Jours après le 31 décembre
        week.push(null);
      } else {
        // Jours de l'année
        const daysSinceStart = cellIndex - mondayStartDay;
        const currentDate = new Date(year, 0, 1 + daysSinceStart);
        // Utiliser une méthode qui respecte le fuseau horaire local
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(
          2,
          '0'
        );
        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${currentYear}-${currentMonth}-${currentDay}`;
        const duration = dataMap.get(dateKey) || 0;
        week.push(duration);
      }
    }

    weeks.push(week);
  }

  return weeks;
}

// Fonction pour générer les labels des mois
function generateMonthLabels(
  year: number,
  weeksData: Week[]
): { month: string; position: number }[] {
  const startDate = new Date(year, 0, 1);
  const startDayOfWeek = startDate.getDay();
  const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const monthLabels: { month: string; position: number }[] = [];

  for (let month = 0; month < 12; month++) {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysSinceYearStart = Math.floor(
      (firstDayOfMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const cellIndex = mondayStartDay + daysSinceYearStart;
    const weekIndex = Math.floor(cellIndex / 7);

    // Ne pas afficher le mois s'il dépasse le nombre de semaines
    if (weekIndex < weeksData.length) {
      monthLabels.push({
        month: monthNames[month],
        position: weekIndex,
      });
    }
  }

  return monthLabels;
}

// Fonction pour formater la durée (utilisée dans le titre et les cartes)
const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  }
  return `${hours} heure${hours > 1 ? 's' : ''} ${remainingMinutes} minute${
    remainingMinutes > 1 ? 's' : ''
  }`;
};

// Composant pour afficher une session
const SessionCard: React.FC<{ session: SessionDetail }> = ({ session }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '0.75rem',
        padding: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '0.75rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem',
        }}
      >
        <div>
          <h4
            style={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              margin: 0,
              marginBottom: '0.25rem',
            }}
          >
            {session.songTitle}
          </h4>
          {session.songComposer && (
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                margin: 0,
              }}
            >
              {session.songComposer}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              backgroundColor:
                session.modeName === 'Apprentissage'
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(147, 51, 234, 0.2)',
              color:
                session.modeName === 'Apprentissage' ? '#a5b4fc' : '#c4b5fd',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}
          >
            {session.modeName}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {formatTime(session.sessionStartTime)} -{' '}
            {formatTime(session.sessionEndTime)}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {formatDuration(session.durationInMinutes)}
          </span>
        </div>
        {session.totalPoints && (
          <span style={{ color: 'white', fontWeight: '600' }}>
            {session.totalPoints} pts
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
        {session.maxCombo && (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Combo Maximal:{' '}
            <span style={{ color: 'white', fontWeight: '500' }}>
              x{session.maxCombo}
            </span>
          </div>
        )}
        {session.maxMultiplier && (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Multiplicateur Maximal:{' '}
            <span style={{ color: 'white', fontWeight: '500' }}>
              x{session.maxMultiplier}
            </span>
          </div>
        )}
        {session.accuracy ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Précision:{' '}
            <span style={{ color: 'white', fontWeight: '500' }}>
              {session.accuracy}%
            </span>
          </div>
        ) : null}
        {session.performance ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Performance:{' '}
            <span style={{ color: 'white', fontWeight: '500' }}>
              {session.performance}%
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Heatmap: React.FC = () => {
  // Années disponibles
  const years = [2023, 2024, 2025];
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [colorTheme, setColorTheme] = useState<'green' | 'orange'>('green');
  const [performanceData, setPerformanceData] = useState<ScoreDurationData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionDetail[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false); // Nouvel état pour l'animation
  const [isClosing, setIsClosing] = useState(false); // Nouvel état pour l'animation de fermeture

  // Injecter les styles CSS pour les animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Récupérer les données quand l'année change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getHeatmapData(selectedYear);
        if (result.success) {
          setPerformanceData(result.data);
        } else {
          console.error('Erreur lors de la récupération des données');
          setPerformanceData([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setPerformanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Récupérer les sessions quand une date est sélectionnée
  useEffect(() => {
    if (!selectedDate) {
      setSessions([]);
      return;
    }

    const fetchSessions = async () => {
      setSessionsLoading(true);
      try {
        const result = await getSessionsByDate(selectedDate);
        if (result.success) {
          setSessions(result.data);
        } else {
          console.error('Erreur lors de la récupération des sessions');
          setSessions([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des sessions:', error);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchSessions();
  }, [selectedDate]);

  // Générer les données pour l'année sélectionnée
  const data = generateYearData(selectedYear, performanceData);
  const monthLabels = generateMonthLabels(selectedYear, data);

  // Calcul du nombre total de contributions (en excluant les valeurs null)
  const totalContributions = data
    .flat()
    .filter((count): count is number => count !== null)
    .reduce((total, count) => total + count, 0);

  function getColor(count: number | null) {
    if (count === null) return 'transparent';
    const colors = colorTheme === 'green' ? GREEN_COLORS : ORANGE_COLORS;
    if (count === 0) return colors[0];
    if (count < 15) return colors[1]; // 0-14 minutes
    if (count < 30) return colors[2]; // 15-29 minutes
    if (count < 60) return colors[3]; // 30-59 minutes
    return colors[4]; // 60+ minutes
  }

  const currentColors = colorTheme === 'green' ? GREEN_COLORS : ORANGE_COLORS;

  // Fonction pour gérer le clic sur une case
  const handleCellClick = async (date: Date, count: number) => {
    if (count === 0) return; // Ne rien faire si pas de sessions

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    if (selectedDate === dateKey) {
      // Fermer la section si on clique sur la même date
      setIsClosing(true); // Déclencher l'animation de fermeture des cartes
      setTimeout(() => {
        setIsExpanded(false); // Fermer la section
        setTimeout(() => {
          setSelectedDate(null);
          setSessions([]);
          setIsClosing(false); // Réinitialiser l'état de fermeture
        }, 500); // Attendre la fin de l'animation de la section
      }, 300); // Attendre la fin de l'animation des cartes
    } else {
      // Ouvrir une nouvelle date
      setSelectedDate(dateKey);
      setIsExpanded(false); // Fermer d'abord
      setIsClosing(false); // Réinitialiser l'état de fermeture

      // Charger les sessions
      setSessionsLoading(true);
      try {
        const result = await getSessionsByDate(dateKey);
        if (result.success) {
          setSessions(result.data);
          // Déclencher l'animation après un court délai
          setTimeout(() => setIsExpanded(true), 50);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error);
      } finally {
        setSessionsLoading(false);
      }
    }
  };

  // Fonction pour formater la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(8px)',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        width: '100%',
        maxWidth: '1500px',
        margin: '2rem auto',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        isolation: 'isolate',
        color: 'white',
        padding: '1.25rem',
      }}
    >
      {/* Effet de verre avec pseudo-élément */}
      <div
        style={{
          content: '',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, transparent 55%, rgba(0, 0, 0, 0.1))',
          pointerEvents: 'none',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0.5rem 0.5rem 2.5rem inset',
          zIndex: -1,
          borderRadius: '1rem',
        }}
      />

      {/* Titre avec nombre total de contributions */}
      <div
        style={{
          marginBottom: 16,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: 0,
            marginBottom: '1rem',
          }}
        >
          {formatDuration(totalContributions)} de pratique en {selectedYear}
        </h2>
      </div>

      {/* Heatmap */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Partie heatmap avec mois */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Labels des mois */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 8,
              position: 'relative',
              width: `${data.length * 23}px`, // 18px (largeur carré) + 5px (gap)
              height: '20px', // Hauteur fixe pour les mois
            }}
          >
            {monthLabels.map((label, index) => (
              <span
                key={index}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 12,
                  position: 'absolute',
                  left: `${label.position * 23}px`, // Position basée sur l'index de la semaine
                  top: '0px',
                  fontWeight: '500',
                }}
              >
                {label.month}
              </span>
            ))}
          </div>

          {/* Grille avec spinner de chargement */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              position: 'relative',
            }}
          >
            {loading ? (
              // Spinner centré sur la grille pendant le chargement
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: `${data.length * 23}px`,
                  height: '126px', // 7 * 18px + 6 * 5px (gap)
                }}
                className="flex flex-col items-center justify-center"
              >
                <p className="text-white">Chargement de l'année en cours...</p>
                <Spinner variant="bars" size={32} className="text-white" />
              </div>
            ) : null}

            {data.map((week, wi) => (
              <div
                key={wi}
                style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
              >
                {week.map((count, di) => {
                  // Calculer la date réelle pour les tooltips
                  let dateStr = '';
                  let tooltip = '';
                  let currentDate: Date | null = null;

                  if (count !== null) {
                    // Calculer la date du 1er janvier
                    const startDate = new Date(selectedYear, 0, 1);
                    const startDayOfWeek = startDate.getDay();
                    const mondayStartDay =
                      startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculer le nombre de jours depuis le 1er janvier
                    const cellIndex = wi * 7 + di;
                    const daysSinceStart = cellIndex - mondayStartDay;

                    currentDate = new Date(selectedYear, 0, 1 + daysSinceStart);
                    const dayName = currentDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                    });
                    // Utiliser une méthode qui respecte le fuseau horaire local
                    const tooltipYear = currentDate.getFullYear();
                    const tooltipMonth = String(
                      currentDate.getMonth() + 1
                    ).padStart(2, '0');
                    const tooltipDay = String(currentDate.getDate()).padStart(
                      2,
                      '0'
                    );
                    dateStr = `${tooltipDay}/${tooltipMonth}/${tooltipYear}`;
                    tooltip = `${count} minutes de pratique le ${dayName} ${dateStr}`;
                  }

                  // Utiliser une méthode qui respecte le fuseau horaire local pour la dateKey
                  let dateKey = '';
                  if (currentDate) {
                    const keyYear = currentDate.getFullYear();
                    const keyMonth = String(
                      currentDate.getMonth() + 1
                    ).padStart(2, '0');
                    const keyDay = String(currentDate.getDate()).padStart(
                      2,
                      '0'
                    );
                    dateKey = `${keyYear}-${keyMonth}-${keyDay}`;
                  }
                  const isSelected = selectedDate === dateKey;

                  return count !== null ? (
                    <Tippy
                      content={tooltip}
                      delay={[0, 0]}
                      key={di}
                      placement="top"
                    >
                      <div
                        onClick={() =>
                          currentDate && handleCellClick(currentDate, count)
                        }
                        style={{
                          width: 18,
                          height: 18,
                          background: getColor(count),
                          borderRadius: 5,
                          marginBottom: di === 6 ? 0 : 0,
                          opacity: loading ? 0.3 : 1, // Réduire l'opacité pendant le chargement
                          cursor: count > 0 ? 'pointer' : 'default',
                          border: isSelected ? '2px solid white' : 'none',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </Tippy>
                  ) : (
                    <div
                      key={di}
                      style={{
                        width: 18,
                        height: 18,
                        background: 'transparent',
                        borderRadius: 5,
                        marginBottom: di === 6 ? 0 : 0,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Légende + Dropdown + Boutons couleur à droite, en colonne */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                marginRight: 4,
              }}
            >
              Moins
            </span>
            {currentColors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  background: color,
                  borderRadius: 5,
                  margin: '0 4px',
                }}
              />
            ))}
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              Plus
            </span>
          </div>

          <div
            style={{
              marginTop: 25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: 'white',
                backdropFilter: 'blur(4px)',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                  style={{ color: '#fff', background: '#161b22' }}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 25, display: 'flex', gap: 8 }}>
            <button
              onClick={() => setColorTheme('green')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border:
                  colorTheme === 'green'
                    ? '2px solid #60a5fa'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor:
                  colorTheme === 'green'
                    ? 'rgba(12, 45, 72, 0.3)'
                    : 'rgba(0, 0, 0, 0.1)',
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease',
              }}
            >
              Bleu
            </button>
            <button
              onClick={() => setColorTheme('orange')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border:
                  colorTheme === 'orange'
                    ? '2px solid #fb923c'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor:
                  colorTheme === 'orange'
                    ? 'rgba(124, 45, 18, 0.3)'
                    : 'rgba(0, 0, 0, 0.1)',
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease',
              }}
            >
              Orange
            </button>
          </div>
        </div>
      </div>

      {/* Section des sessions sélectionnées avec animation */}
      {selectedDate && (
        <div
          style={{
            marginTop: '2rem',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: 0,
              }}
            >
              Sessions du {formatDate(selectedDate)}
            </h3>
            <button
              onClick={() => {
                setIsClosing(true); // Déclencher l'animation de fermeture des cartes
                setTimeout(() => {
                  setIsExpanded(false); // Fermer la section
                  setTimeout(() => {
                    setSelectedDate(null);
                    setSessions([]);
                    setIsClosing(false); // Réinitialiser l'état de fermeture
                  }, 500); // Attendre la fin de l'animation de la section
                }, 300); // Attendre la fin de l'animation des cartes
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Fermer
            </button>
          </div>

          <div
            style={{
              overflow: 'hidden',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              maxHeight: isExpanded ? '1000px' : '0px',
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            {sessionsLoading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                }}
              >
                <Spinner variant="bars" size={24} className="text-white" />
              </div>
            ) : sessions.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    style={{
                      animation:
                        isExpanded && !isClosing
                          ? 'slideInUp 0.6s ease forwards'
                          : isClosing
                          ? 'slideOutDown 0.3s ease forwards'
                          : 'none',
                      animationDelay: isClosing
                        ? `${(sessions.length - 1 - index) * 0.05}s`
                        : `${index * 0.15}s`,
                      opacity: isClosing ? 1 : 0,
                      transform: isClosing
                        ? 'translateY(0)'
                        : 'translateY(20px)',
                    }}
                  >
                    <SessionCard session={session} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Aucune session trouvée pour cette date.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
