declare module 'gauge' {
  class Gauge {
    show (status?: string | object | null, completed?: number): void

    hide (cb?: () => any): void

    pulse (subsection?: string): void
  }

  export = Gauge
}
