import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';

import * as bcrypt from 'bcrypt';
const getPasswordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const UserFactory = setSeederFactory(User, async (faker) => {
  const user = new User();

  user.email = faker.internet.email();
  user.passwordHash = await getPasswordHash(faker.internet.password(10));
  user.createdAt = new Date();
  user.updatedAt = new Date();

  return user;
});
