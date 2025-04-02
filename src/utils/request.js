import axios from "axios";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 处理请求错误
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 处理响应数据
    return res;
  },
  (error) => {
    // 处理响应错误
    console.log("err" + error);
    return Promise.reject(error);
  }
);

export default service;
