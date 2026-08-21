import type { AuthPrincipal } from '@/types';

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

export const emptyAuthPrincipal: AuthPrincipal = {
  permissions: [],
  roles: [],
};

export function decodeAuthPrincipalFromAccessToken(
  accessToken: string | null,
): AuthPrincipal {
  if (!accessToken) {
    return emptyAuthPrincipal;
  }

  try {
    const payloadSegment = accessToken.split('.')[1];
    if (!payloadSegment) return emptyAuthPrincipal;
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))) as Record<string, unknown>;

    return {
      permissions: [...new Set(readStringArray(payload.permissions))],
      roles: [...new Set(readStringArray(payload.roles))],
    };
  } catch {
    return emptyAuthPrincipal;
  }
}
