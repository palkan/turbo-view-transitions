export type TransitionCallback = () => Promise<void>

export type TransitionOptions = Partial<{
  activeAttr: string
  transitionAttr: string
}>

export function performTransition(
  fromEl: HTMLElement,
  toEl: HTMLElement,
  callback: TransitionCallback,
  options?: TransitionOptions
): Promise<void>

export function shouldPerformTransition(): boolean
