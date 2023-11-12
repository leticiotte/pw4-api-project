import { DataTypes, Model } from 'sequelize';
import { GenderEnum } from '../../../domain/models/enums/GenderEnum';
import { sequelize } from '../connection';

class StudentDb extends Model {
    declare id: number;
    name!: string;
    studentNumber!: string;
    birthDate!: string;
    gender!: GenderEnum;
    email!: string;
    phone?: string;
    classId!: number;
}

StudentDb.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        studentNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('feminine', 'masculine', 'non_binary', 'others'),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'class',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'student',
        freezeTableName: true,
        timestamps: false
    }
);

export { StudentDb };
