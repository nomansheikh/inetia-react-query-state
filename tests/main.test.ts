import { expect, it } from "vitest"

import { useInertiaQueryState } from "../src"

it("exports only useInertiaQueryState", () => {
  expect(typeof useInertiaQueryState).toBe("function")
})
