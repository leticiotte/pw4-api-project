import { Subject } from '../../../domain/models/Subject';
import { SubjectDb } from '../tables/SubjectDb';

export function subjectDbArrayIntoSubjectArray(results: SubjectDb[]): Subject[] {
    return results.map(s => {
        return {
            id: s.id,
            name: s.name,
            description: s.description
        };
    });
}

export function subjectDbIntoSubject(result: SubjectDb): Subject {
    return {
        id: result.id,
        name: result.name,
        description: result.description
    };
}