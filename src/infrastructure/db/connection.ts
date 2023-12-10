import "dotenv/config";
import { Sequelize } from "sequelize";

const database_schema = process.env.DATABASE_SCHEMA as string;
const database_username = process.env.DATABASE_USERNAME as string;
const database_password = process.env.DATABASE_PASSWORD as string;

const sequelize = new Sequelize(
    database_schema,
    database_username,
    database_password,
    {
        host: "localhost",
        port: 3306,
        dialect: "mysql",
        logging: true,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

export { sequelize };
