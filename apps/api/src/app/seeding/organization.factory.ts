import { setSeederFactory } from 'typeorm-extension';
import { Organization } from '../entities/organization.entity';

export const OrganizationFactory = setSeederFactory(Organization, (faker) => {
  const organization = new Organization();
  organization.name = faker.company.name();
  organization.createdAt = new Date();
  organization.updatedAt = new Date();
  return organization;
});
