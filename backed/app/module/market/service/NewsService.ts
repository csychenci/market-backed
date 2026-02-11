import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";
import { PrismaService } from "./PrismaService";

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC
})
export class NewsService {
  @Inject()
  private prismaService: PrismaService

  async listNews(pageNum: number = 1, pageSize: number = 10) {
    const skip = (pageNum - 1) * pageSize
    const [list, total] = await Promise.all([
      this.prismaService.client.news_report.findMany({
        skip,
        take: pageSize,
        orderBy: {
          publishTime: "desc"
        }
      }),
      this.prismaService.client.news_report.count()
    ])

    return {
      code: 200,
      data: {
        list,
        total
      },
      msg: "操作成功"
    }
  }

  async getDetailsById(id: string) {
    const result = await this.prismaService.client.news_report.findUnique({
      where: {
        id
      }
    })
    return {
      code: 200,
      data: result,
      msg: "操作成功"
    }
  }
}