import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseModel } from 'src/shared/persistence/dynamodb/domain/base.model-dynamodb'

import type { AdviserModel } from './adviser.model'

export class AdviserSerializer extends BaseModel {
  constructor(private data?: AdviserModel) {
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
      stateRole: this.stateRole,
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
      phone: this.data.phone,
      schedules: this.data.schedules,
    }
  }

  get stateRole(): string {
    return `${ID.Adviser}#${ID.State}#${this.data.state}`
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
