export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
