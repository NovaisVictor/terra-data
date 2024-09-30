export function getInitials(fullName: string): string {
  const names = fullName.split(' ')
  const initials = names.slice(0, 2).map((name) => name[0]) // .toUpperCase()
  return initials.join('')
}
