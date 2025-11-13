/**
 * Simple className utility function
 * Merges classNames together without external dependencies
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}

export default cn;