import express from 'express';
import { router } from './application/routes';
import { classesRouter } from './application/routes/classesRoutes';
import { studentsRouter } from './application/routes/studentsRoutes';
import errorHandler from './shared/middlewares/error/ErrorHandler';

const server = express();
server.use(express.json());
server.use(router);
server.use(studentsRouter);
server.use(classesRouter);
server.use(errorHandler);

export { server };