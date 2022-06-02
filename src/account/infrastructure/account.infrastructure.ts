import DynamoDBService from '@shared/persistence/dynamodb/infrastructure/dynamodb.infrastructure'

import type { AccountModel } from '../domain/account.model'

export class AccountInfrastructure extends DynamoDBService<AccountModel> {}
