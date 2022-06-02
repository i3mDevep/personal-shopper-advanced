export default interface Result<T> {
  traceId: string
  payload: {
    data: Partial<T> | Array<Partial<T>>
    total?: number
  }
}
