class HttpException extends Error {
    public httpCode: number;
    public message: string;

    public constructor (httpCode: number, message: string) {
      super(message);
      this.httpCode = httpCode;
      this.message = message;
    }
}

export default HttpException;
