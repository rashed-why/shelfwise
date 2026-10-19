import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HoldStatus } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBorrowedDto } from "./dto/create-borrowed.dto";

const borrowedInclude = {
  user: {
    select: { id: true, name: true, email: true },
  },
  book: {
    select: { id: true, title: true },
  },
} as const;

@Injectable()
export class BorrowedService {
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

  async create(createBorrowedDto: CreateBorrowedDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createBorrowedDto.userId },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const bookIds = [...new Set(createBorrowedDto.bookIds)];
    const books = await this.prisma.book.findMany({
      where: { id: { in: bookIds } },
      select: { id: true },
    });

    if (books.length !== bookIds.length) {
      throw new BadRequestException("One or more books were not found");
    }

    const dueAt = new Date(createBorrowedDto.dueAt);
    if (Number.isNaN(dueAt.getTime())) {
      throw new BadRequestException("Due date is invalid");
    }

    const userId = createBorrowedDto.userId;

    return this.prisma.$transaction(async (tx) => {
      const created: Awaited<
        ReturnType<typeof tx.readingListItem.create>
      >[] = [];

      for (const bookId of bookIds) {
        const activeReading = await tx.readingListItem.findFirst({
          where: {
            userId,
            bookId,
            status: { in: [HoldStatus.ACTIVE, HoldStatus.OVERDUE] },
          },
          select: { id: true },
        });

        if (activeReading) {
          throw new ConflictException(
            "User already has an active reading list entry for one of these books",
          );
        }

        await tx.hold.deleteMany({
          where: {
            userId,
            bookId,
            status: { in: [HoldStatus.ACTIVE, HoldStatus.OVERDUE] },
          },
        });

        const item = await tx.readingListItem.create({
          data: {
            userId,
            bookId,
            dueAt,
            status: HoldStatus.ACTIVE,
          },
          include: borrowedInclude,
        });

        created.push(item);
      }

      return created;
    });
  }

  async findAll() {
    await this.syncOverdueStatuses();

    return this.prisma.readingListItem.findMany({
      include: borrowedInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, status: HoldStatus) {
    const item = await this.prisma.readingListItem.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!item) {
      throw new NotFoundException("Borrow not found");
    }

    const data: { status: HoldStatus; returnedAt?: Date | null } = { status };

    if (status === HoldStatus.RETURNED) {
      data.returnedAt = new Date();
    } else {
      data.returnedAt = null;
    }

    return this.prisma.readingListItem.update({
      where: { id },
      data,
      include: borrowedInclude,
    });
  }

  async markReturned(id: string) {
    return this.updateStatus(id, HoldStatus.RETURNED);
  }
}
