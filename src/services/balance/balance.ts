import { ApiResponse } from "../../../global";
import { fetchAuthClient } from "@/lib/fetchWrapperClient/fetch-auth-client";

export type TBalanceValue = {
    balance: number
}

type TUpdateBalanceBody = {
    amount: number
}

type TUpdateBalanceValue = {
    new_balance: number
}

export function getUserBalance() {
    const fetch = fetchAuthClient()

    const res = fetch.get<ApiResponse<TBalanceValue>>("/balance")

    return res
}

export function updateUserBalance(balance: number) {
    const fetch = fetchAuthClient()

    const body: TUpdateBalanceBody = {
        amount: balance
    }

    const res = fetch.post<TUpdateBalanceBody, ApiResponse<TUpdateBalanceValue>>("/update-balance", body)

    return res
}