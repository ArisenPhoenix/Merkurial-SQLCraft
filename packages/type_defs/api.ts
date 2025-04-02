export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export interface FetchResponse<T = any> {
  ok: boolean;
  err?: any;
  message?: string;
  response?: T;
}