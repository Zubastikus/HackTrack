import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private jwtService: JwtService,
  ) {}

  generateToken(
    user: User,
    hackathonId?: number,
    hackathonName?: string,
  ) {
    return this.jwtService.sign({
      userId: user.id,
      email: user.email,

      hackathonId: hackathonId || null,
      hackathonName: hackathonName || null,
    });
  }

  // регистрация
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) {
    const existing = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone,
    });

    await this.userRepo.save(user);

    return { message: 'User created' };
  }

  // логин
  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Wrong password');
    }

    return {
      access_token: this.generateToken(user),
    };
  }

  async selectHackathon(userId: number, hackathonId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['hackathons'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const hasAccess = user.hackathons.some(
      h => h.id === hackathonId,
    );

    if (!hasAccess) {
      throw new Error('No access to this hackathon');
    }

    const hackathon = user.hackathons.find(
      h => h.id === hackathonId,
    );

    return {
      access_token: this.generateToken(
        user,
        hackathonId,
        hackathon?.name,
      ),
    };
  }
}