'use client';

import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { getHeatmapData } from '@/lib/actions/heatmap-actions';
import { ScoreDurationData } from '@/lib/services/performances-services';

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
type Week = (number | null)[]; // null pour les jours vides

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
    const dateKey = item.date.toISOString().split('T')[0]; // Format YYYY-MM-DD
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
        const dateKey = currentDate.toISOString().split('T')[0];
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

export const Heatmap: React.FC = () => {
  // Années disponibles
  const years = [2023, 2024, 2025];
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [colorTheme, setColorTheme] = useState<'green' | 'orange'>('green');
  const [performanceData, setPerformanceData] = useState<ScoreDurationData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

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

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'white',
        }}
      >
        Chargement de l'année en cours...
      </div>
    );
  }

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
          {totalContributions} minutes de pratique en {selectedYear}
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

          {/* Grille */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
            {data.map((week, wi) => (
              <div
                key={wi}
                style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
              >
                {week.map((count, di) => {
                  // Calculer la date réelle pour les tooltips
                  let dateStr = '';
                  let tooltip = '';

                  if (count !== null) {
                    // Calculer la date du 1er janvier
                    const startDate = new Date(selectedYear, 0, 1);
                    const startDayOfWeek = startDate.getDay();
                    const mondayStartDay =
                      startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculer le nombre de jours depuis le 1er janvier
                    const cellIndex = wi * 7 + di;
                    const daysSinceStart = cellIndex - mondayStartDay;

                    const date = new Date(selectedYear, 0, 1 + daysSinceStart);
                    const dayName = date.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                    });
                    dateStr = date.toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    });
                    tooltip = `${count} minutes de pratique le ${dayName} ${dateStr}`;
                  }

                  return count !== null ? (
                    <Tippy
                      content={tooltip}
                      delay={[0, 0]}
                      key={di}
                      placement="top"
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          background: getColor(count),
                          borderRadius: 5,
                          marginBottom: di === 6 ? 0 : 0,
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
              marginTop: 10,
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
            }}
          >
            <div>0 min</div>
            <div>15 min</div>
            <div>30 min</div>
            <div>60+ min</div>
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
    </div>
  );
};

export default Heatmap;
