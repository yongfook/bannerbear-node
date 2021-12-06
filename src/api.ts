export default class Api {
  headers: Headers;
  baseUrl: string;
  constructor(defaultHeaders: Array<string[]>, url: string) {
    this.headers = new Headers(defaultHeaders);
    this.baseUrl = url;
  }

  public async get(url: string): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {method: 'GET', headers: this.headers });
      if (!response.ok) {
          throw new Error("HTTP error " + response.status);
      }
      const json = await response.json();
      return json;
  } catch (err) {
    throw err;
  }
  }

  public async patch(url: string, params = {}): Promise<Response> {
    try {
      const body = new URLSearchParams(params).toString();
      const response = await fetch(`${this.baseUrl}${url}`, { method: 'PATCH', body, headers: this.headers });
      if (!response.ok) {
          throw new Error("HTTP error " + response.status);
      }
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  }

  public async post(url: string, params = {}): Promise<Response> {
    try {
      const body = new URLSearchParams(params).toString();
      const response = await fetch(`${this.baseUrl}${url}`, { method: 'POST', body, headers: this.headers });
      if (!response.ok) {
          throw new Error("HTTP error " + response.status);
      }
      const json = await response.json();
      return json;
    } catch (err) {

      throw err;
    }
  }
}
