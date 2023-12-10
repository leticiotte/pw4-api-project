import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

class SubjectDb extends Model {
    declare id: number;
    name!: string;
    description!: string;
}

SubjectDb.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "subject",
        freezeTableName: true,
        timestamps: false,
    }
);

export { SubjectDb };
