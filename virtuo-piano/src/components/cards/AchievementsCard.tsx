import { IconAward, IconChevronRight } from '@tabler/icons-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
}

export default function AchievementsCard({
  achievements,
}: {
  achievements: Achievement[];
}) {
  return (
    <div className="bg-white/3 shadow-md rounded-2xl p-5 border border-slate-200/10 dark:border-slate-700/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <IconAward size={20} className="mr-2 text-amber-400" />
          Réussites
        </h2>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center">
          Voir tout
          <IconChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="group">
            <div className="flex items-start">
              <div
                className={`p-2 rounded-lg ${
                  achievement.progress >= 100
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
                } mr-3`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white">
                    {achievement.title}
                    {achievement.progress >= 100 && (
                      <span className="ml-2 text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full">
                        Complété
                      </span>
                    )}
                  </h3>
                  <span className="text-xs font-medium text-white/70">
                    {achievement.progress}%
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5 mb-1.5">
                  {achievement.description}
                </p>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      achievement.progress >= 100
                        ? 'bg-amber-500'
                        : achievement.progress > 66
                        ? 'bg-emerald-500'
                        : achievement.progress > 33
                        ? 'bg-blue-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
