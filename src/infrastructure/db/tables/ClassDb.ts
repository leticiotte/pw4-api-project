import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

class ClassDb extends Model {
    declare id: number;
    key!: string;
    name!: string;
    course!: string;
}

ClassDb.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "class",
        freezeTableName: true,
        timestamps: false,
    }
);

export { ClassDb };
