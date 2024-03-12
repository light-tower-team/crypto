function getPrevBufLength(buffers: ArrayBuffer[], index: number): number {
  return buffers[index - 1]?.byteLength ?? 0;
}

export function concatBuffs(...buffers: ArrayBuffer[]): ArrayBuffer {
  const buffs = buffers.map((buf) => new Uint8Array(buf));
  const buf = new Uint8Array(new ArrayBuffer(buffs.reduce((length, { byteLength }) => length + byteLength, 0)));

  for (let i = 0, j = 0; i < buf.byteLength; ++i) {
    if (i - getPrevBufLength(buffs, j) === buffs[j].byteLength) {
      ++j;
    }

    buf[i] = buffs[j][i - getPrevBufLength(buffs, j)];
  }

  return buf.buffer;
}
