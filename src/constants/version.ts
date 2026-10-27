export const CURRENT_APP_VERSION = '2.8.1';
export const CURRENT_APP_VERSION_CODE = 14;

/**
 * Checks if remote semantic version is strictly greater than current version.
 * e.g. isNewerVersion('2.7.5', '2.7.4') => true
 */
export function isNewerVersion(remote: string, current: string = CURRENT_APP_VERSION): boolean {
  if (!remote || !current) return false;
  const parse = (v: string) =>
    v.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
  const r = parse(remote);
  const c = parse(current);
  for (let i = 0; i < Math.max(r.length, c.length); i++) {
    const rVal = r[i] || 0;
    const cVal = c[i] || 0;
    if (rVal > cVal) return true;
    if (rVal < cVal) return false;
  }
  return false;
}
