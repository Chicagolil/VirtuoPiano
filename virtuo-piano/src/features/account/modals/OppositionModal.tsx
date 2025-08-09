import { IconBan, IconX } from '@tabler/icons-react';

interface OppositionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OppositionModal({
  isOpen,
  onClose,
}: OppositionModalProps) {
  if (!isOpen) return null;

  const handleWithdrawConsent = () => {
    // Ici sera ajoutée la logique de retrait de consentement et redirection
    console.log('Consentement retiré - redirection vers login');
    onClose();
    // Redirection vers la page de connexion
    // window.location.href = '/auth/login';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-orange-500/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400">
              <IconBan size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Droit d'opposition
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/80 mb-4">
            Vous souhaitez retirer votre consentement au traitement de vos
            données personnelles ?
          </p>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
            <h4 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
              <IconBan size={18} />
              Conséquences du retrait de consentement
            </h4>
            <ul className="text-orange-300/80 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                Vous serez immédiatement déconnecté de votre compte
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                L'accès à l'application sera suspendu
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                Vos données seront conservées mais ne seront plus traitées
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                Pour utiliser à nouveau l'application, vous devrez réaccepter la
                politique de confidentialité
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleWithdrawConsent}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconBan size={18} />
            Retirer consentement
          </button>
        </div>
      </div>
    </div>
  );
}
