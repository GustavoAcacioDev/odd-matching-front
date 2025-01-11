export interface ApiResponse<T> {
    value: T
    isSuccess: boolean
    hasWarnings: boolean
    errors: string[]
    warnings: string[]
  }