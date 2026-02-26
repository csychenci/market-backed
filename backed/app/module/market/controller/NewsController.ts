import { HTTPController, HTTPMethod, HTTPMethodEnum, HTTPParam, HTTPQuery, Inject, HTTPBody } from "@eggjs/tegg";
import { NewsService } from "..";

@HTTPController({
  path: "/api/news"
})
export class NewsController {
  @Inject()
  private newsService: NewsService

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: "/"
  })
  async list(@HTTPQuery({ name: "pageNum" }) pageNum: string, @HTTPQuery({ name: "pageSize" }) pageSize: string) {
    const _pageNum = pageNum ? parseInt(pageNum, 10) : 1,
      _pageSize = pageSize ? parseInt(pageSize, 10) : 10
    return await this.newsService.listNews(_pageNum, _pageSize)
  }

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: "/:id"
  })
  async details(@HTTPParam({name: "id"}) id: string) {
    return await this.newsService.getDetailsById(id)
  }

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: "/"
  })
  async create(@HTTPBody() body: {
    title: string
    content?: string
    sourceUrl?: string
    tags?: unknown
    images?: unknown
    summary?: string
    viewpoints?: unknown
    score?: number
    publishTime: string
  }) {
    return await this.newsService.createNews({
      ...body,
      publishTime: new Date(body.publishTime)
    })
  }
}