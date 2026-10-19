import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "category";
}

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveUniqueSlug(
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await this.prisma.category.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || existing.id === excludeId) {
        return slug;
      }

      slug = `${baseSlug}-${suffix++}`;
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const baseSlug = createCategoryDto.slug
      ? slugify(createCategoryDto.slug)
      : slugify(createCategoryDto.label);
    const slug = await this.resolveUniqueSlug(baseSlug);

    return this.prisma.category.create({
      data: {
        label: createCategoryDto.label.trim(),
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { label: "asc" },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const data: { label?: string; slug?: string } = {};

    if (updateCategoryDto.label !== undefined) {
      data.label = updateCategoryDto.label.trim();
    }

    if (updateCategoryDto.slug !== undefined) {
      const baseSlug = slugify(updateCategoryDto.slug);
      data.slug = await this.resolveUniqueSlug(baseSlug, id);
    }

    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch {
      throw new ConflictException("Category slug already in use");
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: "Category deleted successfully" };
  }
}
