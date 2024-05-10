import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreItemService } from './store-item.service';
import {
  CreateStoreItemRequest,
  STORE_ITEM_SERVICE_NAME,
  StatusResponse,
  StoreItem,
  StoreItemList,
  StoreItemServiceControllerMethods,
  StoreItemWithAd,
  StoreItemWithImages,
  UpdateStoreItemRequest,
} from './store-item.pb';

@StoreItemServiceControllerMethods()
@Controller()
export class StoreItemController {
  constructor(private readonly storeItemService: StoreItemService) {}
  protected readonly logger = new Logger(StoreItemController.name);

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'GetStoreItemsByCategoryId')
  getStoreItemsByCategoryId({ id }: { id: string }): Promise<StoreItemList> {
    this.logger.log('Received get store items by category id request');
    return this.storeItemService.findAllByCategoryId(id);
  }

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'GetStoreItemBySlug')
  getStoreItemBySlug({ slug }: { slug: string }): Promise<StoreItemWithImages> {
    this.logger.log('Received get store item by slug request');
    return this.storeItemService.findBySlug(slug);
  }

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'GetStoreItemBySlugWithAd')
  getStoreItemBySlugWithAd({
    slug,
  }: {
    slug: string;
  }): Promise<StoreItemWithAd> {
    this.logger.log('Received get store item by slug with ad request');
    return this.storeItemService.findBySlugWithRecommendations(slug);
  }

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'CreateStoreItem')
  createStoreItem(
    createStoreItemRequest: CreateStoreItemRequest,
  ): Promise<StoreItem> {
    this.logger.log('Received create store item request');
    return this.storeItemService.create(createStoreItemRequest);
  }

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'UpdateStoreItem')
  updateStoreItem(
    updateStoreItemRequest: UpdateStoreItemRequest,
  ): Promise<StoreItem> {
    this.logger.log('Received update store item request');
    return this.storeItemService.update(updateStoreItemRequest);
  }

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'DeleteStoreItem')
  deleteStoreItem({ slug }: { slug: string }): Promise<StatusResponse> {
    this.logger.log('Received delete store item request');
    return this.storeItemService.remove(slug);
  }
}
