export type TLoginCustomerBody = {
    username: string
    password: string
  }
  
  export type TLoginCustomerResponse = {
    accessToken: string
    expiresIn: number
    expiresInDate: Date
  }