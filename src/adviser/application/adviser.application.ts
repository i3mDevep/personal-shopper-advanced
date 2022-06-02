import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'

import type { AdviserModel } from '../domain/adviser.model'
import type { AdviserRepository } from '../domain/adviser.repository'

export class AdviserApplication extends BaseApplication<AdviserModel> {
  constructor(private repositoryAdviser: AdviserRepository) {
    super(repositoryAdviser)
  }

  async getAdviserForState(account: string, state: string) {
    return this.repositoryAdviser.getAdviserForState(account, state)
  }

  async getAdviserForAccount(account: string) {
    return this.repositoryAdviser.getAdviserForAccount(account)
  }
}
