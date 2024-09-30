import { type FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  onError?: (errMessage: string) => Promise<void> | void,
  initalState?: FormState,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<FormState>(
    initalState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      if (state.success === true && onSuccess) {
        await onSuccess()
      }
      if (state.success === false && onError) {
        if (!state.message) {
          await onError(
            'Ocorreu um problema, por favor tente nomevamente em alguns instantes',
          )
        } else {
          await onError(state.message)
        }
      }
      setFormState(state)
    })
  }
  return [formState, handleSubmit, isPending] as const
}
