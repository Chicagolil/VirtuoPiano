'use client';

import React, { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Spinner } from '@/components/ui/spinner';
import { SessionCard } from '@/features/performances/SessionCard';
import { useHeatmap } from '@/customHooks/useHeatmap';
import {
  formatDuration,
  generateEmptyGrid,
  generateMonthLabels,
} from '@/common/utils/function';
import {
  HEATMAP_COLORS,
  ANIMATION_STYLES,
  HEATMAP_YEARS,
} from '@/common/constants/heatmaps';
import { containerStyles } from './heatmap.styles';

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

export const Heatmap: React.FC = () => {
  const {
    data,
    loading,
    selectedYear,
    selectedDate,
    sessions,
    sessionsLoading,
    isExpanded,
    isClosing,
    colorTheme,
    monthLabels,
    totalContributions,
    setSelectedYear,
    setColorTheme,
    handleCellClick,
    closeSessions,
  } = useHeatmap();

  // Injecter les styles CSS pour les animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = ANIMATION_STYLES;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Utiliser les données réelles ou une grille vide pendant le chargement
  const displayData = loading ? generateEmptyGrid(selectedYear) : data;
  const displayMonthLabels = loading
    ? generateMonthLabels(selectedYear, displayData)
    : monthLabels;
  const displayTotalContributions = loading ? 0 : totalContributions;

  return (
    <div style={containerStyles.main}>
      {/* Effet de verre avec pseudo-élément */}
      <div style={containerStyles.glassEffect} />

      {/* Titre avec nombre total de contributions */}
      <div style={containerStyles.title}>
        <h2 style={containerStyles.titleText}>
          {loading
            ? 'Chargement des données...'
            : formatDuration(displayTotalContributions) +
              ' de pratique en ' +
              selectedYear}
        </h2>
      </div>

      {/* Heatmap */}
      <div style={containerStyles.heatmapContainer}>
        {/* Partie heatmap avec mois */}
        <div style={containerStyles.gridContainer}>
          {/* Labels des mois */}
          <div
            style={{
              ...containerStyles.monthLabels,
              width: `${displayData.length * 23}px`,
            }}
          >
            {displayMonthLabels.map((label, index) => (
              <span
                key={index}
                style={{
                  ...containerStyles.monthLabel,
                  left: `${label.position * 23}px`,
                }}
              >
                {label.month}
              </span>
            ))}
          </div>

          {/* Grille */}
          <div style={containerStyles.grid}>
            {loading && (
              <div
                style={containerStyles.loadingOverlay(displayData.length)}
                className="flex flex-col items-center justify-center"
              >
                <p className="text-white">Chargement de l'année en cours...</p>
                <Spinner variant="bars" size={32} className="text-white" />
              </div>
            )}

            {displayData.map((week, wi) => (
              <div key={wi} style={containerStyles.week}>
                {week.map((count, di) => {
                  let dateStr = '';
                  let tooltip = '';
                  let currentDate: Date | null = null;

                  if (count !== null) {
                    const startDate = new Date(selectedYear, 0, 1);
                    const startDayOfWeek = startDate.getDay();
                    const mondayStartDay =
                      startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    const cellIndex = wi * 7 + di;
                    const daysSinceStart = cellIndex - mondayStartDay;

                    currentDate = new Date(selectedYear, 0, 1 + daysSinceStart);
                    const dayName = currentDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                    });
                    const tooltipYear = currentDate.getFullYear();
                    const tooltipMonth = String(
                      currentDate.getMonth() + 1
                    ).padStart(2, '0');
                    const tooltipDay = String(currentDate.getDate()).padStart(
                      2,
                      '0'
                    );
                    dateStr = `${tooltipDay}/${tooltipMonth}/${tooltipYear}`;
                    tooltip = loading
                      ? `${dayName} ${dateStr} - Aucune session`
                      : `${count} minutes de pratique le ${dayName} ${dateStr}`;
                  }

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
                          currentDate &&
                          !loading &&
                          handleCellClick(currentDate, count)
                        }
                        style={containerStyles.cell(
                          count,
                          isSelected,
                          loading,
                          colorTheme
                        )}
                      />
                    </Tippy>
                  ) : (
                    <div
                      key={di}
                      style={containerStyles.cell(
                        null,
                        false,
                        loading,
                        colorTheme
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Légende + Dropdown + Boutons couleur à droite, en colonne */}
        <div style={containerStyles.legendContainer}>
          <div style={containerStyles.legend}>
            <span style={containerStyles.legendText}>Moins</span>
            {HEATMAP_COLORS[colorTheme].map((color, i) => (
              <div
                key={i}
                style={{
                  ...containerStyles.legendColor,
                  background: color,
                }}
              />
            ))}
            <span style={containerStyles.legendText}>Plus</span>
          </div>

          <div style={containerStyles.controls}>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={containerStyles.yearSelect}
            >
              {HEATMAP_YEARS.map((year) => (
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
          <div style={containerStyles.colorButtons}>
            <button
              onClick={() => setColorTheme('green')}
              style={containerStyles.colorButton(
                colorTheme === 'green',
                'green'
              )}
            >
              Bleu
            </button>
            <button
              onClick={() => setColorTheme('orange')}
              style={containerStyles.colorButton(
                colorTheme === 'orange',
                'orange'
              )}
            >
              Orange
            </button>
          </div>
        </div>
      </div>

      {/* Section des sessions sélectionnées avec animation */}
      {selectedDate && (
        <div style={containerStyles.sessionsSection}>
          <div style={containerStyles.sessionsHeader}>
            <h3 style={containerStyles.sessionsTitle}>
              Sessions du {formatDate(selectedDate)}
            </h3>
            <button
              onClick={closeSessions}
              style={containerStyles.closeButton}
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
              ...containerStyles.sessionsContent,
              maxHeight: isExpanded ? '1000px' : '0px',
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            {sessionsLoading ? (
              <div style={containerStyles.loadingSpinner}>
                <Spinner variant="bars" size={24} className="text-white" />
              </div>
            ) : sessions.length > 0 ? (
              <div style={containerStyles.sessionsList}>
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    style={containerStyles.sessionItem(
                      isExpanded,
                      isClosing,
                      index,
                      sessions.length
                    )}
                  >
                    <SessionCard session={session} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={containerStyles.noSessions}>
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
