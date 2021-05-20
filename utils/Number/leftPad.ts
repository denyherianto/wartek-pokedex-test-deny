export default function (num: number, len: number): string {
  if (!!num && !!len) {
    return String(num).padStart(len, '0')
  }
  return ''
}
