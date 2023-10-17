import { JSDOM } from 'jsdom'

export function setup() {
  const dom = new JSDOM()
  global.document = dom.window.document
  // @ts-expect-error Some APIs are missing, that's fine
  global.window = dom.window
  global.navigator = dom.window.navigator
}

export function reset() {
  window.document.title = ''
  window.document.head.innerHTML = ''
  window.document.body.innerHTML = '<main></main>'
}
