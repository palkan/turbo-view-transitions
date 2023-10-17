/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
import { performTransition, shouldPerformTransition } from './index.js'

performTransition(document.body, document.body, async () => {})
const isTransition: boolean = shouldPerformTransition()

// @ts-expect-error Type 'boolean' is not assignable
const isTransitionAgain: number = shouldPerformTransition()

// @ts-expect-error Argument of type '() => void' is not assignable
performTransition(document.body, document.body, () => {})

// @ts-expect-error Argument of type 'null' is not assignable
performTransition(null, null, async () => {
  return
})

// @ts-expect-error Expected 3-4 arguments, but got 1
performTransition(async () => {
  return
})
