import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorImplementation } from '../utils/error-implementation';
import { StoreItemImage } from './entities/store-item-image.entity';
import {
  CreateImageRequest,
  StatusResponse,
  StoreItemImageList,
} from './store-item-image.pb';

@Injectable()
export class StoreItemImageService {
  constructor(
    @InjectRepository(StoreItemImage)
    private readonly storeItemImageRepository: Repository<StoreItemImage>,
  ) {}
  protected readonly logger = new Logger(StoreItemImageService.name);

  async getImagesByStoreItemSlug(slug: string): Promise<StoreItemImageList> {
    try {
      const storeItemImageList = await this.storeItemImageRepository.find({
        where: { storeItem: { slug } },
      });
      return { storeItemImageList };
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.notFound(error.message);
    }
  }

  async createImage(
    createImageRequest: CreateImageRequest,
  ): Promise<StoreItemImage> {
    try {
      return await this.storeItemImageRepository.save({
        ...createImageRequest,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden(error.message);
    }
  }

  async deleteImage(image: string): Promise<StatusResponse> {
    try {
      const result = await this.storeItemImageRepository.delete({ image });
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Image not found');
      }
      return {
        status: true,
        message: `Image ${image} deleted successfully`,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }
}
