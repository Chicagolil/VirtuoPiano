import React from 'react';

export default function PlayedSongs() {
  return (
    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Chansons Jouées
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mt-2">
        Cette section listera toutes les chansons que vous avez jouées, avec vos
        statistiques pour chacune.
      </p>
    </div>
  );
}
