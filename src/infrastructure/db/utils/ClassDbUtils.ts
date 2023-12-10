import { Class } from "../../../domain/models/Class";
import { ClassDb } from "../tables/ClassDb";

export function classDbArrayIntoClassArray(results: ClassDb[]): Class[] {
    return results.map((c) => {
        return {
            id: c.id,
            key: c.key,
            name: c.name,
            course: c.course,
        };
    });
}

export function classDbIntoClass(result: ClassDb): Class {
    return {
        id: result.id,
        key: result.key,
        name: result.name,
        course: result.course,
    };
}
