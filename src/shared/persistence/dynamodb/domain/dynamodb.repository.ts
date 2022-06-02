import type Result from '@shared/persistence/dynamodb/application/result.interface'

export interface BaseRepository<T> {
  create(
    entity: T | Record<string, unknown>
  ): Promise<Result<T | Record<string, unknown>>>
  updateItem(
    key: Record<string, string>,
    data: Partial<T>
  ): Promise<Result<Partial<T>>>
  getItem(key: Record<string, string>): Promise<Result<T>>
}
