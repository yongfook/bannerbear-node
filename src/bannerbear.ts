import { Headers } from "node-fetch";
import crypto from "crypto";
import base64url from 'base64url';
import Api from "./api";

const API_ENDPOINT = "https://api.bannerbear.com/v2";
const API_ENDPOINT_SYNCHRONOUS = "https://syncapi.bannerbear.com/v2"

interface CreateImageParams { modifications: any[], webhook_url?: string | null, transparent?: boolean, render_pdf?: boolean, metadata: string | null }
interface CreateVideoParams { input_media_url: string, modifications: any[], blur?: number, trim_to_length_in_seconds?: number, webhook_url?: string, metadata: string | null, frames?: any[], frame_duration?: any[], create_gif_preview?: boolean }
interface UpdateVideoParams { transcription?: string[], approved?: boolean }

interface UpdateTemplateParams { name?: string, tags?: string[], metadata?: any[]}

interface CreateCollectionParams { modifications: any[], webhook_url?: string | null, metadata?: string, transparent?: boolean }

interface CreateScreenshotParams { width?: number, height?: number, mobile?: boolean, webhook_url?: string}

interface CreateAnimatedGifParams { frames: any[], input_media_url?: string }

interface CreateMovieParams { width: number, height: number, inputs: any[], transition?: string, soundtrack_url?: string, webhook_url?: string, metadata?: string}

interface ListTemplateParams { tag?: string, name?: string, page?: number, limit?: number,}

export default class Bannerbear {
  private api;
  private syncApi;
  private token: string;

  constructor(apiToken?: string) {
    this.token = apiToken || String(process.env['BANNERBEAR_API_KEY']);
    this.api = new Api(new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }), API_ENDPOINT);
    this.syncApi = new Api(new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
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
  public async get_video(uid: string) {
    return this.api.get(`/videos/${uid}`)
  }

  public async list_video(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/videos${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  public async create_video(uid: string, params: CreateVideoParams) {
    return this.api.post('/videos', { ...params, video_template: uid })
  }

  public async update_video(uid: string, params: UpdateVideoParams) {
    return this.api.patch('/videos', { ...params, uid: uid })
  }

  // =================================
  //            COLLECTIONS
  // =================================

  public async get_collection(uid: string) {
    return this.api.get(`/collections/${uid}`)
  }

  public async list_collections(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/collections${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  public async create_collection(uid: string, params: CreateCollectionParams, synchronous = false) {
    if (synchronous) {
      return this.syncApi.post('/collections', { ...params, template_set: uid })
    }
    return this.api.post('/collections', { ...params, template_set: uid })
  }

  // =================================
  //            SCREENSHOTS
  // =================================

  public async get_screenshot(uid: string) {
    return this.api.get(`/screenshots/${uid}`)
  }

  public async list_screenshots(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/screenshots${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  public async create_screenshot(url: string, params: CreateScreenshotParams, synchronous = false) {
    if (synchronous) {
      this.syncApi.post('/screenshots', { ...params, url })
    }
    return this.api.post(`/screenshots`, { ...params, url })
  }

  // =================================
  //            ANIMATED GIFS
  // =================================

  public async get_animated_gif(uid: string) {
    return this.api.get(`/animated_gifs/${uid}`)
  }

  public async list_animated_gifs(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/animated_gifs${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  public async create_animated_gif(uid: string, params: CreateAnimatedGifParams) {
    return this.api.post(`/animated_gif`, { ...params, template: uid })
  }

  // =================================
  //            MOVIES
  // =================================

  public async get_movie(uid: string) {
    return this.api.get(`/movies/${uid}`)
  }

  public async list_movies(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/movies${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  public async create_movie(params: CreateMovieParams) {
    return this.api.post(`/movies`, { ...params })
  }

  // =================================
  //            TEMPLATES
  // =================================

  public async get_template(uid: string) {
    return this.api.get(`/templates/${uid}`)
  }

  public async update_template(uid: string, params: UpdateTemplateParams) {
    return this.api.patch(`/templates/${uid}`, { ...params })
  }

  public async list_templates(params: ListTemplateParams) {
    const { page, limit, tag, name } = params;
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    if (tag) queryString.push(`tag=${tag}`)
    if (limit) queryString.push(`limit=${limit}`)
    if (name) queryString.push(`name=${name}`)
    return this.api.get(`/templates${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  // =================================
  //            TEMPLATE SETS
  // =================================

  public async get_template_set(uid: string) {
    return this.api.get(`/template_sets/${uid}`)
  }

  public async list_template_sets(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/template_sets${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  // =================================
  //            VIDEO TEMPLATES
  // =================================

  public async get_video_template(uid: string) {
    return this.api.get(`/video_templates/${uid}`)
  }

  public async list_video_templates(page?: number) {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/video_templates${queryString.length > 0 ? `?` + queryString.join('&') : '' }`)
  }

  // =================================
  //            SIGNED URLS
  // =================================
  public async generate_signed_url(base_id: string, modifications: any, synchronous = false) {
    const base = `https://${synchronous ? 'cdn' : 'ondemand'}.bannerbear.com/signedurl/${base_id}/image.jpg`
    const query = `?modifications=${base64url(JSON.stringify(modifications))}`
    const signature = crypto.createHmac('sha256', this.token).update(`${base}${query}`).digest('hex')
    return `${base}${query}&s=${signature}`
  }
}
