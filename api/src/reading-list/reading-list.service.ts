import { Injectable } from "@nestjs/common";
import { HoldStatus } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const readingListInclude = {
  book: {
    select: {
      id: true,
      title: true,
      image: true,
      author: { select: { id: true, name: true } },
      category: { select: { id: true, label: true } },
    },
  },
} as const;

@Injectable()
export class ReadingListService {
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

  async findMine(userId: string) {
    await this.syncOverdueStatuses();

    return this.prisma.readingListItem.findMany({
      where: { userId },
      include: readingListInclude,
      orderBy: { createdAt: "desc" },
    });
  }
}
