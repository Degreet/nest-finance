import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_REGISTERED,
  UserRegisteredEvent,
} from '../../../iam/events/user-registered.event';
import { CategoriesService } from '../categories.service';

@Injectable()
export class SeedDefaultCategoriesListener {
  private readonly logger = new Logger(SeedDefaultCategoriesListener.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @OnEvent(USER_REGISTERED)
  async onUserRegistered(event: UserRegisteredEvent) {
    try {
      await this.categoriesService.seedDefaultCategories(event.userId);
    } catch (err) {
      this.logger.error(
        `Failed to seed default categories for user #${event.userId}:`,
        err,
      );
    }
  }
}
