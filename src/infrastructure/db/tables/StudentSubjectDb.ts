import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

class StudentSubjectDb extends Model {
    declare studentId: number;
    declare subjectId: number;
}

StudentSubjectDb.init(
    {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "student",
                key: "id",
            },
        },
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "subject",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "student_subject",
        freezeTableName: true,
        timestamps: false,
    }
);

export { StudentSubjectDb };
