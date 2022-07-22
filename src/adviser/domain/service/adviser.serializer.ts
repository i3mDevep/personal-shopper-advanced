import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseSerializer } from '@shared/persistence/dynamodb/domain/dynamodb.serializer'

import type { AdviserModel } from '../model/adviser.model'

export class AdviserSerializer extends BaseSerializer {
  constructor(private data?: AdviserModel) {
    super()
  }

  toRemoveKey(): Record<string, unknown> {
    return {
      GSI1PK: this.gsi1pk,
      GSI1SK: this.gsi1sk,
      rules: this.data.rules,
      account: this.data.account,
      state: this.data.state,
      email: this.data.email,
      fullName: this.data.fullName,
      active: this.data.active,
      createdAt: this.data.createdAt,
      lastUpdate: this.data.lastUpdate,
      lastJoin: this.data.lastJoin,
      phone: this.data.phone,
      schedules: this.data.schedules,
    }
  }

  get gsi1pk(): string {
    return `${ID.Account}#${this.data.account}#${ID.Adviser}#${this.data.email}`
  }

  get gsi1sk(): string {
    return `${ID.Account}#${this.data.account}#${ID.Adviser}#${this.data.email}`
  }

  get pk(): string {
    return `${ID.Account}#${this.data.account}`
  }

  get sk(): string {
    return `${ID.Adviser}#${this.data.email}`
  }
}
