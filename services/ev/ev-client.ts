import { ApiResponse, ApiResponseList } from "@/global";
import { fetchAuthClient } from "@/lib/fetchWrapperClient/fetch-auth-client";
import { TEvResponse } from "@/types/evs";

export function getEvs(){
    const fetch = fetchAuthClient()

    const res = fetch.get<ApiResponseList<TEvResponse>>('/evs')

    return res
}

export function refreshOdds(){
    const fetch = fetchAuthClient()

    const res = fetch.post<null, ApiResponse<null>>('/run-main', null)

    return res
}