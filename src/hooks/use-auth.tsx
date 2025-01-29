import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { TLoginCustomerBody } from '@/types/auth'


export default function useAuth() {
  const router = useRouter()

  async function authWithNextAuth(data: TLoginCustomerBody) {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    })

    if (res?.ok) {
      console.log('sign in response', res)
      return router.push('/')
    }

    if (res?.status === 403) {
      return router.push('/blocked-access')
    }

    console.log('sign in error', res)
  }

  return { authWithNextAuth }
}
