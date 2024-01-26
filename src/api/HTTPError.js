export class HTTPError extends Error {
  constructor(statusCode, message, code) {
    super(message)

    this.name = 'HTTPError'
    this.statusCode = statusCode
    this.code = code

    Object.setPrototypeOf(this, HTTPError.prototype)
  }
}
