/*
 * Media queries utility
 */

export type DeviceSize = keyof typeof sizes

// Update your breakpoints if you want
export const sizes = {
  /** 280px */
  // xxs: 280,

  /** 360px */
  xs: 360,

  /** 600px */
  sm: 600,

  /** 960px */
  md: 1024,

  lg13: 1375,

  lg14: 1440,

  /** 1600px */
  lg: 1600,

  /** 1920px */
  xl: 1920,
}

// For CSS
export const media = (Object.keys(sizes) as Array<keyof typeof sizes>).reduce((acc, label) => {
  acc[label] = `@media (max-width: ${sizes[label]}px)`

  return acc
}, {} as { [K in keyof typeof sizes]: string })

/**
 * How to use,
 *
 * import {media} from '...'
 *
 * ---> CSS
 * const Element = styled.div`
 *  ${media.sm} {
 *    ...
 * }
 * `
 */

export enum AnimationMedia {
  md_up = "(min-width: 760px)",

  md = "(max-width: 1023px)",

  lg_only = "(min-width: 1024px)",
  md_only = "(min-width: 768px) and (max-width: 1023px)",
  sm_only = "(max-width: 767px)",

  no_pref = "(prefers-reduced-motion: no-preference)",
}

export type DeviceBoolean = Record<DeviceSize, boolean>
