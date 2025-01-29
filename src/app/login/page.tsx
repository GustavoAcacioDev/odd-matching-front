import LoginForm from '@/components/pages/auth/login/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}

