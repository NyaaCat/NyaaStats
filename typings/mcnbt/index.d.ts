declare module 'mcnbt' {
  class Tag {
    getValue (): unknown

    select (tagName: string): Tag
  }

  class NBT {
    loadFromZlibCompressedFile (filename: string, callback: (err: Nodejs.ErrnoException) => void): void

    select (tagName: string): Tag
  }

  export = NBT
}
