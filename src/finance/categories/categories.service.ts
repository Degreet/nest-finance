import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PREDEFINED_CATEGORIES } from './categories.constants';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryNotFoundException } from './exceptions/category-not-found.exception';
import { TransactionType } from '../transactions/enums/transaction-type.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seedDefaultCategories(userId: number) {
    const categories = PREDEFINED_CATEGORIES.map(({ name, type }) => {
      return this.categoryRepository.create({
        name,
        type,
        user: { id: userId },
      });
    });
    await this.categoryRepository.save(categories);
  }

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      user: { id: userId },
    });

    const saved = await this.categoryRepository.save(category);

    return {
      categoryId: saved.id,
    };
  }

  findAll(userId: number) {
    return this.categoryRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'name', 'type'],
      order: { id: 'ASC' },
    });
  }

  async findOneOrFail(
    manager: EntityManager,
    id: number,
    userId: number,
    type?: TransactionType,
  ) {
    const entity = await manager.findOneBy(Category, {
      id,
      user: { id: userId },
      type,
    });
    if (!entity) {
      throw new CategoryNotFoundException();
    }
    return entity;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    const result = await this.categoryRepository.update(
      { id, user: { id: userId } },
      updateCategoryDto,
    );
    if (result.affected === 0) {
      throw new CategoryNotFoundException();
    }
  }

  async remove(id: number, userId: number) {
    const result = await this.categoryRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new CategoryNotFoundException();
    }
  }
}
