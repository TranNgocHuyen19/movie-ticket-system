import axios, { type AxiosResponse } from "axios"

export interface TransformedAxios {
  get<T = any>(url: string, config?: any): Promise<T>
  post<T = any>(url: string, data?: any, config?: any): Promise<T>
  put<T = any>(url: string, data?: any, config?: any): Promise<T>
  delete<T = any>(url: string, config?: any): Promise<T>
}

export const createService = (baseURL: string): TransformedAxios => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => {
      const message =
        error.response?.data?.message || error.message || "Something went wrong"
      return Promise.reject({ ...error, message })
    }
  )

  return instance as any as TransformedAxios
}
