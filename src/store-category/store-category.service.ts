import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';
import { StoreCategory } from './entities/store-category.entity';
import {
  CreateStoreCategoryRequest,
  StatusResponse,
  StoreCategoryList,
  UpdateStoreCategoryRequest,
} from './store-category.pb';

@Injectable()
export class StoreCategoryService {
  constructor(
    @InjectRepository(StoreCategory)
    private readonly storeCategoryRepository: Repository<StoreCategory>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(StoreCategoryService.name);

  async findByLanguage(language: LanguageCode): Promise<StoreCategoryList> {
    try {
      const storeCategoryList = await this.storeCategoryRepository.find({
        where: {
          language,
          hidden: false,
        },
        relations: ['storeItems', 'storeItems.images'],
        order: {
          position: 'ASC',
          storeItems: {
            position: 'ASC',
          },
        },
      });
      return { storeCategoryList };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async findAll(): Promise<StoreCategoryList> {
    try {
      const storeCategoryList = await this.storeCategoryRepository.find({
        relations: ['storeItems', 'storeItems.images'],
      });
      return { storeCategoryList };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async findById(id: string): Promise<StoreCategory> {
    try {
      const storeCategory = await this.storeCategoryRepository.findOne({
        where: { id },
        relations: ['storeItems', 'storeItems.images'],
      });
      if (!storeCategory) {
        throw ErrorImplementation.notFound('Store category not found');
      }
      return storeCategory;
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.notFound(error?.message);
    }
  }

  async create(
    createStoreCategoryDto: CreateStoreCategoryRequest,
  ): Promise<StoreCategory> {
    try {
      return await this.entityManager.save(StoreCategory, {
        ...createStoreCategoryDto,
        language: createStoreCategoryDto.language as LanguageCode,
      });
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async update(
    updateStoreCategory: UpdateStoreCategoryRequest,
  ): Promise<StoreCategory> {
    try {
      const storeCategory = await this.findById(updateStoreCategory.id);
      if (!storeCategory) {
        throw ErrorImplementation.notFound('Store category not found');
      }
      Object.assign(storeCategory, updateStoreCategory);
      return await this.entityManager.save('StoreCategory', storeCategory);
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      const result = await this.storeCategoryRepository.delete(id);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Store category not found');
      }
      return {
        status: true,
        message: `Store category ${id} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden(error?.message);
    }
  }
}
