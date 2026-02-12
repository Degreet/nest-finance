import { CreateCategoryDto } from './create-category.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['type'] as const),
) {}
