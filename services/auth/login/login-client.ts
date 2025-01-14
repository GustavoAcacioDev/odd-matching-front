import { ApiResponse } from "@/global";
import { fetchAnonClient } from "@/lib/fetchWrapperClient/fetch-anon-client";
import { TLoginCustomerBody, TLoginCustomerResponse } from "@/types/auth";

export function login({ username, password }: { username: string, password: string }) {
    const fetch = fetchAnonClient()

    const body: TLoginCustomerBody = {
        username,
        password
    }

    const res = fetch.post<TLoginCustomerBody, ApiResponse<TLoginCustomerResponse>>('/login', body)

    return res
}