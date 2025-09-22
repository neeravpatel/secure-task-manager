import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from '@secure-task-manager/auth';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should call AuthService.login and return AuthResponseDto', async () => {
    const dto: LoginDto = { email: 'test@example.com', password: 'password' };
    const response: AuthResponseDto = {
      access_token: 'token',
      user: { id: '1', email: 'test@example.com' } as AuthResponseDto['user'],
    };
    jest.spyOn(service, 'login').mockResolvedValue(response);

    const result = await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toBe(response);
  });
});
