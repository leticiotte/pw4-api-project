import { server } from './Server';
import 'dotenv/config';

server.listen(process.env.PORT, () => {
    console.log(`App startado na porta ${process.env.PORT}!`);
});