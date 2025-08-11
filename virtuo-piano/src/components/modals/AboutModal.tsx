'use client';

import { IconX, IconInfoCircle } from '@tabler/icons-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
              <IconInfoCircle size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              À propos de Virtuo Piano
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              🎹 Bienvenue dans l'univers immersif de Virtuo Piano
            </h3>
            <p className="text-white/80 leading-relaxed">
              Virtuo Piano est une application en réalité virtuelle innovante
              conçue pour transformer l'apprentissage du piano. Grâce à un
              casque VR, vous plongez dans un environnement musical interactif
              qui combine technologie immersive et pédagogie musicale
              traditionnelle, rendant la pratique plus vivante et engageante que
              jamais.
            </p>
          </div>

          {/* Le projet */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              🎯 Notre Vision
            </h3>
            <p className="text-white/80 leading-relaxed">
              Nous croyons que l'apprentissage de la musique devrait être
              immersif, interactif et accessible. Virtuo Piano transforme votre
              casque VR en un véritable professeur de piano virtuel, vous
              guidant au cœur d'un univers en 3D où chaque note, chaque mélodie
              et chaque progression prennent vie autour de vous.
            </p>
          </div>

          {/* Fonctionnalités principales */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              ✨ Ce que nous offrons
            </h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>
                  <strong className="text-white">
                    Partitions interactives en 3D :
                  </strong>{' '}
                  Visualisez et jouez des morceaux dans un espace immersif avec
                  un système de notation avancé
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>
                  <strong className="text-white">Suivi de progression :</strong>{' '}
                  Analysez vos performances et célébrez vos réussites grâce à un
                  retour visuel et sonore en temps réel
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>
                  <strong className="text-white">
                    Bibliothèque musicale :
                  </strong>{' '}
                  Explorez un vaste répertoire, du classique au contemporain,
                  directement depuis votre environnement virtuel
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>
                  <strong className="text-white">Défis personnalisés :</strong>{' '}
                  Relevez des challenges adaptés à votre niveau, pour progresser
                  tout en restant plongé dans l'expérience VR
                </span>
              </li>
            </ul>
          </div>

          {/* Le créateur */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              👨‍💻 Derrière le projet
            </h3>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-white/80 leading-relaxed">
                <strong className="text-white">Virtuo Piano</strong> est né de
                la passion d'un étudiant en technologies de l'informatique à
                l'EPHEC. Ce projet représente un
                <strong className="text-white">
                  {' '}
                  Travail de Fin d'Études (TFE)
                </strong>{' '}
                qui combine expertise technique et amour de la musique.
              </p>
              <p className="text-white/80 leading-relaxed mt-3">
                Développé avec les technologies web les plus modernes, Virtuo
                Piano démontre comment l'innovation technologique peut enrichir
                l'expérience d'apprentissage et rendre la musique accessible à
                tous.
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              🛠️ Technologies utilisées
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <strong className="text-white">Frontend :</strong>
                <p className="text-white/60 mt-1">
                  Next.js, React, TypeScript, Tailwind CSS
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <strong className="text-white">Backend :</strong>
                <p className="text-white/60 mt-1">
                  Node.js, Prisma, PostgreSQL
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <strong className="text-white">Authentification :</strong>
                <p className="text-white/60 mt-1">NextAuth.js, JWT</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <strong className="text-white">Sécurité :</strong>
                <p className="text-white/60 mt-1">
                  Argon2, RGPD, Validation Zod
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              💬 Restons en contact
            </h3>
            <p className="text-white/80">
              Des questions, suggestions ou envie de partager votre expérience ?
              N'hésitez pas à nous contacter via le bouton "Contact" du footer !
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-white/60 text-sm">
            © 2024 Virtuo Piano - Développé avec ❤️ pour la musique
          </p>
        </div>
      </div>
    </div>
  );
}
