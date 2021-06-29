import axios from "axios";
import { queryObj, urlDict } from "./api-collections";
import { ElMessage } from "element-plus";

const obj2params = (obj: queryObj): string => {
  let result = "";
  let key;
  for (key in obj) {
    result += "&" + key + "=" + encodeURIComponent(obj[key]);
  }
  if (result) {
    result = result.slice(1);
  }
  return result;
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10000,
  responseType: "json"
});

// 添加请求拦截器
instance.interceptors.request.use(
  request => {
    // request.headers["x-rh-country"] = store_country;
    // request.headers["x-rh-host"] = import.meta.env.VITE_INFLUENCER_URL;
    return request;
  },
  err => {
    if (err.message) {
      ElMessage({
        type: "error",
        message: err.message
      });
    }
    return Promise.reject(err);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    if (err.message && err.message.includes("timeout")) {
      // 超时重新请求
      const config = err.config;
      const [RETRY_COUNT, RETRY_DELAY] = [3, 1000];
      if (config && RETRY_COUNT) {
        // 设置用于跟踪重试计数的变量
        config.__retryCount = config.__retryCount || 0;
        // 检查是否已经把重试的总数用完
        if (config.__retryCount >= RETRY_COUNT) {
          ElMessage({
            type: "error",
            message: err.message
          });
        }
        return Promise.reject(err);
      }
      config.__retryCount++;
      // 创造新的Promise来处理指数后退
      const backoff = new Promise(resolve => {
        setTimeout(() => {
          resolve(1);
        }, RETRY_DELAY || 1);
      });
      // instance重试请求的Promise
      return backoff.then(() => {
        return instance(config);
      });
    } else if (err.config.url === urlDict.auth.userInfo) {
      return Promise.reject(err);
    } else if (err.config.url.indexOf("/user/logout") !== -1) {
      return Promise.resolve(true);
    } else if (err.response) {
      switch (err.response.status) {
        case 500:
          ElMessage({
            type: "error",
            message: "System error. Pleasr try later!"
          });
          break;
        default:
          ElMessage({
            type: "error",
            message: err.response.data?.message || err.response.data?.errors[0].detail
          });
          break;
      }
      return Promise.reject(err);
    } else if (err.request) {
      // The request was made but no response was received
      ElMessage({
        type: "error",
        message: err.request.statusText || err.message || err.request
      });
      return Promise.reject(err);
    }
  }
);

export function get<T>(url: string, query?: queryObj): Promise<T> {
  if (query) {
    url = `${url}?${obj2params(query)}`;
  }
  const result: Promise<T> = instance
    .get(url, {
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      withCredentials: true
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
  return result;
}

export function post<T>(url: string, data: Record<string, unknown>): Promise<T> {
  // const csrf_token = (store.state as State).user.attributes.csrf_token;
  const result: Promise<T> = instance
    .post(url, data, {
      headers: {
        "Content-Type": "application/vnd.api+json"
        // "X-CSRF-Token": csrf_token
      },
      withCredentials: true
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
  return result;
}

export function patch<T>(url: string, data: Record<string, unknown>): Promise<T> {
  // const csrf_token = (store.state as State).user.attributes.csrf_token;
  const result: Promise<T> = instance
    .patch(url, data, {
      headers: {
        "Content-Type": "application/vnd.api+json"
        // "X-CSRF-Token": csrf_token
      },
      withCredentials: true
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
  return result;
}

export function both<T, K>(url1: string, url2: string, query1?: queryObj, query2?: queryObj): Promise<[T, K]> {
  const format_query1 = query1 && obj2params(query1);
  const format_query2 = query2 && obj2params(query2);
  if (query1 && format_query1) {
    url1 = `${url1}?${format_query1}`;
  }
  if (query2 && format_query2) {
    url1 = `${url2}?${format_query2}`;
  }
  const result: Promise<[T, K]> = axios
    .all([
      instance.get(url1, {
        headers: {
          "Content-Type": "application/vnd.api+json"
        },
        withCredentials: true
      }),
      instance.get(url2, {
        headers: {
          "Content-Type": "application/vnd.api+json"
        },
        withCredentials: true
      })
    ])
    .then(
      axios.spread((res1, res2) => {
        return Promise.resolve([res1.data, res2.data]);
      })
    );
  return result;
}

export function bothPatch<T, K>(url1: string, url2: string, data1: Record<string, unknown>, data2: Record<string, unknown>): Promise<[T, K]> {
  // const csrf_token = (store.state as State).user.attributes.csrf_token;
  const result: Promise<[T, K]> = axios
    .all([
      instance.patch(url1, data1, {
        headers: {
          "Content-Type": "application/vnd.api+json"
          // "X-CSRF-Token": csrf_token
        },
        withCredentials: true
      }),
      instance.patch(url2, data2, {
        headers: {
          "Content-Type": "application/vnd.api+json"
          // "X-CSRF-Token": csrf_token
        },
        withCredentials: true
      })
    ])
    .then(
      axios.spread((res1, res2) => {
        return Promise.resolve([res1.data, res2.data]);
      })
    );
  return result;
}

export function upload<T>(url: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("files[]", file);
  formData.append("permanent", "1");
  const result = instance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true,
      timeout: 12000
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
  return result;
}
