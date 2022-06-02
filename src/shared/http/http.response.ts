export class HttpResponse {
  static response(body: unknown, statusCode = 200) {
    return {
      body: JSON.stringify(body),
      statusCode,
    }
  }
}
