import type { DependencyList, EffectCallback } from "react"
import { useEffect } from "react"

import useIsFirstRender from "./useIsFirstRender"

export default function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const isFirst = useIsFirstRender()

  useEffect(() => {
    if (!isFirst) {
      return effect()
    }
  }, deps)
}
