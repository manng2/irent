import axios, { AxiosInstance } from 'axios';

import { api, defaultConfigs } from '@/axios/axios';
import { GetStaticRequest } from '@/models/http/get-static-request';

export class Service<SelectModel, CreateModel, UpdateModel> {
  protected api: AxiosInstance;
  private defaultRequestPayload: GetStaticRequest = {
    includes: [],
    resolves: {},
  };

  constructor() {
    this.api = axios.create({
      ...defaultConfigs,
    });
  }

  protected setBaseURL(controllerName: string) {
    this.api.defaults.baseURL = `${this.api.defaults.baseURL}${controllerName}`;
  }

  protected setDefaultRequestPayload(
    defaultRequestPayload: GetStaticRequest | ((payload: GetStaticRequest) => GetStaticRequest),
  ) {
    if (typeof defaultRequestPayload == 'function') {
      console.log(defaultRequestPayload(this.defaultRequestPayload));

      this.defaultRequestPayload = defaultRequestPayload(this.defaultRequestPayload);
    } else {
      this.defaultRequestPayload = defaultRequestPayload;
    }
  }

  async getAll(request?: GetStaticRequest) {
    request = { ...this.defaultRequestPayload, ...request };
    try {
      const response = await this.api.post<SelectModel[]>(`/static`, request);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async get(id: string | number, request?: GetStaticRequest) {
    request = { ...this.defaultRequestPayload, ...request };
    try {
      const response = await this.api.post<SelectModel>(`/static/${id}`, request);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async create(data: CreateModel) {
    try {
      const response = await this.api.post<SelectModel>('/', data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
