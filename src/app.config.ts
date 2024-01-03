import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { join } from 'path';
import { InvalidConfigError } from 'src/app.errors';

type EnvType = string | number | boolean;

interface EnvConstructor<T extends EnvType> {
  (value: any): T;
}

export enum Env {
  dev = 'dev',
  test = 'test',
  prod = 'prod',
  stage = 'stage',
}

const DOTENV_ROOT = join(process.cwd(), 'env/');
const DOTENV_LOCAL = join(DOTENV_ROOT, 'dev.local.env');

const NUMBER = Number as EnvConstructor<number>;
const STRING = String as EnvConstructor<string>;
// const BOOLEAN = Boolean as EnvConstructor<boolean>;

/**
 * Parse env value for given type. Error
 * if not present.
 */
function parse<T extends EnvType>(key: string, cast: EnvConstructor<T>): T {
  const value = process.env[key];
  const transformed = cast(value);

  if (value === null || value === undefined) {
    throw new InvalidConfigError(`ENV Variable not present: ${key}`);
  }

  if (cast === NUMBER && Number.isNaN(transformed as any)) {
    throw new InvalidConfigError(`Invalid Number: ${key} ("${value}")`);
  }

  return transformed;
}

/**
 * Ensure a valid env name is used
 */
const getEnvName = (): Env => {
  const env = process.env.NODE_ENV;
  if (!env) return Env.dev;
  if (env in Env) return env as Env;

  throw new InvalidConfigError(`Unknown Environment: ${env}`);
};

/**
 * Read, parse, organize and return configs
 */
export const loadConfig = () => {
  const env = getEnvName();
  // const isLocal = [Env.dev, Env.test].includes(env);

  // TODO: Replace with logger
  console.log(`Loading ENV: ${env}`);

  // Load Main Env File
  dotenv.config({ path: join(DOTENV_ROOT, `${env}.env`) });

  // Override with local file if present and on dev
  if (env === Env.dev && fs.existsSync(DOTENV_LOCAL)) {
    dotenv.config({ path: DOTENV_LOCAL, override: true });
  }

  // TODO: Enable CORS
  // const origins = isLocal ? true : [
  //  'https://reframe-stage-sap.fly.dev',
  //  /\.reframedev\.com$/,
  // ];
  const origins = true;

  return {
    app: {
      env,
      port: parse('PORT', NUMBER),
      jwt_secret: parse('JWT_SECRET', STRING),
      cors: {
        origin: origins,
      },
    },
    database: {
      port: parse('DB_PORT', NUMBER),
      host: parse('DB_HOST', STRING),
      username: parse('DB_USER', STRING),
      password: parse('DB_PASS', STRING),
      database: parse('DB_NAME', STRING),
      synchronize: false,
    },
    auth:{
      google:{
        clientID: parse('GOOGLE_CLIENT_ID',STRING),
        clientSecret: parse('GOOGLE_CLIENT_SECRET',STRING)
      }
    },
    mailer: {
      transport: {
        host: parse('MAIL_HOST', STRING),
        port: parse('MAIL_PORT', NUMBER),
        auth: {
          user: parse('MAIL_USER', STRING),
          pass: parse('MAIL_PASS', STRING),
        },
      },
      defaults: {
        from: parse('MAIL_FROM', STRING),
      },
    }
  };
};

/**
 * Export loaded and parsed configs as a static object
 */
export const config = loadConfig();

/**
 * Fetch a nested config. Raises error if the path
 * is invalid.
 */
export const fetchConfig = (...keys): any =>
  keys.reduce((map, key) => {
    const val = map[key];

    if (val === undefined) {
      throw new InvalidConfigError(`Config not found: ${key} for [${keys}]`);
    }

    return val;
  }, config);
