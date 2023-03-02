import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRouter from './routes/events/events.router';
import userRouter from './routes/user/user.router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use('/user', userRouter);

app.use('/events', eventRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
