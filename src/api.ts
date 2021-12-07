import fetch, { Headers } from 'node-fetch';

export default class Api {
  headers: Headers;
  baseUrl: string;
  constructor(defaultHeaders: Headers, url: string) {
    this.headers = defaultHeaders;
    this.baseUrl = url;
  }

  public async get(url: string): Promise<unknown> {
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

  public async patch(url: string, params = {}): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, { method: 'PATCH', body: JSON.stringify(params), headers: this.headers });
      if (!response.ok) {
          throw new Error("HTTP error " + response.status);
      }
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  }

  public async post(url: string, params = {}): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, { method: 'POST', body: JSON.stringify(params), headers: this.headers });
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
