import { shouldPerformTransition, performTransition } from './index.js'

describe('shouldPeformTransition', () => {
  beforeEach(() => {
    document.head.innerHTML = `
      <meta name="view-transition" content="same-origin">
    `
    document.startViewTransition = (async () => {}) as unknown as any // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  })

  it('returns true when has meta and startViewTransition', () => {
    expect(shouldPerformTransition()).toBe(true)
  })

  it('return false when has no meta', () => {
    document.head.innerHTML = ''
    expect(shouldPerformTransition()).toBe(false)
  })

  it('returns false when has meta but no startViewTransition', () => {
    document.startViewTransition = undefined as unknown as any // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(shouldPerformTransition()).toBe(false)
  })
})

describe('peformTransition', () => {
  beforeEach(() => {
    document.startViewTransition = ((callback: () => unknown) => {
      const promise = new Promise<void>(resolve => {
        callback()
        resolve()
      })

      return { finished: promise }
    }) as unknown as any // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  })

  it('works when has one-to-one matching transition elements', async () => {
    const fromEl = document.createElement('div')
    fromEl.innerHTML = `
      <h1 data-turbo-transition="title">Hello</h1>
      <div id="target" data-turbo-transition="item">World</div>
      <span id="target2" data-turbo-transition="item">!</span>
      <p id="item_1" data-turbo-transition>1</p>
      <p id="item_2" data-turbo-transition>2</p>
      <p id="item_3" data-turbo-transition>3</p>
    `

    const toEl = document.createElement('div')
    toEl.innerHTML = `
      <div class="container">
        <h2 data-turbo-transition="title">Hallo</h1>
        <ul>
          <li id="target" data-turbo-transition="item">Welt</li>
        </ul>
        <p id="item_1" data-turbo-transition>1</p>
        <p id="item_3" data-turbo-transition>3</p>
      </div>
    `

    await performTransition(fromEl, toEl, async () => {
      expect(fromEl.querySelector('h1')?.style.viewTransitionName).toEqual(
        'title'
      )
      expect(toEl.querySelector('h2')?.style.viewTransitionName).toEqual(
        'title'
      )
      expect(fromEl.querySelector('div')?.style.viewTransitionName).toEqual(
        'item'
      )
      expect(toEl.querySelector('li')?.style.viewTransitionName).toEqual('item')
      expect(
        fromEl.querySelector('span')?.style.viewTransitionName
      ).toBeUndefined()

      expect(
        (fromEl.querySelector('#item_1') as HTMLElement).style
          .viewTransitionName
      ).toEqual('__item_1')
      expect(
        (toEl.querySelector('#item_1') as HTMLElement).style.viewTransitionName
      ).toEqual('__item_1')

      expect(
        (fromEl.querySelector('#item_2') as HTMLElement).style
          .viewTransitionName
      ).toBeUndefined()

      expect(
        (fromEl.querySelector('#item_3') as HTMLElement).style
          .viewTransitionName
      ).toEqual('__item_3')
      expect(
        (toEl.querySelector('#item_3') as HTMLElement).style.viewTransitionName
      ).toEqual('__item_3')
    })

    expect(fromEl.querySelector('div')?.style.viewTransitionName).toEqual('')
    expect(toEl.querySelector('li')?.style.viewTransitionName).toEqual('')
    expect(
      (fromEl.querySelector('#item_1') as HTMLElement).style.viewTransitionName
    ).toEqual('')
    expect(
      (fromEl.querySelector('#item_3') as HTMLElement).style.viewTransitionName
    ).toEqual('')
  })

  it('works when has multiple matching transition elements', async () => {
    const fromEl = document.createElement('div')
    fromEl.innerHTML = `
      <ul>
      <li id="a" data-turbo-transition="item">One</li>
      <li id="b" data-turbo-transition="item">Two</li>
      <li id="c" data-turbo-transition="item">Three</li>
    </ul>
    `

    const toEl = document.createElement('div')
    toEl.innerHTML = `
      <div class="container">
        <ul>
          <li id="b" data-turbo-transition="item">Two</li>
          <li id="c" data-turbo-transition="item">Three</li>
        </ul>
      </div>
    `

    await performTransition(fromEl, toEl, async () => {
      expect(
        (fromEl.querySelector('#a') as HTMLElement).style.viewTransitionName
      ).toBeUndefined()
      expect(
        (fromEl.querySelector('#b') as HTMLElement).style.viewTransitionName
      ).toBeUndefined()
      expect(
        (fromEl.querySelector('#c') as HTMLElement).style.viewTransitionName
      ).toBeUndefined()
      expect(
        (toEl.querySelector('#b') as HTMLElement).style.viewTransitionName
      ).toBeUndefined()
      expect(
        (toEl.querySelector('#c') as HTMLElement).style.viewTransitionName
      ).toBeUndefined()
    })
  })
})
