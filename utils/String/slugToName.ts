export default function (str: string): string {
  return str.split('-').join(' ').toUpperCase()
}
