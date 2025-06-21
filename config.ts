// Define the structure of the MySQL configuration
import { MysqlConfig } from './interface' 

// Define the structure of the AppConfig
interface AppConfig {
  port: string | undefined;  // `undefined` allows for missing environment variables
  jwtSecret: string;
  mysql: MysqlConfig;
}

// Load the configuration from environment variables
const loadConfig = (): AppConfig => {
  const mysqlConfig: MysqlConfig = {
    host: process.env.DB_HOST ?? '',  // Default empty string if undefined
    user: process.env.DB_USER ?? '',  // Default empty string if undefined
    password: process.env.DB_PASSWORD ?? '',  // Default empty string if undefined
    database: process.env.DB_NAME ?? '',  // Default empty string if undefined
    port: process.env.DB_PORT ?? '',  // Default empty string if undefined
  };

  return {
    port: process.env.PORT,
    jwtSecret: 'testlio-home-task',  // Hardcoded secret (you may want to load this from an env variable)
    mysql: mysqlConfig
  };
};

const config = loadConfig();

export default config;
