export type AuthPermissionCode = string;

export type AuthPrincipal = {
  permissions: AuthPermissionCode[];
  roles: string[];
};

export type AuthAccessTokenPayload = {
  roles?: unknown;
  permissions?: unknown;
};
