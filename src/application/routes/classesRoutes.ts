import { Router } from 'express';
import { ClassController } from '../controllers';

const classesRouter = Router();

classesRouter.post('/classes', ClassController.create);
classesRouter.get('/classes', ClassController.findAll);
classesRouter.get('/classes/:id', ClassController.findById);
classesRouter.get('/classes/:id/students', ClassController.findStudents);
classesRouter.put('/classes/:id', ClassController.update);
classesRouter.delete('/classes/:id', ClassController.exclude);


export { classesRouter };
