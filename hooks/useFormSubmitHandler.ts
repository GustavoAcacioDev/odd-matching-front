'use client'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

import useCustomToast from '@/hooks/use-custom-toast'
import { TFormSubmitHandler } from '@/types/form-submit'

export function useFormSubmitHandler() {
  const { successToast } = useCustomToast()
  const pathname = usePathname()

  const onSubmitHandler = useCallback(
    async function onSubmitHandler<TData, TResponse>({
      data,
      service,
      options,
    }: TFormSubmitHandler<TData, TResponse>) {
      const toastSuccessTitle = options.onSuccessMessage?.title || 'Sucesso'
      const toastSuccessMessage =
        options.onSuccessMessage?.message || 'Operação efeutada com sucesso!'

      const onFailureDialogTitle =
        options.onFailureMessage?.title || 'Algo deu errado'
      const onFailureDialogMessage = options.onFailureMessage?.message

      const onCatchDialogTitle =
        options.onCatchMessage?.dialog?.title || 'Algo deu errado'
      const onCatchDialogMessage =
        options.onCatchMessage?.dialog?.message ||
        'Não foi possível executar a operação. Por favor tente novamente mais tarde.'

      const onCatchLog =
        options.onCatchMessage?.log ||
        `Error on ${options.onCatchMessage.log?.path || ''}`

      try {
        const res = await service(data)

        if (res.isSuccess) {
          if (!options.onSuccessMessage?.disableToast) {
            successToast(toastSuccessTitle, toastSuccessMessage)
          }

          if (options.onSuccessCb) {
            options.onSuccessCb(res)
          }
        } else {

          if (options.onFailureCb) {
            options.onFailureCb(res)
          }
        }
      } catch (error) {
        const objError = error as Error
        if (onCatchLog) {
          console.error(onCatchLog, error)
        }

        if (options.onCatchCb) {
          options.onCatchCb(error as Error)
        }
      }
    },
    [pathname, successToast],
  )

  return { onSubmitHandler }
}
