import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HoldStatus } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHoldDto } from "./dto/create-hold.dto";

const HOLD_DUE_DAYS = 14;

const holdInclude = {
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

const adminHoldInclude = {
  user: {
    select: { id: true, name: true, email: true },
  },
  book: {
    select: { id: true, title: true },
  },
} as const;

@Injectable()
export class HoldsService {
  constructor(private readonly prisma: PrismaService) {}

  private defaultDueAt(): Date {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + HOLD_DUE_DAYS);
    return dueAt;
  }

  private async syncOverdueStatuses() {
    await this.prisma.hold.updateMany({
      where: {
        status: HoldStatus.ACTIVE,
        dueAt: { lt: new Date() },
      },
      data: { status: HoldStatus.OVERDUE },
    });
  }

  async create(userId: string, createHoldDto: CreateHoldDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: createHoldDto.bookId },
      select: { id: true },
    });

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    const existingUserHold = await this.prisma.hold.findFirst({
      where: {
        userId,
        bookId: createHoldDto.bookId,
        status: { in: [HoldStatus.ACTIVE, HoldStatus.OVERDUE] },
      },
      select: { id: true },
    });

    if (existingUserHold) {
      throw new ConflictException("You already have an active hold on this book");
    }

    const existingUserReading = await this.prisma.readingListItem.findFirst({
      where: {
        userId,
        bookId: createHoldDto.bookId,
        status: { in: [HoldStatus.ACTIVE, HoldStatus.OVERDUE] },
      },
      select: { id: true },
    });

    if (existingUserReading) {
      throw new ConflictException("This book is already on your reading list");
    }

    const existingBookReading = await this.prisma.readingListItem.findFirst({
      where: {
        bookId: createHoldDto.bookId,
        status: { in: [HoldStatus.ACTIVE, HoldStatus.OVERDUE] },
      },
      select: { id: true },
    });

    if (existingBookReading) {
      throw new ConflictException("This book is currently borrowed");
    }

    const existingBookHold = await this.prisma.hold.findFirst({
      where: {
        bookId: createHoldDto.bookId,
        status: { in: [HoldStatus.ACTIVE, HoldStatus.OVERDUE] },
      },
      select: { id: true, userId: true },
    });

    if (existingBookHold && existingBookHold.userId !== userId) {
      throw new ConflictException("This book is already on hold for another user");
    }

    return this.prisma.hold.create({
      data: {
        userId,
        bookId: createHoldDto.bookId,
        dueAt: this.defaultDueAt(),
        status: HoldStatus.ACTIVE,
      },
      include: holdInclude,
    });
  }

  async findMine(userId: string) {
    await this.syncOverdueStatuses();

    return this.prisma.hold.findMany({
      where: { userId },
      include: holdInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll() {
    await this.syncOverdueStatuses();

    return this.prisma.hold.findMany({
      include: adminHoldInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async remove(userId: string, holdId: string) {
    const hold = await this.prisma.hold.findUnique({
      where: { id: holdId },
      select: { id: true, userId: true, status: true },
    });

    if (!hold) {
      throw new NotFoundException("Hold not found");
    }

    if (hold.userId !== userId) {
      throw new ForbiddenException("You can only cancel your own holds");
    }

    if (hold.status === HoldStatus.RETURNED) {
      throw new BadRequestException("This hold has already been returned");
    }

    await this.prisma.hold.delete({
      where: { id: holdId },
    });

    return { id: holdId, removed: true };
  }
}
