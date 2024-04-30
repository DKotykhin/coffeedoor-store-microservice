import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreItemImageService } from './store-item-image.service';
import {
  CreateImageRequest,
  STORE_ITEM_IMAGE_SERVICE_NAME,
  StatusResponse,
  StoreItemImage,
  StoreItemImageList,
  StoreItemImageServiceControllerMethods,
} from './store-item-image.pb';

@StoreItemImageServiceControllerMethods()
@Controller()
export class StoreItemImageController {
  constructor(private readonly storeItemImageService: StoreItemImageService) {}
  protected readonly logger = new Logger(StoreItemImageController.name);

  @GrpcMethod(STORE_ITEM_IMAGE_SERVICE_NAME, 'GetImagesByStoreItemSlug')
  getImagesByStoreItemSlug({
    slug,
  }: {
    slug: string;
  }): Promise<StoreItemImageList> {
    this.logger.log('Received findImagesByStoreItemSlug request');
    return this.storeItemImageService.getImagesByStoreItemSlug(slug);
  }

  @GrpcMethod(STORE_ITEM_IMAGE_SERVICE_NAME, 'CreateImage')
  createImage(createImageRequest: CreateImageRequest): Promise<StoreItemImage> {
    this.logger.log('Received createImage request');
    return this.storeItemImageService.createImage(createImageRequest);
  }

  @GrpcMethod(STORE_ITEM_IMAGE_SERVICE_NAME, 'DeleteImage')
  deleteImage({ image }: { image: string }): Promise<StatusResponse> {
    this.logger.log('Received deleteImage request');
    return this.storeItemImageService.deleteImage(image);
  }
}
