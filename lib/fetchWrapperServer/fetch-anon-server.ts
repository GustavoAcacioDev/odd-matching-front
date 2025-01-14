export const fetchAnonServer = () => {
  async function http<T>(path: string, config: RequestInit): Promise<T> {
    console.count(`fetching ${path}`)

    config.headers = {
      ...config.headers,
    }

    const fullPath = path.includes('http')
      ? path
      : `${process.env.NEXT_PUBLIC_API_URL}${path}`

    const request = new Request(fullPath, config)
    let response: Response

    try {
      response = await fetch(request)
    } catch (error) {
      const objError = error as Error

      const errorBody = {
        status: 0,
        statusText: 'Fetch Error',
        endpoint: path,
        error: {
          message: objError.message,
          request: request.url,
        },
      }

      throw new Error(JSON.stringify(errorBody))
    }

    if (!response.ok) {
      try {
        const res = await response.json()

        if ('isSuccess' in res) {
          return res
        } else {
          throw new Error(JSON.stringify(res))
        }
      } catch (error) {
        const objError = error as Error

        const errorBody = {
          status: response.status,
          statusText: response.statusText,
          endpoint: path,
          error: objError.message,
        }

        throw new Error(JSON.stringify(errorBody))
      }
    }

    // may error if there is no body, return empty array
    return response.json().catch((error) => {
      const objError = error as Error

      const errorBody = {
        status: response.status,
        statusText: response.statusText,
        endpoint: path,
        error: 'No body found to parse, error: ' + objError.message,
      }

      return {}
    })
  }

  async function get<T>(path: string, config?: RequestInit): Promise<T> {
    const init = {
      method: 'get',
      'Content-Type': 'application/json',
      ...config,
    }

    return await http<T>(path, init)
  }

  async function post<T, U>(
    path: string,
    body: T,
    config?: RequestInit,
  ): Promise<U> {
    const init = {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    }
    return await http<U>(path, init)
  }

  async function postFile<U>(
    path: string,
    body: FormData,
    config?: RequestInit,
  ): Promise<U> {
    const isFormData = body instanceof FormData

    const init: RequestInit = {
      method: 'post',
      ...config,
    }

    if (isFormData) {
      init.body = body
    } else {
      init.body = JSON.stringify(body)
      init.headers = {
        ...init.headers,
        'Content-Type': 'application/json',
      }
    }

    return await http<U>(path, init)
  }

  async function put<T, U>(
    path: string,
    body: T,
    config?: RequestInit,
  ): Promise<U> {
    const init = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...config,
    }
    return await http<U>(path, init)
  }

  return { get, post, postFile, put }
}
