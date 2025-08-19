"use client"

import type { VisitOptions } from "@inertiajs/core"
import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"

import useUpdateEffect from "./useUpdateEffect"

interface IOptions<T> extends Omit<VisitOptions, "preserveState"> {
  resetValue?: string // value to trigger resetting the query param for example: all, none, etc
  defaultValue?: T
}

export default function useQueryState<T>(key: string, options?: IOptions<T>) {
  const [value, setValue] = useState<T | undefined>(
    options?.defaultValue || undefined,
  )

  useUpdateEffect(() => {
    handleUpdateQueryParam()
  }, [value])

  useEffect(() => {
    handleSetInitialQueryParam()
  }, [])

  function handleUpdateQueryParam() {
    const params = new URLSearchParams(window.location.search)

    if (value === undefined || value === options?.resetValue) {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }

    const url = `${window.location.pathname}?${params.toString()}`

    router.visit(url, {
      preserveState: true,
      ...options,
    })
  }

  function handleSetInitialQueryParam() {
    const params = new URLSearchParams(window.location.search)
    const queryParamValue = params.get(key)

    if (queryParamValue && queryParamValue !== value) {
      setValue(queryParamValue as T)
    }
  }

  return [value, setValue] as const
}
