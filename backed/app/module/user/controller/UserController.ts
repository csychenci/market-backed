import { HTTPController, HTTPMethod, HTTPMethodEnum, HTTPBody, Inject, Context } from '@eggjs/tegg';
import { UserService } from '../service/UserService';
import { Response } from '@/decorators/response';
import { CreateUserDto, LoginUserDto } from '../dto';

@HTTPController({
  path: '/api/user',
})
export class UserController {
  @Inject()
  private userService: UserService;

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/register',
  })
  @Response('注册成功')
  async register(@HTTPBody() body: CreateUserDto) {
    return await this.userService.register(body.username, body.password, body.nickname, body.avatar);
  }

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/login',
  })
  @Response('登录成功')
  async login(@HTTPBody() body: LoginUserDto) {
    return await this.userService.login(body.username, body.password);
  }

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/logout',
  })
  @Response('登出成功')
  async logout(@Context() ctx: any) {
    return await this.userService.logout(ctx.state.user.id);
  }

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/info',
  })
  @Response()
  async getUserInfo(@Context() ctx: any) {
    return await this.userService.getUserInfo(ctx.state.user.id);
  }

  @HTTPMethod({
    method: HTTPMethodEnum.PUT,
    path: '/info',
  })
  @Response('更新成功')
  async updateUserInfo(@Context() ctx: any, @HTTPBody() body: { nickname?: string; avatar?: string }) {
    return await this.userService.updateUserInfo(ctx.state.user.id, body);
  }
}
