export interface ApiResponse<T> {
  value: T
  isSuccess: boolean
  hasWarnings: boolean
  errors: string[]
  warnings: string[]
}

export interface ApiResponseList<T> {
  total: number
  pageIndex: number
  items: T[]
  isSuccess: boolean
  hasWarnings: boolean
  errors: string[]
  warnings: string[]
}