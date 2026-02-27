import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";
import { PrismaService } from "./PrismaService";

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC
})
export class NewsService {
  @Inject()
  private prismaService: PrismaService

  async getTags() {
    const result = await this.prismaService.client.news_report_tags.findMany()
    return {
      code: 200,
      data: result,
      msg: "操作成功"
    }
  }

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

  async createNews(data: {
    title: string
    content?: string
    sourceUrl?: string
    tags?: unknown
    images?: unknown
    summary?: string
    viewpoints?: unknown
    score?: number
    publishTime: Date
  }) {
    const { title, publishTime } = data
    if (!title || !publishTime) {
      return {
        code: 400,
        data: null,
        msg: "标题和发布时间不能为空"
      }
    }

    try {
      const result = await this.prismaService.client.news_report.create({
        data: {
          title,
          content: data.content || undefined,
          sourceUrl: data.sourceUrl || undefined,
          tags: data.tags ? data.tags : undefined,
          images: data.images ? data.images : undefined,
          summary: data.summary || undefined,
          viewpoints: data.viewpoints ? data.viewpoints : undefined,
          score: data.score || undefined,
          publishTime: new Date(publishTime)
        }
      })
      return {
        code: 200,
        data: result,
        msg: "创建成功"
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      return {
        code: 500,
        data: null,
        msg: "创建失败: " + message
      }
    }
  }
}