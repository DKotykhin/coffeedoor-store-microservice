import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ErrorImplementation } from '../utils/error-implementation';
import { LanguageCode } from '../database/db.enums';
import { StoreItem } from './entities/store-item.entity';
import {
  CreateStoreItemRequest,
  StatusResponse,
  StoreItemList,
  StoreItemWithAd,
  UpdateStoreItemRequest,
} from './store-item.pb';

@Injectable()
export class StoreItemService {
  constructor(
    @InjectRepository(StoreItem)
    private readonly storeItemRepository: Repository<StoreItem>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(StoreItemService.name);

  async findAllByCategoryId(categoryId: string): Promise<StoreItemList> {
    try {
      const storeItemList = await this.storeItemRepository.find({
        where: { category: { id: categoryId } },
        order: {
          position: 'ASC',
        },
      });
      return { storeItemList };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async findBySlug(slug: string): Promise<StoreItem> {
    try {
      const storeItem = await this.storeItemRepository.findOne({
        where: { slug },
        relations: ['category'],
      });
      if (!storeItem) {
        throw ErrorImplementation.notFound('Store item not found');
      }
      return storeItem;
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async findBySlugWithRecommendations(slug: string): Promise<StoreItemWithAd> {
    try {
      const storeItem = await this.findBySlug(slug);
      const { storeItemList } = await this.findAllByCategoryId(
        storeItem.category.id,
      );

      const copyArr = storeItemList?.slice();
      const itemIndex = copyArr.findIndex(
        (item) => item.slug === storeItem.slug,
      );
      copyArr.splice(itemIndex, 1);
      const adList = [];
      const n = 2;
      if (n < copyArr.length) {
        for (let i = 0; i < n; i++) {
          const randomIndex = Math.floor(Math.random() * copyArr.length);
          adList.push(copyArr[randomIndex]);
          copyArr.splice(randomIndex, 1);
        }
      } else {
        adList.push(...copyArr);
      }

      return {
        storeItem,
        adList,
      };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async create(createStoreItemDto: CreateStoreItemRequest): Promise<StoreItem> {
    try {
      return await this.entityManager.save(StoreItem, {
        ...createStoreItemDto,
        language: createStoreItemDto.language as LanguageCode,
      });
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async update(
    updateStoreItemRequest: UpdateStoreItemRequest,
  ): Promise<StoreItem> {
    try {
      return await this.entityManager.transaction(async (manager) => {
        const storeItem = await manager.findOne(StoreItem, {
          where: { slug: updateStoreItemRequest.slug },
        });
        if (!storeItem) {
          throw ErrorImplementation.notFound('Store item not found');
        }
        return await manager.save(StoreItem, {
          ...storeItem,
          ...updateStoreItemRequest,
        });
      });
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async remove(slug: string): Promise<StatusResponse> {
    try {
      const result = await this.storeItemRepository.delete(slug);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Store item not found');
      }
      return {
        status: true,
        message: `Store item ${slug} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }
}
