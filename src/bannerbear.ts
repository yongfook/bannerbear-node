import { Headers } from "node-fetch";
import Api from "./api";

const API_ENDPOINT = "https://api.bannerbear.com/v2";
const API_ENDPOINT_SYNCHRONOUS = "https://syncapi.bannerbear.com/v2"

interface CreateImageParams { modifications: any[], webhook_url: string | null, transparent?: boolean, render_pdf?: boolean, metadata: string | null }

export default class Bannerbear {
  private api;
  private syncApi;

  constructor(apiToken: string) {
    const token = apiToken || String(process.env['BANNERBEAR_API_KEY']);
    this.api = new Api(new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }), API_ENDPOINT);
    this.syncApi = new Api(new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }), API_ENDPOINT_SYNCHRONOUS);
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

  // =================================
  //            VIDEOS
  // =================================

}
