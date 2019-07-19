declare type TokenType = 'ACCESS' | 'REFRESH';

declare interface Token<T extends TokenType> {
  id: string;
  identity: string;
  type: T;
  createdAt: Date;
}

declare interface SignedTokenPair {
  access: string;
  refresh: string;
}

declare interface Identity {
  id: string;
  refreshTokens: string[];
  data: any;

  createdAt: Date;
  updatedAt: Date;
}
