/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "storeItemImage";

export interface StoreItemImage {
  id: string;
  image: string;
  position: number;
  storeItem: Slug | undefined;
}

export interface StoreItemImageList {
  storeItemImageList: StoreItemImage[];
}

export interface CreateImageRequest {
  storeItem: Slug | undefined;
  image: string;
  position: number;
}

export interface ImageRequest {
  image: string;
}

export interface Slug {
  slug: string;
}

export interface StatusResponse {
  status: boolean;
  message: string;
}

export const STORE_ITEM_IMAGE_PACKAGE_NAME = "storeItemImage";

export interface StoreItemImageServiceClient {
  getImagesByStoreItemSlug(request: Slug): Observable<StoreItemImageList>;

  createImage(request: CreateImageRequest): Observable<StoreItemImage>;

  deleteImage(request: ImageRequest): Observable<StatusResponse>;
}

export interface StoreItemImageServiceController {
  getImagesByStoreItemSlug(
    request: Slug,
  ): Promise<StoreItemImageList> | Observable<StoreItemImageList> | StoreItemImageList;

  createImage(request: CreateImageRequest): Promise<StoreItemImage> | Observable<StoreItemImage> | StoreItemImage;

  deleteImage(request: ImageRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;
}

export function StoreItemImageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getImagesByStoreItemSlug", "createImage", "deleteImage"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StoreItemImageService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StoreItemImageService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORE_ITEM_IMAGE_SERVICE_NAME = "StoreItemImageService";
