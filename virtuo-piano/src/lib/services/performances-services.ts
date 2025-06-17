import prisma from '@/lib/prisma';

export class PerformancesServices {
  static async getPracticeDataForHeatmap(userId: string, year: number) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
        played_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        played_at: true,
        selectedTempo: true,
        song: {
          select: {
            notes: true,
          },
        },
      },
    });
    return scores;
  }
}
