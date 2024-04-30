import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { LanguageCode } from '../database/db.enums';
import { StoreCategoryService } from './store-category.service';
import {
  CreateStoreCategoryRequest,
  STORE_CATEGORY_SERVICE_NAME,
  StatusResponse,
  StoreCategory,
  StoreCategoryList,
  StoreCategoryServiceControllerMethods,
  UpdateStoreCategoryRequest,
} from './store-category.pb';

@StoreCategoryServiceControllerMethods()
@Controller()
export class StoreCategoryController {
  constructor(private readonly storeCategoryService: StoreCategoryService) {}
  protected readonly logger = new Logger(StoreCategoryController.name);

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetStoreCategoriesByLanguage')
  getStoreCategoriesByLanguage({
    language,
  }: {
    language: LanguageCode;
  }): Promise<StoreCategoryList> {
    this.logger.log('Received get store categories by language request');
    return this.storeCategoryService.findByLanguage(language);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetAllStoreCategories')
  getAllStoreCategories(): Promise<StoreCategoryList> {
    this.logger.log('Received get all store categories request');
    return this.storeCategoryService.findAll();
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetStoreCategoryById')
  getStoreCategoryById({ id }: { id: string }): Promise<StoreCategory> {
    this.logger.log('Received get store category by id request');
    return this.storeCategoryService.findById(id);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'CreateStoreCategory')
  createStoreCategory(
    createStoreCategoryRequest: CreateStoreCategoryRequest,
  ): Promise<StoreCategory> {
    this.logger.log('Received create store category request');
    return this.storeCategoryService.create(createStoreCategoryRequest);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'UpdateStoreCategory')
  updateStoreCategory(
    updateStoreCategoryRequest: UpdateStoreCategoryRequest,
  ): Promise<StoreCategory> {
    this.logger.log('Received update store category request');
    return this.storeCategoryService.update(updateStoreCategoryRequest);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'DeleteStoreCategory')
  deleteStoreCategory({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received delete store category request');
    return this.storeCategoryService.remove(id);
  }
}
