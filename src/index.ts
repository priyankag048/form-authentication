import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';
import { AppRouter } from './AppRouter';
import './controllers/loginController';
import './controllers/rootController'
import {port} from './config';

const app = express();

const router = AppRouter.getInstance();
app.use(cookieSession({ keys: ['khjhhjlj']}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(router);

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})