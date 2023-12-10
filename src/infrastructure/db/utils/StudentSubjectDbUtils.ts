import { StudentSubject } from "../../../domain/models/StudentSubject";
import { StudentSubjectDb } from "../tables/StudentSubjectDb";

export function studentSubjectDbArrayIntoStudentSubjectArray(
    results: StudentSubjectDb[]
): StudentSubject[] {
    return results.map((r) => {
        return {
            studentId: r.studentId,
            subjectId: r.subjectId,
        };
    });
}
