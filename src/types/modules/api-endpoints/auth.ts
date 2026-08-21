export type ApiUser = {
  id: string;
  email?: string;
  username?: string;
  displayName?: string;
};

export type ApiTokenPair = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};
