import express from 'express';
import { router } from './application/routes';
import { studentsRouter } from './application/routes/studentsRoutes';
import errorHandler from './shared/middlewares/error/ErrorHandler';

const server = express();
server.use(express.json());
server.use(router);
server.use(studentsRouter);
server.use(errorHandler);

export { server };