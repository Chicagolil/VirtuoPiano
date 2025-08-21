'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Music, FileText, User, Clock } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    composer: '',
    difficulty: '5',
    genre: '',
    songType: 'song',
    key: 'C major',
    image: null as File | null,
    file: null as File | null,
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Préparer les données pour la page de récapitulatif
    const imageUrl = formData.image
      ? URL.createObjectURL(formData.image)
      : null;
    const midiUrl = formData.file ? URL.createObjectURL(formData.file) : null;

    const payload = {
      title: formData.title,
      composer: formData.composer,
      difficulty: formData.difficulty,
      genre: formData.genre,
      songType: formData.songType,
      key: formData.key,
      imageUrl,
      imageName: formData.image?.name ?? null,
      midiUrl,
      midiName: formData.file?.name ?? null,
    };

    try {
      sessionStorage.setItem('importReview:data', JSON.stringify(payload));
      router.push('/imports/review');
    } catch (err) {
      console.error('Impossible de préparer la page de récapitulatif:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      setFormData((prev) => ({ ...prev, image }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête de la modale */}
        <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-orange-500/30 rounded-lg flex items-center justify-center">
                <Upload size={20} className="text-orange-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Importer une chanson
                </h2>
                <p className="text-white/70 text-sm">
                  Ajoutez votre composition ou morceau personnalisé
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Contenu de la modale */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Titre de la chanson *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-orange-300 focus:outline-none transition-colors duration-200"
                  placeholder="Ex: Nocturne en mi mineur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Compositeur
                </label>
                <input
                  type="text"
                  value={formData.composer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      composer: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-orange-300 focus:outline-none transition-colors duration-200"
                  placeholder="Ex: Frédéric Chopin"
                />
              </div>
            </div>

            {/* Difficulté, type de musique et gamme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Niveau de difficulté (1 à 10)
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-300 focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fbbf24' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(
                    (v) => (
                      <option
                        key={v}
                        value={v}
                        className="bg-slate-800 text-white hover:bg-slate-700"
                      >
                        {v}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Type de musique
                </label>
                <select
                  value={formData.songType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      songType: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-300 focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fbbf24' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option
                    value="song"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Chanson
                  </option>
                  <option
                    value="arpeggioEx"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Arpèges
                  </option>
                  <option
                    value="scaleEx"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Gammes
                  </option>
                  <option
                    value="chordEx"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Accords
                  </option>
                  <option
                    value="rythmEx"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Exercice rythmique
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Gamme
                </label>
                <select
                  value={formData.key}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      key: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-300 focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fbbf24' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option
                    value="C major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Do majeur
                  </option>
                  <option
                    value="G major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Sol majeur
                  </option>
                  <option
                    value="D major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Ré majeur
                  </option>
                  <option
                    value="A major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    La majeur
                  </option>
                  <option
                    value="E major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Mi majeur
                  </option>
                  <option
                    value="B major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Si majeur
                  </option>
                  <option
                    value="F# major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Fa# majeur
                  </option>
                  <option
                    value="C# major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Do# majeur
                  </option>
                  <option
                    value="F major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Fa majeur
                  </option>
                  <option
                    value="Bb major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Sib majeur
                  </option>
                  <option
                    value="Eb major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Mib majeur
                  </option>
                  <option
                    value="Ab major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Lab majeur
                  </option>
                  <option
                    value="Db major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Réb majeur
                  </option>
                  <option
                    value="Gb major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Solb majeur
                  </option>
                  <option
                    value="Cb major"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Dob majeur
                  </option>
                  <option
                    value="A minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    La mineur
                  </option>
                  <option
                    value="E minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Mi mineur
                  </option>
                  <option
                    value="B minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Si mineur
                  </option>
                  <option
                    value="F# minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Fa# mineur
                  </option>
                  <option
                    value="C# minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Do# mineur
                  </option>
                  <option
                    value="G# minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Sol# mineur
                  </option>
                  <option
                    value="D# minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Ré# mineur
                  </option>
                  <option
                    value="A# minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    La# mineur
                  </option>
                  <option
                    value="D minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Ré mineur
                  </option>
                  <option
                    value="G minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Sol mineur
                  </option>
                  <option
                    value="C minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Do mineur
                  </option>
                  <option
                    value="F minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Fa mineur
                  </option>
                  <option
                    value="Bb minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Sib mineur
                  </option>
                  <option
                    value="Eb minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Mib mineur
                  </option>
                  <option
                    value="Ab minor"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Lab mineur
                  </option>
                </select>
              </div>
            </div>

            {/* Genre musical */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Genre musical
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, genre: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-orange-300 focus:outline-none transition-colors duration-200"
                placeholder="Ex: Classique, Jazz, Pop..."
              />
            </div>

            {/* Upload de photo et fichier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload de photo */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Photo de couverture
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-orange-300 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                        <Upload size={20} className="text-orange-300" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          Ajouter une image
                        </p>
                        <p className="text-white/60 text-xs mt-1">
                          JPG, PNG, GIF
                        </p>
                      </div>
                    </div>
                  </label>
                  {formData.image && (
                    <div className="mt-3 p-2 bg-white/5 rounded-lg">
                      <p className="text-white text-xs">
                        <Upload size={12} className="inline mr-1" />
                        {formData.image.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload de fichier */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Fichier de partition *
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-orange-300 transition-colors duration-200">
                  <input
                    type="file"
                    accept=".mid,.midi"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-orange-300" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          Sélectionner un fichier MIDI
                        </p>
                        <p className="text-white/60 text-xs mt-1">
                          .mid ou .midi uniquement
                        </p>
                      </div>
                    </div>
                  </label>
                  {formData.file && (
                    <div className="mt-3 p-2 bg-white/5 rounded-lg">
                      <p className="text-white text-xs">
                        <FileText size={12} className="inline mr-1" />
                        {formData.file.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-white/70 hover:text-white border border-white/20 hover:border-white/30 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Importer la chanson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
