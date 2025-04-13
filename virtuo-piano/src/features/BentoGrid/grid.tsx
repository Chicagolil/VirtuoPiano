'use client';

import React from 'react';

const gridItems = [
  { id: 'a', col: 3, row: 2, label: 'Librairie', color: 'bg-orange-400' },
  { id: 'b', col: 2, row: 1, label: 'Favoris', color: 'bg-blue-400' },
  { id: 'c', col: 1, row: 2, label: 'Classement', color: 'bg-green-400' },
  { id: 'd', col: 1, row: 1, label: 'Profil', color: 'bg-purple-400' },
  { id: 'e', col: 1, row: 1, label: 'Paramètres', color: 'bg-yellow-400' },
  { id: 'f', col: 2, row: 1, label: 'Mes chansons', color: 'bg-pink-400' },
  { id: 'g', col: 1, row: 1, label: 'Stats', color: 'bg-teal-400' },
  { id: 'h', col: 1, row: 1, label: 'Déconnexion', color: 'bg-red-400' },
];

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-6 auto-rows-[190px] gap-8 p-6 max-w-6xl mx-auto">
      {gridItems.map((item) => (
        <div
          key={item.id}
          className={`col-span-${item.col} row-span-${item.row} ${item.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer`}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
