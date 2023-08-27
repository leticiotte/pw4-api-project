import express from 'express';
import { router } from './application/routes';

const server = express();
server.use(express.json());
server.use(router);


export { server };