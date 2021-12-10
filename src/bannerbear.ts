import { Headers } from "node-fetch";
import crypto from "crypto";
import base64url from 'base64url';
import Api from "./api";

const API_ENDPOINT = "https://api.bannerbear.com/v2";
const API_ENDPOINT_SYNCHRONOUS = "https://sync.api.bannerbear.com/v2"

interface CreateImageParams { modifications: any[], webhook_url?: string | null, transparent?: boolean, render_pdf?: boolean, metadata?: string | null }
interface CreateVideoParams { input_media_url: string, modifications: any[], blur?: number, trim_to_length_in_seconds?: number, webhook_url?: string, metadata?: string | null, frames?: any[], frame_duration?: any[], create_gif_preview?: boolean }
interface UpdateVideoParams { transcription?: string[], approved?: boolean }

interface UpdateTemplateParams { name?: string, tags?: string[], metadata?: any[]}

interface CreateCollectionParams { modifications: any[], webhook_url?: string | null, metadata?: string, transparent?: boolean }

interface CreateScreenshotParams { width?: number, height?: number, mobile?: boolean, webhook_url?: string}

interface CreateAnimatedGifParams { frames: any[], input_media_url?: string }

interface CreateMovieParams { width: number, height: number, inputs: any[], transition?: string, soundtrack_url?: string, webhook_url?: string, metadata?: string}

interface ListTemplateParams { tag?: string, name?: string, page?: number, limit?: number,}

export interface Image {
  created_at: string;
  status: string; // 'pending' or 'completed'
  self: string;
  uid: string;
  image_url: string;
  image_url_png: string;
  image_url_jpg: string;
  template: string;
  modifications: any[];
  webhook_url: string | null;
  webhook_response_code: string | null;
  transparent: boolean;
  metadata: any[] | null;
  template_name: string;
  width: number;
  height: number;
  render_pdf: boolean;
  pdf_url: string | null;
}

export interface Video {
  input_media_url: string;
  created_at: string;
  length_in_seconds: number | null;
  approval_required: boolean;
  approved: boolean;
  status: string;
  self: string;
  uid: string;
  render_type: string;
  percent_rendered: number | null;
  video_url: string | null;
}

export interface Template {
  created_at: string;
  updated_at: string;
  name: string;
  self: string;
  uid: string;
  preview_url: string;
  width: number;
  height: number;
  available_modifications: any[];
  metadata: any[] | null;
  tags: any[] | null;
}

export interface VideoTemplate extends Template {
  approval_required: boolean;
  render_type: string;
}

export interface TemplateSet {
  name: string;
  created_at: string;
  self: string;
  uid: string;
  available_modifications: any[];
  templates: any[]
}

export interface Screenshot {
  url: string;
  width: number;
  height: number | null;
  created_at: string;
  mobile: boolean;
  self: string;
  uid: string;
  screenshot_image_url: string;
  screenshot_png_url: string | null;
  webhook_url: string | null;
  webhook_response_code: string | null;
  status: string;
}

export interface Collection {
  created_at: string;
  uid: string;
  self: string;
  status: string;
  template_set: string;
  modifications: any[] | null;
  webhook_url: string | null;
  webhook_response_code: string | null;
  transparent: boolean;
  metadata: any[] | null;
  image_urls: any[] | null;
  images: Image[] | null;
}

export interface AnimatedGif {
  created_at: string;
  uid: string;
  self: string;
  template: string;
  status: string;
  input_media_url: string | null;
  frames: any[] | null;
  fps: number;
  frame_duration: any[] | null;
  loop: boolean;
  webhook_url: string | null;
  webhook_response_code: string | null;
  metadata: any[] | null;
}

export interface Movie {
  created_at: string;
  status: string;
  self: string;
  uid: string;
  width: number;
  height: number;
  percent_rendered: number;
  total_length_in_seconds: number | null;
  transition: string;
  soundtrack_url: string | null;
  inputs: any[] | null;
  movie_url: string | null;
  webhook_url: string | null;
  webhook_response_code: string | null;
  metadata: any[] | null;
}

export interface Font {
  Serif: Array<string>;
  "Sans Serif": Array<string>;
  Novelty: Array<string>;
  International: Array<string>;
  Custom: Array<string>;
}

export interface Account {
  created_at: string;
  uid: string;
  paid_plan_name: string;
  image_api_quota: number;
  image_api_usage_this_month: number;
  video_api_quota: number;
  video_api_usage_this_month: number;
  current_project: any;
}

export class Bannerbear {
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


  public async account(): Promise<Account> {
    return this.api.get('/account') as Promise<Account>
  }

  public async fonts(): Promise<Font> {
    return this.api.get('/fonts') as Promise<Font>
  }

  public async effects(): Promise<Array<string>> {
    return this.api.get('/effects') as Promise<Array<string>>
  }

  // =================================
  //            IMAGES
  // =================================

  public async get_image(uid: string): Promise<Image> {
    return this.api.get(`/images/${uid}`) as Promise<Image>
  }


