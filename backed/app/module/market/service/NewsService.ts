import { PrismaService } from "@/module/common";
import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";

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
        },
        select: {
          id: true,
          title: true,
          tags: true,
          score: true,
          publishTime: true,
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

  async toggleFavorite(userId: string, newsId: string) {
    const existing = await this.prismaService.client.news_report_to_user.findUnique({
      where: {
        userId_newsId: {
          userId,
          newsId
        }
      }
    })

    if (existing) {
      await this.prismaService.client.news_report_to_user.delete({
        where: {
          id: existing.id
        }
      })
      return {
        code: 200,
        data: { favorited: false },
        msg: "取消收藏成功"
      }
    } else {
      await this.prismaService.client.news_report_to_user.create({
        data: {
          userId,
          newsId
        }
      })
      return {
        code: 200,
        data: { favorited: true },
        msg: "收藏成功"
      }
    }
  }

  async getFavorites(userId: string, pageNum: number = 1, pageSize: number = 10) {
    const skip = (pageNum - 1) * pageSize
    const [list, total] = await Promise.all([
      this.prismaService.client.news_report_to_user.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          news_report: true
        }
      }),
      this.prismaService.client.news_report_to_user.count({
        where: { userId }
      })
    ])

    return {
      code: 200,
      data: {
        list: list.map(item => item.news_report),
        total
      },
      msg: "操作成功"
    }
  }
}