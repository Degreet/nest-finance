import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PREDEFINED_CATEGORIES } from './categories.constants';

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
}
