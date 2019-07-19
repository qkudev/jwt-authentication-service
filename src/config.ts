export const app = {
  nodeEnv: process.env.NODE_ENV,
  port: 5000,
};

export const jwt = {
  accessSecret: 'accessSecretKey',
  refreshSecret: 'refreshSecretKey',
  algorithm: 'HS256',
  accessExpiresIn: app.nodeEnv === 'test' ? 1 : 180,
  refreshExpiresIn: 604800,
};
