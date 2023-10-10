import { shouldPerformTransition } from './index.js'

describe('turbo-view-transitions', () => {
  describe('shouldPeformTransition', () => {
    beforeEach(() => {
      ;(document as any).startViewTransition = async () => {}
    })

    afterEach(() => {
      document.head.innerHTML = ''
    })

    it('has meta', () => {
      document.head.innerHTML = `
        <meta name="view-transition" content="same-origin">
      `
      expect(shouldPerformTransition()).toBe(true)
    })

    it('has no meta', () => {
      expect(shouldPerformTransition()).toBe(false)
    })

    it('has meta but no startViewTransition', () => {
      ;(document as any).startViewTransition = undefined

      document.head.innerHTML = `
        <meta name="view-transition" content="same-origin">
      `
      expect(shouldPerformTransition()).toBe(false)
    })
  })
})
