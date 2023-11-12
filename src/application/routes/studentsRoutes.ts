import { Router } from 'express';
import { StudentsController } from '../controllers';

const studentsRouter = Router();

studentsRouter.post('/students', StudentsController.create);
studentsRouter.get('/students', StudentsController.findAll);
studentsRouter.get('/students/:id', StudentsController.findById);
studentsRouter.put('/students/:id', StudentsController.update);
studentsRouter.delete('/students/:id', StudentsController.exclude);

studentsRouter.get('/students/:id/subjects', StudentsController.findSubjects);
studentsRouter.post('/students/:id/subjects', StudentsController.addSubject);
studentsRouter.delete('/students/:id/subjects/:subjectId', StudentsController.excludeSubject);


export { studentsRouter };
