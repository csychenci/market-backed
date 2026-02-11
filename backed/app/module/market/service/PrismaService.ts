import { AccessLevel, SingletonProto } from "@eggjs/tegg";
import { PrismaClient } from "@prisma/client";

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC
})
export class PrismaService {
  private _client: PrismaClient | null = null
  get client(): PrismaClient {
    if (!this._client) {
      this._client = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL || 'mysql://root:12345678@locahost:33063/market_insights',
      })
    }
    return this._client
  }
}