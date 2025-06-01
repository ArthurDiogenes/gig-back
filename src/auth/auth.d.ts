export interface TokenPayload {
  email: string;
  sub: {
    id: string;
    role: 'band' | 'venue' | 'admin';
  };
}
