import Api from "./api";

const API_ENDPOINT = "https://api.bannerbear.com";
const API_ENDPOINT_SYNCHRONOUS = "https://syncapi.bannerbear.com/v2"

interface CreateImageParams { modifications: any[], webhook_url: string, transparent: boolean, render_pdf: boolean, metadata: any }

export default class Bannerbear {
  private apiToken: string;
  private api;
  private syncApi;

  constructor(apiToken: string) {
    this.apiToken = apiToken || String(process.env['BANNERBEAR_API_KEY']);
    this.api = new Api([
      ['Content-Type', 'application/json'],
      ['Authorization', `Bearer ${apiToken}`]
    ], API_ENDPOINT);
    this.syncApi = new Api([
      ['Content-Type', 'application/json'],
      ['Authorization', `Bearer ${apiToken}`]
    ], API_ENDPOINT_SYNCHRONOUS);
  }


  public async account() {
    return this.api.get('/action')
  }

  public async fonts() {
    return this.api.get('/fonts')
  }

  public async effects() {
    return this.api.get('/effects')
  }

  // =================================
  //            IMAGES
  // =================================

  public async get_image(uid: string) {
    return this.api.get(`/images/${uid}`)
  }

  public async list_images(page?: number, limit?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    if (limit) queryString.push(`limit=${limit}`)
    return this.api.get(`/images${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  public async create_image(uid: string, params: CreateImageParams, synchronous: boolean = false) {
    if (synchronous) {
      return this.syncApi.post('/images', { ...params, template: uid })
    }

    return this.api.post('/images', { ...params, template: uid })
  }
}
