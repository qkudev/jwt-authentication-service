import * as path from 'path';
import * as fs from 'fs';

const {
  env: { NODE_ENV },
} = process;
const dotenvPath = path.resolve(process.cwd(), '.env');

const dotenvFiles = [
  `${dotenvPath}.${NODE_ENV}.local`,
  `${dotenvPath}.${NODE_ENV}`,
  NODE_ENV !== 'test' && `${dotenvPath}.local`,
  dotenvPath,
].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});

export const app = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  useCors: process.env.CORS === 'true',
  apiKey: process.env.API_KEY,
};

export const jwt = {
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  algorithm: 'HS256',
  accessExpiresIn: app.nodeEnv === 'test' ? 1 : process.env.ACCESS_EI || 3600,
  refreshExpiresIn: process.env.REFRESH_EI || 604800,
};

export const redis = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
};
