import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';

export const UserFactory = setSeederFactory(User, async (faker) => {
  const user = new User();

  user.email = faker.internet.email();
  user.passwordHash = faker.internet.password({ length: 8 });
  user.createdAt = new Date();
  user.updatedAt = new Date();

  return user;
});
