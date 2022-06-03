import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseSerializer } from '@shared/persistence/dynamodb/domain/dynamodb.serializer'

import type { AccountModel } from './account.model'

export class AccountSerializer extends BaseSerializer {
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
