import { ApiResponse } from "@/global";
import { fetchAnonServer } from "@/lib/fetchWrapperServer/fetch-anon-server";
import { TLoginCustomerBody, TLoginCustomerResponse } from "@/types/auth";

export async function loginServer({ username, password }: { username: string, password: string }) {
    const fetch = fetchAnonServer()

    const body: TLoginCustomerBody = {
        username,
        password
    }

    const res = await fetch.post<TLoginCustomerBody, ApiResponse<TLoginCustomerResponse>>('/login', body)
    
    return res
}