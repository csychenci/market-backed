import { AccessLevel, SingletonProto, Inject } from '@eggjs/tegg';
import { PrismaService, JwtService, RedisService } from '@/module/common';
import * as bcrypt from 'bcryptjs';

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC,
})
export class UserService {
  @Inject()
  private prismaService: PrismaService;

  @Inject()
  private jwtService: JwtService;

  @Inject()
  private redisService: RedisService;

  async register(username: string, password: string, nickname?: string, avatar?: string) {
    const existUser = await this.prismaService.client.user.findUnique({
      where: { username },
    });

    if (existUser) {
      throw new Error('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.client.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname: nickname || username,
        avatar,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(username: string, password: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    const payload = { id: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    await this.redisService.client.set(`user:token:${user.id}`, token, 'EX', 7 * 24 * 60 * 60);

    const { password: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword,
    };
  }

  async logout(userId: string) {
    await this.redisService.client.del(`user:token:${userId}`);
    return null;
  }

  async getUserInfo(userId: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserInfo(userId: string, data: { nickname?: string; avatar?: string }) {
    const user = await this.prismaService.client.user.update({
      where: { id: userId },
      data: {
        ...(data.nickname && { nickname: data.nickname }),
        ...(data.avatar && { avatar: data.avatar }),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
