'use client';

import { useEffect, useState } from 'react';
import { UserResponse } from '@/common/types';

export function UserList() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/users`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Liste des utilisateurs</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-2 bg-white/10 rounded"
          >
            <span>{user.userName}</span>
            <span className="text-sm text-gray-400">Niveau {user.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
