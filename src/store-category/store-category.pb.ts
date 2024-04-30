/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "storeCategory";

export interface Empty {
}

export interface StoreCategory {
  id: string;
  language: string;
  title: string;
  subtitle: string;
  hidden: boolean;
  position: number;
  storeItems: StoreItem[];
}

export interface StoreCategoryList {
  storeCategoryList: StoreCategory[];
}

export interface StoreItem {
  slug: string;
  language: string;
  title: string;
  description: string;
  details: string;
  sortKey: string;
  sortValue: string;
  country: string;
  tm: string;
  price: number;
  oldPrice: number;
  discount: number;
  weight: number;
  hidden: boolean;
  position: number;
}

export interface Id {
  id: string;
}

export interface Language {
  language: string;
}

export interface CreateStoreCategoryRequest {
  language: string;
  title: string;
  subtitle?: string | undefined;
  hidden?: boolean | undefined;
  position?: number | undefined;
}

export interface UpdateStoreCategoryRequest {
  id: string;
  title?: string | undefined;
  subtitle?: string | undefined;
  hidden?: boolean | undefined;
  position?: number | undefined;
}

export interface StatusResponse {
  status: boolean;
  message: string;
}

export const STORE_CATEGORY_PACKAGE_NAME = "storeCategory";

export interface StoreCategoryServiceClient {
  getAllStoreCategories(request: Empty): Observable<StoreCategoryList>;

  getStoreCategoriesByLanguage(request: Language): Observable<StoreCategoryList>;

  getStoreCategoryById(request: Id): Observable<StoreCategory>;

  createStoreCategory(request: CreateStoreCategoryRequest): Observable<StoreCategory>;

  updateStoreCategory(request: UpdateStoreCategoryRequest): Observable<StoreCategory>;

  deleteStoreCategory(request: Id): Observable<StatusResponse>;
}

export interface StoreCategoryServiceController {
  getAllStoreCategories(request: Empty): Promise<StoreCategoryList> | Observable<StoreCategoryList> | StoreCategoryList;

  getStoreCategoriesByLanguage(
    request: Language,
  ): Promise<StoreCategoryList> | Observable<StoreCategoryList> | StoreCategoryList;

  getStoreCategoryById(request: Id): Promise<StoreCategory> | Observable<StoreCategory> | StoreCategory;

  createStoreCategory(
    request: CreateStoreCategoryRequest,
  ): Promise<StoreCategory> | Observable<StoreCategory> | StoreCategory;

  updateStoreCategory(
    request: UpdateStoreCategoryRequest,
  ): Promise<StoreCategory> | Observable<StoreCategory> | StoreCategory;

  deleteStoreCategory(request: Id): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;
}

export function StoreCategoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAllStoreCategories",
      "getStoreCategoriesByLanguage",
      "getStoreCategoryById",
      "createStoreCategory",
      "updateStoreCategory",
      "deleteStoreCategory",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StoreCategoryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StoreCategoryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORE_CATEGORY_SERVICE_NAME = "StoreCategoryService";
