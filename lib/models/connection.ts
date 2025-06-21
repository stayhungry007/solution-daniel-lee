import { Sequelize } from 'sequelize';
import config from '../../config';
import { MysqlConfig } from '../../interface' 

const mysqlConfig: MysqlConfig = {
  host: config.mysql.host,
  port: config.mysql.port,  // Convert string to number
  database: config.mysql.database,
  user: config.mysql.user,
  password: config.mysql.password,
};

// Create a new Sequelize instance
const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.user, mysqlConfig.password, {
  host: mysqlConfig.host,
  port: Number(mysqlConfig.port),  // The port is now a number
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
  },
});

export default sequelize;
