declare module '*.woff2?url' {
  const url: string
  export default url
}

declare module '*.ttf' {
  export const css: {
    family: string
    weight?: number | string
  }
  export const fontFamilyFallback: string
}

declare module '*.otf' {
  export const css: {
    family: string
    weight?: number | string
  }
  export const fontFamilyFallback: string
}

declare module '*.ttf?subsets' {
  export const css: {
    family: string
    weight?: number | string
  }
  export const fontFamilyFallback: string
}

declare module '*.otf?subsets' {
  export const css: {
    family: string
    weight?: number | string
  }
  export const fontFamilyFallback: string
}
