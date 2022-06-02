import type Result from '@shared/persistence/dynamodb/application/result.interface'

import type { BaseRepository } from '../domain/dynamodb.repository'

export default class BaseApplication<T> {
  constructor(private operations: BaseRepository<T>) {}
  create = async (
    data: T | Record<string, unknown>
  ): Promise<Result<T | Record<string, unknown>>> => {
    return this.operations.create(data)
  }

  updateItem = async (
    key: Record<string, string>,
    data: Partial<T>
  ): Promise<Result<Partial<T>>> => {
    return this.operations.updateItem(key, data)
  }

  getItem = async (key: Record<string, string>): Promise<Result<T>> => {
    return this.operations.getItem(key)
  }
}
