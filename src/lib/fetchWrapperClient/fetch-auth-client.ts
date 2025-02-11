import { getSession } from 'next-auth/react';

export const fetchAuthClient = () => {
  async function http<T>(path: string, config: RequestInit, timeout = 120000): Promise<T> { // Default timeout 120s
    console.count(`fetching ${path}`)
  
    const session = await getSession()
  
    config.headers = {
      Authorization: `Bearer ${session?.user?.accessToken}`,
      ...config.headers,
    }
  
    const fullPath = path.includes('http')
      ? path
      : `${process.env.NEXT_PUBLIC_API_URL}${path}`
  
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
  
    const request = new Request(fullPath, { ...config, signal: controller.signal })
  
    let response: Response
  
    try {
      response = await fetch(request)
      clearTimeout(timeoutId) // Clear timeout when request is successful
    } catch (error) {
      clearTimeout(timeoutId)
  
      if ((error as Error).name === 'AbortError') {
        throw new Error(
          JSON.stringify({
            status: 408,
            statusText: 'Request Timeout',
            endpoint: path,
          })
        )
      }
  
      const errorBody = {
        status: 0,
        statusText: 'Fetch Error',
        endpoint: path,
        error: { message: (error as Error).message, request: request.url },
      }
  
      throw new Error(JSON.stringify(errorBody))
    }
  
    if (!response.ok) {
      try {
        const res = await response.json()
        if ('isSuccess' in res) return res
        else throw new Error(JSON.stringify(res))
      } catch (error) {
        if (response.status === 401) window.location.reload()
  
        throw new Error(
          JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            endpoint: path,
            error: (error as Error).message,
          })
        )
      }
    }
  
    return response.json().catch((error) => ({
      status: response.status,
      statusText: response.statusText,
      endpoint: path,
      error: 'No body found to parse, error: ' + (error as Error).message,
    }))
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

  async function del<T, U>(
    path: string,
    body: T,
    config?: RequestInit,
  ): Promise<U> {
    const init = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...config,
    }
    return await http<U>(path, init)
  }

  return { get, post, postFile, put, del }
}
