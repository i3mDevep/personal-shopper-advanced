import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'

import type { AccountModel } from '../domain/account.model'

export class AccountApplication extends BaseApplication<AccountModel> {}
