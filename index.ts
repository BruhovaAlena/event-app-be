import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router } from './routes';
import eventRouter from './routes/events/events.router';
import userRouter from './routes/user/user.router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use(router);

app.use('/user', userRouter);

app.use('/events', eventRouter);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
