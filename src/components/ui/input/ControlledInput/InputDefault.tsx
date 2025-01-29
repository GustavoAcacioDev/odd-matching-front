'use client'
import React, { HTMLAttributes } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form'
import { Input } from '../../shadcn/input'

const InputDefault = <TFieldValues extends FieldValues = FieldValues>({
  name,
  placeholder = 'Digite aqui',
  form,
  type = 'text',
  className,
  disabled,
  required,
  inputMode,
  label,
  isOptional,
  onChange,
}: {
  name: Path<TFieldValues>
  placeholder?: string
  type?: React.HTMLInputTypeAttribute | undefined
  form: UseFormReturn<TFieldValues>
  label?: string
  isOptional?: boolean
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  className?: string
  disabled?: boolean
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => string
}) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={twMerge('relative w-full', className)}>
          {label && (
            <div className="flex w-full items-center justify-between">
              <FormLabel>
                {label}{' '}
                {isOptional && (
                  <span className="text-xs font-semibold text-gray-500">
                    (opcional)
                  </span>
                )}
              </FormLabel>
            </div>
          )}
          <FormControl>
            <Input
              {...field}
              required={required}
              type={type}
              placeholder={placeholder}
              inputMode={inputMode}
              disabled={disabled}
              onChange={(e) =>
                onChange ? field.onChange(onChange(e)) : field.onChange(e)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputDefault
