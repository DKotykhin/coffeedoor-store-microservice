import { Test, TestingModule } from '@nestjs/testing';
import { StoreItemImageService } from '../store-item-image.service';

describe('StoreItemImageService', () => {
  let service: StoreItemImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreItemImageService,
        {
          provide: 'StoreItemImageRepository',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StoreItemImageService>(StoreItemImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
