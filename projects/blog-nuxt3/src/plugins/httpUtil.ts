import type {NitroFetchOptions, NitroFetchRequest} from 'nitropack';

// 后端返回的数据类型
interface FetchRes<T> {
  result?: T;
  code?: number;
  msg?: string;
  success: boolean;
}

interface BasePost {
  <T>(
    url: string,
    body?: BodyInit | Record<string, any>,
    option?: Omit<UtilFetchOptions, 'method'>,
  ): Promise<FetchRes<T>>
}

interface BaseGet {
  <T>(
    url: string,
    params?: Record<string, any>,
    option?: Omit<UtilFetchOptions, 'method'>,
  ): Promise<FetchRes<T>>
}

export type UtilFetchOptions = NitroFetchOptions<NitroFetchRequest> & {
  isFormData?: boolean;
  isSilent?: boolean;
  silentCodeList?: string[];
};

interface HttpUtils {
  post: BasePost;

  get: BaseGet;
}

export default defineNuxtPlugin(({ $pinia }) => {
  // 从运行时配置中获取代理和平台信息
  const runTimeConfig = useRuntimeConfig()
  let Authorization = ''
  const token = useCookie('token')
  if (token.value) Authorization = 'Bearer ' + token.value

  const oFetch = $fetch.create({
    baseURL: runTimeConfig.public.apiBase,
    headers: {
      Authorization: Authorization
    },
    onRequest({options}) {
      options.query = options.query || {};
    },
    onRequestError({request, error}) {
      console.log('Fetch request error', request, error);
    },
    onResponse({response}) {
      const {code, success, msg} = response._data || {}
      if([111, 999].includes(code)){
        token.value = null
      }
      if (import.meta.client && !success && msg) {
        ElMessage.error(msg)
      }
    },
  });

  const $HttpUtils: HttpUtils = {
    post<T>(url: string, body?: BodyInit | Record<string, any>, option?: UtilFetchOptions) {
      const {isFormData = false} = option || {}
      if (isFormData && body && typeof body === 'object' && body.constructor === Object) {
        const fd = new FormData()
        Object.keys(body).forEach((k: string) => {
          if ((body as Record<string, any>)[k] !== undefined) fd.append(k, (body as Record<string, any>)[k])
        })
        body = fd
      }

      return oFetch<FetchRes<T>>(url, {
        method: 'post',
        body,
        ...option,
      });
    },
    get<T>(url: string, params?: Record<string, any>, option?: UtilFetchOptions) {
      return oFetch<FetchRes<T>>(url, {
        method: 'get',
        params,
        ...option,
      });
    },
  };

  return {
    provide: {
      HttpUtils: $HttpUtils
    }
  }
})
