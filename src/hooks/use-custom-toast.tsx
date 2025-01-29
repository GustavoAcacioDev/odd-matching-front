import { XCircle } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'
import { useToast } from './use-toast'
import { toastSuccess } from '@/assets'

export default function useCustomToast() {
  const { toast } = useToast()

  function errorToast(title: string, description: ReactNode | undefined) {
    return toast({
      action: (
        <div className="w-fit rounded-full bg-negativePure p-1">
          <XCircle className="h-10 w-10 text-white tablet:h-10 tablet:w-10" />
        </div>
      ),
      variant: 'danger',
      title,
      description: description || 'Tivemos um problema na autenticação.',
    })
  }

  function successToast(title: string, description: ReactNode | undefined) {
    return toast({
      action: (
        <div className="rounded-full bg-white p-1 tablet:w-fit">
          <Image src={toastSuccess} alt="" />
        </div>
      ),
      variant: 'success',
      title,
      description: description || 'Sua operação foi realizada com sucesso.',
    })
  }

  return { errorToast, successToast }
}
