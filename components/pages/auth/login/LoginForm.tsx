'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/shadcn/form'
import InputDefault from '@/components/ui/input/ControlledInput/InputDefault'
import InputPassword from '@/components/ui/input/ControlledInput/InputPassword'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/services/auth/login/login-client'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/use-auth'

const loginSchema = z.object({
    username: z.string().min(1, 'Campo obrigatório'),
    password: z.string().min(1, 'Campo obrigatório'),
})

type TLoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { authWithNextAuth } = useAuth()

    const form = useForm<TLoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const handleSubmit = async (data: TLoginFormData) => {
        setIsLoading(true)

        try{
            await authWithNextAuth(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <InputDefault form={form} name="username" label='Usuário' />

                <InputPassword form={form} name="password" placeholder='Digite aqui' label='Senha' />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    Log in
                </Button>
            </form>
        </Form>
    )
}

