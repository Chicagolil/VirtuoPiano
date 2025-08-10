import { IconEdit, IconX, IconCheck, IconRefresh } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useUpdateUserData, useGetUserData } from '@/customHooks/useRgpdRights';
import toast from 'react-hot-toast';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditDataModal({ isOpen, onClose }: EditDataModalProps) {
  const updateUserDataMutation = useUpdateUserData();
  const { data: userData, isLoading } = useGetUserData();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    resetLevel: false,
  });

  // Mettre à jour les valeurs du formulaire quand les données utilisateur sont chargées
  useEffect(() => {
    if (userData?.data) {
      setFormData((prev) => ({
        ...prev,
        userName: userData.data?.userName || '',
        email: userData.data?.email || '',
      }));
    }
  }, [userData]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Validation des champs côté client
    if (!formData.userName.trim()) {
      toast.error("Le nom d'utilisateur ne peut pas être vide");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("L'adresse email ne peut pas être vide");
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      toast.error('Veuillez saisir votre mot de passe actuel');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      toast.error(
        'Le nouveau mot de passe doit contenir au moins 8 caractères'
      );
      return;
    }

    // Préparer les données à envoyer
    const updateData: any = {};

    if (formData.userName !== userData?.data?.userName) {
      updateData.userName = formData.userName;
    }

    if (formData.email !== userData?.data?.email) {
      updateData.email = formData.email;
    }

    if (formData.currentPassword && formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    if (formData.resetLevel) {
      updateData.resetLevel = true;
    }

    // Envoyer les données
    try {
      const result = await updateUserDataMutation.mutateAsync(updateData);
      if (result.success) {
        toast.success('Données mises à jour avec succès !');
        onClose();
      } else {
        toast.error(`Erreur : ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Une erreur est survenue lors de la mise à jour des données');
    }
  };

  const handleReset = () => {
    if (userData?.data) {
      setFormData({
        userName: userData.data?.userName || '',
        email: userData.data?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        resetLevel: false,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
          <div className="flex items-center justify-center">
            <div className="text-white">Chargement des données...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
              <IconEdit size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Modifier vos données
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
            Exercez votre droit de rectification en corrigeant ou mettant à jour
            vos informations personnelles.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Changer le mot de passe
              </label>
              <div className="space-y-3">
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange('currentPassword', e.target.value)
                  }
                  placeholder="Mot de passe actuel"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange('newPassword', e.target.value)
                  }
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  placeholder="Confirmer le nouveau mot de passe"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Réinitialiser le niveau
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.resetLevel}
                    onChange={(e) =>
                      handleInputChange('resetLevel', e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-white/10 border border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white/80 text-sm">
                    Remettre mon niveau à 1 et mes points d'expérience à 0
                  </span>
                </label>
              </div>
              {formData.resetLevel && (
                <div className="mt-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="text-orange-300 text-sm">
                    ⚠️ <strong>Attention :</strong> Cette action remettra votre
                    niveau à 1 et vos points d'expérience à 0. Cette action est
                    irréversible et vous perdrez toute votre progression de
                    niveau.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Important :</strong> Ces modifications seront
              appliquées immédiatement. Vous pouvez toujours les modifier
              ultérieurement.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={updateUserDataMutation.isPending}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconRefresh size={18} />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={updateUserDataMutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconCheck size={18} />
            {updateUserDataMutation.isPending
              ? 'Mise à jour...'
              : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}
