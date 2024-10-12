import type {NitroFetchOptions, NitroFetchRequest} from "nitropack";
import {Socket} from "socket.io-client";
import type {ClientToServerEvents, Notification} from "sys-types";


declare global{
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

  interface ServerToClientEvents {
    new_comment_notification: (n: Notification) => void
    blog_notification: (n: Notification) => void
  }
  declare type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>
}

declare module '#app' {
  interface NuxtApp {
    $HttpUtils: HttpUtils
    $socketClient: SocketClient
    $initSocketIo: (host: string, uid: string) => void
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $HttpUtils: HttpUtils
    $socketClient: SocketClient
    $initSocketIo: (host: string, uid: string) => void
  }
}

export {}
