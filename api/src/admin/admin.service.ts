import { Injectable } from "@nestjs/common";
import { HoldStatus } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export type AdminStats = {
  categories: number;
  authors: number;
  books: number;
  users: number;
  borrowed: number;
  overdue: number;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private async syncOverdueStatuses() {
    await this.prisma.readingListItem.updateMany({
      where: {
        status: HoldStatus.ACTIVE,
        dueAt: { lt: new Date() },
      },
      data: { status: HoldStatus.OVERDUE },
    });
  }

  async getStats(): Promise<AdminStats> {
    await this.syncOverdueStatuses();

    const [categories, authors, books, users, borrowed, overdue] =
      await Promise.all([
        this.prisma.category.count(),
        this.prisma.author.count(),
        this.prisma.book.count(),
        this.prisma.user.count(),
        this.prisma.readingListItem.count({
          where: { status: { not: HoldStatus.RETURNED } },
        }),
        this.prisma.readingListItem.count({
          where: { status: HoldStatus.OVERDUE },
        }),
      ]);

    return {
      categories,
      authors,
      books,
      users,
      borrowed,
      overdue,
    };
  }
}
