import { ApiResponse } from '../../global'

export type TOnSubmitOptions<TResponse> = {
  /**
   * Messages to display on toast when isSuccess is true
   * @param title - title of the toast. Defaults to 'Sucesso'
   * @param message - Message of the toast. Defaults to 'Operação efeutada com sucesso!
   * @param disableToast - Disable toast from appearing. Defaults to true
   */
  onSuccessMessage?: {
    title?: string
    message?: string
    disableToast?: boolean
  }
  /**
   * Messages to display on dialog when isSuccess is false
   * @param status - status of the dialog. Defaults to 'fail'
   * See {@link TOpenDialogStatus} for more detail
   * @param title - title of the dialog. Defaults to 'Algo deu errado'
   */
  onFailureMessage?: {
    status?: TOpenDialogStatus
    title?: string
    message?: string
  }
  /**
   * Messages to display on the catch block
   *
   */
  onCatchMessage: {
    /**
     *
     * Messages to log on the server
     * @param component - name of the component
     * @param block - code block where the catch lies
     */
    logService: {
      component: string
      block: string
    }
    /**
     * Messages to display on the dialog of catch block
     *
     */
    dialog?: {
      status?: TOpenDialogStatus
      title?: string
      message?: string
    }
    /**
     * Message to log when fall on catch block
     * @param path - path of the error
     * @param customMessage - custom message for catch console.error
     */
    log?: {
      path: string
      customMessage?: string
    }
  }
  /**
   * Callback function to execute when isSuccess is true
   * @param res - response object available to use
   */
  onSuccessCb?: (res: ApiResponse<TResponse>) => void
  /**
   * Callback function to execute when isSuccess is false
   * @param res - response object available to use
   */
  onFailureCb?: (res: ApiResponse<TResponse>) => void
  /**
   * Callback function to execute when falls on catch block
   * @param error - error object available to use
   */
  onCatchCb?: (error: Error) => void
}

export type TFormSubmitHandler<TData, TResponseValue> = {
  /**
   * Data to be used in the service
   */
  data: TData
  /**
   * Service to be executed with body parameter
   */
  service: (body: TData) => Promise<ApiResponse<TResponseValue>>
  /**
   * Options for submit handler.
   * See {@link TOnSubmitOptions} for more details.
   */
  options: TOnSubmitOptions<TResponseValue>
}
