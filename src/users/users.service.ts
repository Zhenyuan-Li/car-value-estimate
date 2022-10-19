import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // Annotation to figure out what instance it needs to inject into this class at run time
  // But the DI system does not play nicely with generics, so the decorator is required here
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // Create does not save any data to database, it create a User Entity Instance
    // The two separated function is to make sure we can validate potential data,
    // or print something into console before save into database.
    const user = this.repo.create({ email, password });

    // Save the newly created User Entity Instance to database
    // Because only save() (also remove()) will execute the Hooks function
    return this.repo.save(user);
  }

  findOne(id: number) {
    return !id ? null : this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  // Special technique to have optional type (at least or none of the object, but not no-belong)
  async update(id: number, attrs: Partial<User>) {
    // paying in performance (communicate with db) to use hooks (2 calls this approach),
    // but only one using update()
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
