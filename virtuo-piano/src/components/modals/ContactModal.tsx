import { IconX, IconMail, IconUser, IconMessage } from '@tabler/icons-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          'Message envoyé avec succès ! Nous vous répondrons dans les meilleurs délais.'
        );
        setFormData({ name: '', email: '', subject: '', message: '' });
        onClose();
      } else {
        toast.error(data.message || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-orange-500/30 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400">
              <IconMail size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">Contactez-nous</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Nom complet *
              </label>
              <div className="relative">
                <IconUser
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Adresse email *
              </label>
              <div className="relative">
                <IconMail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="votre.email@exemple.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-white/80 mb-2"
            >
              Sujet *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="Sujet de votre message"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-white/80 mb-2"
            >
              Message *
            </label>
            <div className="relative">
              <IconMessage
                size={18}
                className="absolute left-3 top-3 text-white/50"
              />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="Décrivez votre demande ou votre problème..."
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Note :</strong> Nous nous engageons à vous répondre dans
              les meilleurs délais. Vous recevrez une confirmation par email.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <IconMail size={18} />
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
