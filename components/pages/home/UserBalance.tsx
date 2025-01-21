'use client'

import { useState } from 'react'
import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { getUserBalance, TBalanceValue, updateUserBalance } from '@/services/balance/balance'
import { useFormSubmitHandler } from '@/hooks/useFormSubmitHandler'
import { Form } from '@/components/ui/shadcn/form'
import InputDefault from '@/components/ui/input/ControlledInput/InputDefault'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiResponse } from '@/global'

const updateBalanceSchema = z.object({
    balance: z.string(),
})

type TUpdateBalanceFormData = z.infer<typeof updateBalanceSchema>

export function UserBalance({ balance, refetch }: { balance: string, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiResponse<TBalanceValue>, Error>> }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const { onSubmitHandler } = useFormSubmitHandler()

    const form = useForm<TUpdateBalanceFormData>({
        resolver: zodResolver(updateBalanceSchema),
        defaultValues: {
            balance: balance || ''
        }
    })

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleSaveClick = async (data: TUpdateBalanceFormData) => {
        setIsFetching(true)

        await onSubmitHandler({
            data: +data.balance,
            service: updateUserBalance,
            options: {
                onSuccessCb: () => {
                    refetch()
                    setIsEditing(false)
                    setIsFetching(false)
                },
                onFailureCb: () => setIsFetching(false),
                onSuccessMessage: {
                    title: "Saldo atualizado com sucesso!"
                },
                onCatchMessage: {
                    logService: {
                        block: "UserBalance",
                        component: "UserBalance",
                    }
                }
            }
        })
    }

    const handleCancelClick = () => {
        setIsEditing(false)
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className='pb-2 p-4'>
                <CardTitle>Saldo</CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                {isEditing ? (
                    <Form {...form}>
                        <form className='space-y-4' onSubmit={form.handleSubmit(handleSaveClick)}>
                            <InputDefault
                                form={form}
                                name='balance'
                                type="number"
                                placeholder="Digite o novo saldo"
                            />

                            <div className="flex space-x-2">
                                <Button type='submit' disabled={isFetching}>
                                    Salvar
                                </Button>
                                <Button type='button' variant="outline" onClick={handleCancelClick}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${parseFloat(balance).toFixed(2)}</span>
                        <Button onClick={handleEditClick}>Editar</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

