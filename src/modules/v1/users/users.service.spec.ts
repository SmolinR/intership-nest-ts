import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('AuthController', () => {
  let controller: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersService],
    }).compile();

    controller = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
