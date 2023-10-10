import { performTransition, shouldPerformTransition } from './index.js'

performTransition(document.body, document.body, async () => {})
const isTransition: boolean = shouldPerformTransition()

// THROWS Type 'boolean' is not assignable
const isTransitionAgain: number = shouldPerformTransition()

// THROWS Argument of type '() => void' is not assignable
performTransition(document.body, document.body, () => {})

// THROWS Argument of type 'null' is not assignable
performTransition(null, null, async () => {
  return
})

// THROWS Expected 3-4 arguments, but got 1
performTransition(async () => {
  return
})
