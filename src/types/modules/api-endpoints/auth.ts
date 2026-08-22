export interface ApiTokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface ApiRefreshTokenPayload {
  refreshToken: string;
}

export interface ApiLogoutPayload {
  refreshToken?: string;
}

export interface ApiLogoutResult {
  success: boolean;
}
