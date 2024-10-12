import type {NitroFetchOptions, NitroFetchRequest} from "nitropack";

declare global {
  declare type UtilFetchOptions = NitroFetchOptions<NitroFetchRequest> & {
    isFormData?: boolean;
    isSilent?: boolean;
    silentCodeList?: string[];
  };

// 后端返回的数据类型
  declare interface FetchRes<T> {
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

  declare interface HttpUtils {
    post: BasePost;

    get: BaseGet;
  }

  declare interface WebSocketClient {
    handleDisconnect: () => void;
    initSocketIo: (host: string, uid: string) => void;
  }

}

declare module '#app' {
  interface NuxtApp {
    $HttpUtils: HttpUtils;
    $webSocketClient: WebSocketClient;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $HttpUtils: HttpUtils;
    $webSocketClient: WebSocketClient;
  }
}

export {}
