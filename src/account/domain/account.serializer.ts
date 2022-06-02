import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseModel } from 'src/shared/persistence/dynamodb/domain/base.model-dynamodb'

import type { AccountModel } from './account.model'

export class AccountSerializer extends BaseModel {
  constructor(private data: AccountModel) {
    super()
  }

  toItems(): Record<string, unknown> {
    return {
      ...this.keys(),
      ...this.toRemoveKey(),
    }
  }

  toRemoveKey(): Record<string, unknown> {
    return {
      account: this.data.account,
      storeName: this.data.storeName,
      urlCss: this.data.urlCss,
      active: this.data.active,
      templateEmail: this.data.templateEmail,
      templateNotifyClient: this.data.templateNotifyClient,
    }
  }

  get pk(): string {
    return `${ID.Account}#${this.data.account}`
  }

  get sk(): string {
    return `${ID.Account}#${this.data.account}`
  }
}
