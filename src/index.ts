import { server } from './server/Server';
require('dotenv/config');

server.listen(process.env.PORT, () => {
    console.log('App startado!');
});