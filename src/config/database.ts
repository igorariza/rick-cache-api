import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const database = process.env.DB_NAME || 'rick_and_morty';
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || 'localhost';
const dialect = (process.env.DB_DIALECT || 'mysql') as Dialect;

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.==');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize, connectDatabase };