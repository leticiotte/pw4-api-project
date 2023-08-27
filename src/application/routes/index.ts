import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', (_, res) => {
    return res.status(StatusCodes.OK).send('Hello world!!!');
});

export { router };