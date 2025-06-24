import React from 'react';
import { SessionDetail } from '@/lib/services/performances-services';
import { formatDuration } from '@/common/utils/function';
import { sessionCardStyles } from './SessionCard.styles';

interface SessionCardProps {
  session: SessionDetail;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLearningMode = session.modeName === 'Apprentissage';

  return (
    <div style={sessionCardStyles.card}>
      <div style={sessionCardStyles.header}>
        <div>
          <h4 style={sessionCardStyles.title}>{session.songTitle}</h4>
          {session.songComposer && (
            <p style={sessionCardStyles.composer}>{session.songComposer}</p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={sessionCardStyles.modeBadge(isLearningMode)}>
            {session.modeName}
          </span>
        </div>
      </div>

      <div style={sessionCardStyles.timeInfo}>
        <div style={sessionCardStyles.timeDetails}>
          <span style={sessionCardStyles.timeText}>
            {formatTime(session.sessionStartTime)} -{' '}
            {formatTime(session.sessionEndTime)}
          </span>
          <span style={sessionCardStyles.timeText}>
            {formatDuration(session.durationInMinutes)}
          </span>
        </div>
        {session.totalPoints && (
          <span style={sessionCardStyles.points}>
            {session.totalPoints} pts
          </span>
        )}
      </div>

      <div style={sessionCardStyles.stats}>
        {session.maxCombo && (
          <div style={sessionCardStyles.statLabel}>
            Combo Maximal:{' '}
            <span style={sessionCardStyles.statValue}>x{session.maxCombo}</span>
          </div>
        )}
        {session.maxMultiplier && (
          <div style={sessionCardStyles.statLabel}>
            Multiplicateur Maximal:{' '}
            <span style={sessionCardStyles.statValue}>
              x{session.maxMultiplier}
            </span>
          </div>
        )}
        {session.accuracy ? (
          <div style={sessionCardStyles.statLabel}>
            Précision:{' '}
            <span style={sessionCardStyles.statValue}>{session.accuracy}%</span>
          </div>
        ) : null}
        {session.performance ? (
          <div style={sessionCardStyles.statLabel}>
            Performance:{' '}
            <span style={sessionCardStyles.statValue}>
              {session.performance}%
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
