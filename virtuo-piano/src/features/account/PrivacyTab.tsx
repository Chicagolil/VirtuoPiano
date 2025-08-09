import { IconChartBar, IconKey, IconShield } from '@tabler/icons-react';
import styles from './AccountPage.module.css';

export default function PrivacyTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white/3 shadow-md rounded-2xl p-6 border border-slate-200/10 dark:border-slate-700/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500/20 p-3 rounded-lg text-green-400">
            <IconShield size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Consentements RGPD
            </h3>
            <p className="text-sm text-white/70">
              Gérez vos préférences concernant l'utilisation de vos données
              personnelles
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <IconChartBar size={18} className="text-blue-400" />
                <strong className="text-white">Données de performance</strong>
              </div>
              <p className="text-sm text-white/70">
                Collecte et analyse de vos scores et performances pour améliorer
                votre expérience.
              </p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <IconKey size={18} className="text-orange-400" />
                <strong className="text-white">Cookies analytiques</strong>
              </div>
              <p className="text-sm text-white/70">
                Utilisation de cookies pour analyser l'utilisation de
                l'application.
              </p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-6 py-2 rounded-lg font-medium transition-colors">
            Sauvegarder les préférences
          </button>
          <button className="bg-white/5 hover:bg-white/10 text-white/70 px-6 py-2 rounded-lg font-medium transition-colors">
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