  public async list_images(page?: number, limit?: number): Promise<Image[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    if (limit) queryString.push(`limit=${limit}`)
    return this.api.get(`/images${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Image[]>
  }

  public async create_image(uid: string, params: CreateImageParams, synchronous: boolean = false): Promise<Image> {
    if (synchronous) {
      return this.syncApi.post('/images', { ...params, template: uid }) as Promise<Image>
    }

    return this.api.post('/images', { ...params, template: uid }) as Promise<Image>
  }

  // =================================
  //            VIDEOS
  // =================================
  public async get_video(uid: string): Promise<Video> {
    return this.api.get(`/videos/${uid}`) as Promise<Video>
  }

  public async list_videos(page?: number): Promise<Video[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/videos${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Video[]>
  }

  public async create_video(uid: string, params: CreateVideoParams): Promise<Video> {
    return this.api.post('/videos', { ...params, video_template: uid }) as Promise<Video>
  }

  public async update_video(uid: string, params: UpdateVideoParams): Promise<Video> {
    return this.api.patch('/videos', { ...params, uid: uid }) as Promise<Video>
  }

  // =================================
  //            COLLECTIONS
  // =================================

  public async get_collection(uid: string): Promise<Collection> {
    return this.api.get(`/collections/${uid}`) as Promise<Collection>
  }

  public async list_collections(page?: number): Promise<Collection[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/collections${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Collection[]>
  }

  public async create_collection(uid: string, params: CreateCollectionParams, synchronous = false): Promise<Collection> {
    if (synchronous) {
      return this.syncApi.post('/collections', { ...params, template_set: uid }) as Promise<Collection>
    }
    return this.api.post('/collections', { ...params, template_set: uid }) as Promise<Collection>
  }

  // =================================
  //            SCREENSHOTS
  // =================================

  public async get_screenshot(uid: string): Promise<Screenshot> {
    return this.api.get(`/screenshots/${uid}`) as Promise<Screenshot>
  }

  public async list_screenshots(page?: number): Promise<Screenshot[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/screenshots${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Screenshot[]>
  }

  public async create_screenshot(url: string, params?: CreateScreenshotParams, synchronous = false): Promise<Screenshot> {
    if (synchronous) {
      return this.syncApi.post('/screenshots', { ...params, url }) as Promise<Screenshot>
    }
    return this.api.post(`/screenshots`, { ...params, url }) as Promise<Screenshot>
  }

  // =================================
  //            ANIMATED GIFS
  // =================================

  public async get_animated_gif(uid: string): Promise<AnimatedGif> {
    return this.api.get(`/animated_gifs/${uid}`) as Promise<AnimatedGif>
  }

  public async list_animated_gifs(page?: number): Promise<AnimatedGif[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/animated_gifs${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<AnimatedGif[]>
  }

  public async create_animated_gif(uid: string, params: CreateAnimatedGifParams): Promise<AnimatedGif> {
    return this.api.post(`/animated_gifs`, { ...params, template: uid }) as Promise<AnimatedGif>
  }

  // =================================
  //            MOVIES
  // =================================

  public async get_movie(uid: string): Promise<Movie> {
    return this.api.get(`/movies/${uid}`) as Promise<Movie>
  }

  public async list_movies(page?: number): Promise<Movie[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/movies${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Movie[]>
  }

  public async create_movie(params: CreateMovieParams): Promise<Movie> {
    return this.api.post(`/movies`, { ...params }) as Promise<Movie>
  }

  // =================================
  //            TEMPLATES
  // =================================

  public async get_template(uid: string): Promise<Template> {
    return this.api.get(`/templates/${uid}`) as Promise<Template>
  }

  public async update_template(uid: string, params: UpdateTemplateParams): Promise<Template> {
    return this.api.patch(`/templates/${uid}`, { ...params })  as Promise<Template>
  }

  public async list_templates(params?: ListTemplateParams): Promise<Template[]> {
    const { page, limit, tag, name } = params || {};
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    if (tag) queryString.push(`tag=${tag}`)
    if (limit) queryString.push(`limit=${limit}`)
    if (name) queryString.push(`name=${name}`)
    return this.api.get(`/templates${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Template[]>
  }

  // =================================
  //            TEMPLATE SETS
  // =================================

  public async get_template_set(uid: string): Promise<TemplateSet> {
    return this.api.get(`/template_sets/${uid}`) as Promise<TemplateSet>
  }

  public async list_template_sets(page?: number): Promise<TemplateSet[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/template_sets${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<TemplateSet[]>
  }

  // =================================
  //            VIDEO TEMPLATES
  // =================================

  public async get_video_template(uid: string): Promise<VideoTemplate> {
    return this.api.get(`/video_templates/${uid}`) as Promise<VideoTemplate>
  }

  public async list_video_templates(page?: number): Promise<VideoTemplate[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/video_templates${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<VideoTemplate[]>
  }

  // =================================
  //            SIGNED URLS
  // =================================
  public async generate_signed_url(base_id: string, modifications: any, synchronous = false): Promise<string> {
    const base = `https://${synchronous ? 'cdn' : 'ondemand'}.bannerbear.com/signedurl/${base_id}/image.jpg`
    const query = `?modifications=${base64url(JSON.stringify(modifications))}`
    const signature = crypto.createHmac('sha256', this.token).update(`${base}${query}`).digest('hex')
    return `${base}${query}&s=${signature}`
  }
}

export default Bannerbear;
