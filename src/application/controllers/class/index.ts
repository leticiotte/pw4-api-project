import * as create from './Create';
import * as findAll from './FindAll';
import * as findById from './FindById';
import * as update from './Update';
import * as exclude from './Exclude';


export const ClassController = {
    ...create,
    ...findAll,
    ...findById,
    ...update,
    ...exclude
};