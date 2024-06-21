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

enum StatusCode {
  success = 10000, // 成功
  notLogin = 40001, // 未登录
  illegalPath = 40002, // 非法路径
  tokenExpired = 20023, // token 过期
}

function commitFetch<T>(url: string, option: UtilFetchOptions) {
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
      if (process.client && (code === 111 || code === 999)) {
        token.value = null
        ElMessage.error(msg)
      }
    },
  });

  // todo: 这个传入的 option 应该是 NitroFetchOptions
  return oFetch<FetchRes<T>>(url, option);
}

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

    return commitFetch<T>(url, {
      method: 'post',
      body,
      ...option,
    });
  },
  get<T>(url: string, params?: Record<string, any>, option?: UtilFetchOptions) {
    return commitFetch<T>(url, {
      method: 'get',
      params,
      ...option,
    });
  },
};

export {$HttpUtils};
