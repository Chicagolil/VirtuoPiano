import UserAvatar from '@/components/badge/UserAvatar';
import ProgressBar from '@/components/ProgressBar';
import {
  IconEdit,
  IconTarget,
  IconClock,
  IconGift,
  IconStar,
  IconTrophy,
  IconAward,
  IconLock,
  IconCheck,
  IconChevronRight,
} from '@tabler/icons-react';
import { useState } from 'react';
export default function ProfilTab() {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(7); // heures
  const [tempGoal, setTempGoal] = useState(weeklyGoal);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [claimedChallenges, setClaimedChallenges] = useState<Set<string>>(
    new Set()
  );

  // Données simulées pour les défis multi-niveaux
  const mockChallenges = [
    {
      id: 'easy-songs',
      name: 'Maîtrise des chansons faciles',
      description: 'Progressez en jouant des chansons de niveau facile',
      category: 'difficulty',
      levels: [
        {
          id: 'easy-1',
          level: 1,
          name: 'Débutant',
          description: 'Jouez 5 chansons de niveau facile',
          requirement: 5,
          currentProgress: 3,
          isCompleted: false,
          isUnlocked: true,
          reward: { xp: 50, badge: 'easy_beginner' },
        },
        {
          id: 'easy-2',
          level: 2,
          name: 'Intermédiaire',
          description: 'Jouez 10 chansons de niveau facile',
          requirement: 10,
          currentProgress: 0,
          isCompleted: false,
          isUnlocked: false,
          reward: { xp: 100, badge: 'easy_intermediate' },
        },
        {
          id: 'easy-3',
          level: 3,
          name: 'Avancé',
          description: 'Jouez 20 chansons de niveau facile',
          requirement: 20,
          currentProgress: 0,
          isCompleted: false,
          isUnlocked: false,
          reward: { xp: 200, badge: 'easy_master' },
        },
      ],
    },
    {
      id: 'practice-time',
      name: 'Temps de pratique',
      description: 'Accumulez du temps de pratique',
      category: 'time',
      levels: [
        {
          id: 'time-1',
          level: 1,
          name: 'Pratiquant débutant',
          description: 'Pratiquez pendant 5 heures au total',
          requirement: 5,
          currentProgress: 5,
          isCompleted: true,
          isUnlocked: true,
          reward: { xp: 75, badge: 'time_beginner' },
        },
        {
          id: 'time-2',
          level: 2,
          name: 'Pratiquant régulier',
          description: 'Pratiquez pendant 20 heures au total',
          requirement: 20,
          currentProgress: 12,
          isCompleted: false,
          isUnlocked: true,
          reward: { xp: 150, badge: 'time_regular' },
        },
        {
          id: 'time-3',
          level: 3,
          name: 'Pratiquant assidu',
          description: 'Pratiquez pendant 50 heures au total',
          requirement: 50,
          currentProgress: 0,
          isCompleted: false,
          isUnlocked: false,
          reward: { xp: 300, badge: 'time_master' },
        },
      ],
    },
    {
      id: 'accuracy',
      name: 'Précision parfaite',
      description: 'Atteignez des scores de précision élevés',
      category: 'performance',
      levels: [
        {
          id: 'acc-1',
          level: 1,
          name: 'Précis',
          description: 'Obtenez 85% de précision sur 3 chansons',
          requirement: 3,
          currentProgress: 3,
          isCompleted: true,
          isUnlocked: true,
          reward: { xp: 100, badge: 'accuracy_good' },
        },
        {
          id: 'acc-2',
          level: 2,
          name: 'Très précis',
          description: 'Obtenez 90% de précision sur 5 chansons',
          requirement: 5,
          currentProgress: 2,
          isCompleted: false,
          isUnlocked: true,
          reward: { xp: 200, badge: 'accuracy_great' },
        },
      ],
    },
  ];

  // Données simulées pour l'objectif hebdomadaire
  const currentWeeklyProgress = 7.5; // heures déjà pratiquées cette semaine
  const progressPercentage = Math.min(
    (currentWeeklyProgress / weeklyGoal) * 100,
    100
  );
  const isGoalCompleted = currentWeeklyProgress >= weeklyGoal;
  const bonusXP = Math.floor(weeklyGoal * 50); // 50 XP par heure d'objectif

  const TempUser = {
    userName: 'John Doe',
    email: 'john.doe@example.com',
    level: 1,
    createdAt: new Date(),
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleSaveGoal = () => {
    setWeeklyGoal(tempGoal);
    setIsEditingGoal(false);
  };

  const handleCancelGoal = () => {
    setTempGoal(weeklyGoal);
    setIsEditingGoal(false);
  };

  const handleClaimReward = () => {
    setHasClaimedReward(true);
    // Ici on pourrait ajouter la logique pour attribuer l'XP
    console.log(`Récompense réclamée: +${bonusXP} XP`);
  };

  const handleClaimChallengeReward = (
    challengeId: string,
    levelId: string,
    xp: number
  ) => {
    setClaimedChallenges((prev) =>
      new Set(prev).add(`${challengeId}-${levelId}`)
    );
    console.log(`Défi réclamé: +${xp} XP`);
  };

  // Calcul des jours restants jusqu'à lundi prochain (réinitialisation hebdomadaire)
  const getDaysUntilNextWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
    const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay; // Si dimanche, 1 jour, sinon 8 - jour actuel
    return daysUntilMonday;
  };

  const daysRemaining = getDaysUntilNextWeek();
  return (
    <div className="space-y-6">
      {/* Carte Profil Utilisateur */}
      <div className="bg-white/3 shadow-md rounded-2xl p-6 border border-slate-200/10 dark:border-slate-700/10">
        <div className="flex items-start space-x-4">
          <UserAvatar name={TempUser.userName} />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">
              {TempUser.userName}
            </h3>
            <p className="text-sm text-white/70">{TempUser.email}</p>
            <p className="text-sm text-white/50 mt-1">
              Membre depuis {formatDate(TempUser.createdAt)}
            </p>
          </div>
          <button className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <IconEdit size={16} />
            Modifier
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold text-xl">
                Niveau {TempUser.level}
              </span>
              <span className="text-white/70 text-sm">Progression niveau</span>
            </div>
            <ProgressBar value={68} max={100} />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-white/60">68% vers le niveau suivant</span>
              <span className="text-white/60">1,360 / 2,000 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Objectif hebdomadaire */}
      <div className="bg-white/3 shadow-md rounded-2xl p-6 border border-slate-200/10 dark:border-slate-700/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400">
              <IconTarget size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  Objectif hebdomadaire
                </h3>
                <div className="bg-blue-500/25 border border-blue-400/50 px-3 py-2 rounded-full shadow-md">
                  <span className="text-blue-200 text-sm font-semibold flex items-center gap-1.5">
                    <IconClock size={16} />
                    {daysRemaining === 1
                      ? 'Demain'
                      : `${daysRemaining} jours`}{' '}
                    restant{daysRemaining > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Gérez votre objectif de pratique
              </p>
            </div>
          </div>
          {!isEditingGoal ? (
            <button
              onClick={() => setIsEditingGoal(true)}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <IconEdit size={16} />
              Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveGoal}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sauver
              </button>
              <button
                onClick={handleCancelGoal}
                className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {isEditingGoal ? (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <IconClock size={20} className="text-white/70" />
              <input
                type="number"
                min="1"
                max="30"
                value={tempGoal}
                onChange={(e) => setTempGoal(Number(e.target.value))}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white w-24 text-center focus:outline-none focus:border-indigo-400 text-lg font-medium"
              />
              <span className="text-white/70 text-lg">heures par semaine</span>
            </div>
          </div>
        ) : (
          <>
            {isGoalCompleted ? (
              <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-xl p-6 border border-yellow-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

                <div className="relative z-10 text-center space-y-5">
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-yellow-400/30 to-orange-500/30 p-4 rounded-full border border-yellow-400/50 shadow-lg">
                      <IconTrophy
                        size={40}
                        className="text-yellow-400 animate-bounce"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                      🎉 Objectif accompli !
                    </h4>
                    <p className="text-white/80 text-lg">
                      Félicitations ! Vous avez complété votre objectif
                      hebdomadaire
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/70 font-medium">
                        Cette semaine
                      </span>
                      <span className="text-green-400 font-bold text-xl flex items-center gap-1">
                        {currentWeeklyProgress}h / {weeklyGoal}h
                        <IconStar size={20} className="text-yellow-400" />
                      </span>
                    </div>
                    <ProgressBar
                      value={weeklyGoal}
                      max={weeklyGoal}
                      className="mb-3"
                    />
                    <div className="text-center text-green-300 font-semibold">
                      {currentWeeklyProgress > weeklyGoal
                        ? `🌟 +${(currentWeeklyProgress - weeklyGoal).toFixed(
                            1
                          )}h de bonus !`
                        : '✨ Objectif parfaitement atteint !'}
                    </div>
                  </div>

                  {!hasClaimedReward ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-4 border border-indigo-400/40">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <IconGift size={24} className="text-indigo-400" />
                          <span className="text-indigo-300 font-bold text-lg">
                            Récompense disponible
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-yellow-500/20 rounded-lg p-3 border border-yellow-400/30">
                          <IconStar size={24} className="text-yellow-400" />
                          <span className="text-yellow-300 font-bold text-2xl">
                            +{bonusXP} XP
                          </span>
                        </div>
                        <p className="text-white/70 text-sm mt-2">
                          Réclamez votre bonus d'expérience pour progresser plus
                          vite !
                        </p>
                      </div>

                      <button
                        onClick={handleClaimReward}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                      >
                        <IconGift size={24} className="animate-pulse" />
                        Réclamer la récompense
                        <IconStar size={20} className="text-yellow-200" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/40">
                      <div className="flex items-center justify-center gap-3">
                        <div className="bg-green-500/20 p-2 rounded-full">
                          <IconStar size={24} className="text-green-400" />
                        </div>
                        <div>
                          <span className="text-green-300 font-bold text-lg block">
                            Récompense réclamée !
                          </span>
                          <span className="text-white/80">
                            +{bonusXP} XP ajoutés à votre progression
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">
                    Progression cette semaine
                  </span>
                  <span className="text-white font-medium text-lg">
                    {currentWeeklyProgress}h / {weeklyGoal}h
                  </span>
                </div>
                <ProgressBar
                  value={currentWeeklyProgress}
                  max={weeklyGoal}
                  className="mb-3"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">
                    {`${Math.round(progressPercentage)}% complété`}
                  </span>
                  <span className="text-white/60">
                    {`${(weeklyGoal - currentWeeklyProgress).toFixed(
                      1
                    )}h restantes`}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Section Défis */}
      <div className="bg-white/3 shadow-md rounded-2xl p-6 border border-slate-200/10 dark:border-slate-700/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400">
              <IconAward size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Défis et Récompenses
              </h3>
              <p className="text-sm text-white/70">
                Complétez des défis pour gagner de l'XP
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {mockChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white/5 rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-semibold text-white">
                    {challenge.name}
                  </h4>
                  <p className="text-sm text-white/70">
                    {challenge.description}
                  </p>
                </div>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                  {challenge.category}
                </span>
              </div>

              <div className="grid gap-3">
                {challenge.levels.map((level, index) => {
                  const progressPercentage = Math.min(
                    (level.currentProgress / level.requirement) * 100,
                    100
                  );
                  const isCurrentLevel = level.isUnlocked && !level.isCompleted;
                  const isClaimed = claimedChallenges.has(
                    `${challenge.id}-${level.id}`
                  );

                  return (
                    <div
                      key={level.id}
                      className={`relative p-4 rounded-lg border transition-all ${
                        level.isCompleted
                          ? 'bg-green-500/10 border-green-500/30'
                          : isCurrentLevel
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : level.isUnlocked
                          ? 'bg-white/5 border-white/20'
                          : 'bg-gray-500/5 border-gray-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              level.isCompleted
                                ? 'bg-green-500/20 text-green-400'
                                : isCurrentLevel
                                ? 'bg-blue-500/20 text-blue-400'
                                : level.isUnlocked
                                ? 'bg-white/10 text-white/70'
                                : 'bg-gray-500/20 text-gray-500'
                            }`}
                          >
                            {level.isCompleted ? (
                              <IconCheck size={16} />
                            ) : level.isUnlocked ? (
                              <IconStar size={16} />
                            ) : (
                              <IconLock size={16} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                Niveau {level.level}: {level.name}
                              </span>
                              {level.isCompleted && !isClaimed && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full animate-pulse">
                                  Nouveau !
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/60">
                              {level.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {level.isCompleted && !isClaimed ? (
                            <button
                              onClick={() =>
                                handleClaimChallengeReward(
                                  challenge.id,
                                  level.id,
                                  level.reward.xp
                                )
                              }
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
                            >
                              <IconGift size={14} />+{level.reward.xp} XP
                            </button>
                          ) : level.isCompleted && isClaimed ? (
                            <div className="bg-green-500/20 text-green-300 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1">
                              <IconCheck size={14} />
                              Réclamé
                            </div>
                          ) : (
                            <div className="text-xs text-white/50">
                              +{level.reward.xp} XP
                            </div>
                          )}
                        </div>
                      </div>

                      {level.isUnlocked && !level.isCompleted && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60">Progression</span>
                            <span className="text-white/80 font-medium">
                              {level.currentProgress} / {level.requirement}
                            </span>
                          </div>
                          <ProgressBar
                            value={level.currentProgress}
                            max={level.requirement}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
            Voir tous les défis
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
