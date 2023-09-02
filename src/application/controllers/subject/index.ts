import * as create from './Create';
import * as exclude from './Exclude';
import * as findAll from './FindAll';
import * as findById from './FindById';
import * as update from './Update';


export const SubjectsController = {
    ...create,
    ...findAll,
    ...findById,
    ...update,
    ...exclude
};