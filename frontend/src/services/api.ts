import axios, { type AxiosResponse } from "axios"

/**
 * Custom interface to override Axios's default behavior.
 * Since our interceptor returns `response.data`, we want TypeScript
 * to know that `api.get()` returns the DATA, not the full AxiosResponse object.
 */
interface TransformedAxios {
  get<T = any>(url: string, config?: any): Promise<T>
  post<T = any>(url: string, data?: any, config?: any): Promise<T>
  put<T = any>(url: string, data?: any, config?: any): Promise<T>
  delete<T = any>(url: string, config?: any): Promise<T>
}

const createService = (baseURL: string): TransformedAxios => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  instance.interceptors.request.use(
    (config) => {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          const { token } = JSON.parse(savedUser)
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e)
        }
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => {
      // Standardize error message for frontend consumption
      const message =
        error.response?.data?.message || error.message || "Something went wrong"
      return Promise.reject({ ...error, message })
    }
  )

  // Cast to our custom interface to fix TS errors in services
  return instance as any as TransformedAxios
}

export const movieApi = createService(import.meta.env.VITE_MOVIE_SERVICE_URL)
export const userApi = createService(import.meta.env.VITE_USER_SERVICE_URL)
export const bookingApi = createService(
  import.meta.env.VITE_BOOKING_SERVICE_URL
)
export const paymentApi = createService(
  import.meta.env.VITE_PAYMENT_SERVICE_URL
)

export default movieApi
