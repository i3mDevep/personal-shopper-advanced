import type { BaseRepository } from '@shared/persistence/dynamodb/domain/dynamodb.repository'
import type Result from '@shared/persistence/dynamodb/application/result.interface'

import type { AdviserModel } from '../model/adviser.model'

export interface AdviserRepository extends BaseRepository<AdviserModel> {
  getAdviserForAccount(
    account: string,
    state?: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>>
  getAdviserValidateClient: (
    key: Record<string, string>,
    client: string
  ) => Promise<Result<AdviserModel | Record<string, unknown>>>
}
