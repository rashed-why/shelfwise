import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "author";
}

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveUniqueSlug(
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await this.prisma.author.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || existing.id === excludeId) {
        return slug;
      }

      slug = `${baseSlug}-${suffix++}`;
    }
  }

  async create(createAuthorDto: CreateAuthorDto) {
    const baseSlug = createAuthorDto.slug
      ? slugify(createAuthorDto.slug)
      : slugify(createAuthorDto.name);
    const slug = await this.resolveUniqueSlug(baseSlug);

    return this.prisma.author.create({
      data: {
        name: createAuthorDto.name.trim(),
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.author.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException("Author not found");
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id);

    const data: { name?: string; slug?: string } = {};

    if (updateAuthorDto.name !== undefined) {
      data.name = updateAuthorDto.name.trim();
    }

    if (updateAuthorDto.slug !== undefined) {
      const baseSlug = slugify(updateAuthorDto.slug);
      data.slug = await this.resolveUniqueSlug(baseSlug, id);
    }

    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.author.update({
        where: { id },
        data,
      });
    } catch {
      throw new ConflictException("Author slug already in use");
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.author.delete({
      where: { id },
    });

    return { message: "Author deleted successfully" };
  }
}
