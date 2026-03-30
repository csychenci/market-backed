import { HTTPController, HTTPMethod, HTTPMethodEnum, HTTPParam, HTTPQuery, Inject, HTTPBody, Context } from "@eggjs/tegg";
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
    path: "/:id/favorite"
  })
  async favorite(@HTTPParam({ name: "id" }) newsId: string, @Context() ctx: any) {
    return await this.newsService.toggleFavorite(ctx.state.user.id, newsId)
  }

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: "/favorites"
  })
  async getFavorites(@Context() ctx: any, @HTTPQuery({ name: "pageNum" }) pageNum: string, @HTTPQuery({ name: "pageSize" }) pageSize: string) {
    const _pageNum = pageNum ? parseInt(pageNum, 10) : 1,
      _pageSize = pageSize ? parseInt(pageSize, 10) : 10
    return await this.newsService.getFavorites(ctx.state.user.id, _pageNum, _pageSize)
  }
}