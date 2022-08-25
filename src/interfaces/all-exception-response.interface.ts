export interface IAllExceptionResponse {
  readonly statusCode: number;

  readonly error: string;

  readonly message: unknown;

  readonly messages: unknown[];
}
