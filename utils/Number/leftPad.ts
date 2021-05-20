export default function (num: number, len: number): string {
  return String(num).padStart(len, '0')
}
