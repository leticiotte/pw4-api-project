import * as addSubjects from "./AddSubject";
import * as create from "./Create";
import * as exclude from "./Exclude";
import * as excludeSubject from "./ExcludeSubject";
import * as findAll from "./FindAll";
import * as findById from "./FindById";
import * as findSubjects from "./FindSubjects";
import * as update from "./Update";

export const StudentsController = {
    ...create,
    ...findAll,
    ...findById,
    ...findSubjects,
    ...addSubjects,
    ...excludeSubject,
    ...update,
    ...exclude,
};
