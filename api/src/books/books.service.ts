import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  resolveBookImageUrl,
  saveBookImageFile,
} from "./book-upload.config";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

const bookInclude = {
  category: {
    select: { id: true, label: true, slug: true },
  },
  author: {
    select: { id: true, name: true, slug: true },
  },
} as const;

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  private withResolvedImage<T extends { image: string }>(book: T): T {
    return {
      ...book,
      image: resolveBookImageUrl(book.image),
    };
  }

  private async findOneRaw(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: bookInclude,
    });
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new BadRequestException("Category not found");
    }
  }

  private async assertAuthorExists(authorId: string) {
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (!author) {
      throw new BadRequestException("Author not found");
    }
  }

  async create(createBookDto: CreateBookDto, image: Express.Multer.File) {
    await this.assertCategoryExists(createBookDto.categoryId);
    await this.assertAuthorExists(createBookDto.authorId);

    const imagePath = saveBookImageFile(image);

    const book = await this.prisma.book.create({
      data: {
        title: createBookDto.title.trim(),
        summary: createBookDto.summary?.trim() || null,
        image: imagePath,
        categoryId: createBookDto.categoryId,
        authorId: createBookDto.authorId,
      },
      include: bookInclude,
    });

    return this.withResolvedImage(book);
  }

  async findAll() {
    const books = await this.prisma.book.findMany({
      include: bookInclude,
      orderBy: { createdAt: "desc" },
    });

    return books.map((book) => this.withResolvedImage(book));
  }

  async findOne(id: string) {
    const book = await this.findOneRaw(id);

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    return this.withResolvedImage(book);
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    image?: Express.Multer.File,
  ) {
    await this.findOne(id);

    if (updateBookDto.categoryId !== undefined) {
      await this.assertCategoryExists(updateBookDto.categoryId);
    }

    if (updateBookDto.authorId !== undefined) {
      await this.assertAuthorExists(updateBookDto.authorId);
    }

    const data: {
      title?: string;
      summary?: string | null;
      image?: string;
      categoryId?: string;
      authorId?: string;
    } = {};

    if (updateBookDto.title !== undefined) {
      data.title = updateBookDto.title.trim();
    }

    if (updateBookDto.summary !== undefined) {
      data.summary = updateBookDto.summary.trim() || null;
    }

    if (updateBookDto.categoryId !== undefined) {
      data.categoryId = updateBookDto.categoryId;
    }

    if (updateBookDto.authorId !== undefined) {
      data.authorId = updateBookDto.authorId;
    }

    if (image) {
      data.image = saveBookImageFile(image);
    }

    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }

    const book = await this.prisma.book.update({
      where: { id },
      data,
      include: bookInclude,
    });

    return this.withResolvedImage(book);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.book.delete({
      where: { id },
    });

    return { message: "Book deleted successfully" };
  }
}
