import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserResponse } from '@/common/types';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        level: true,
        createdAt: true,
      },
    });

    const formattedUsers: UserResponse[] = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedUsers);
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
