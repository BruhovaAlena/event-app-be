import express from 'express';
import type { Request, Response } from 'express';
import * as UserService from './user.service';
import { body } from 'express-validator';
import { validateRequestSchema } from '../../middleware/validate-request-schema';
import { authMiddleware } from '../../middleware/authMiddleware';
import { getAuthorizationToken } from '../../utils/getAuthorizationToken';
import { firebaseAdmin } from '../../utils/firebase-admin';
import { RegisterUser } from './user.service';

const userRouter = express.Router();

userRouter.post(
  '/register',
  body('name').isString(),
  body('surname').isString(),
  body('address').isString(),
  body('email').isString(),
  body('password').isString().isLength({ min: 5 }),
  body('isOrganizer').isBoolean(),
  validateRequestSchema,
  async (req: Request, res: Response) => {
    try {
      const { email, password, isOrganizer, name, surname, address } =
        req.body as RegisterUser;

      const authToken = getAuthorizationToken(req.headers?.authorization ?? '');
      if (authToken) {
        const firebaseResponse = await firebaseAdmin
          .auth()
          .verifyIdToken(authToken);

        if (firebaseResponse.email === email) {
          const user = await UserService.registerUser({
            email,
            password,
            isOrganizer,
            name,
            surname,
            address,
            firebaseId: firebaseResponse.uid,
          });
          if (user) {
            return res.status(201).json(user);
          }
          return res.status(401).json('user could not be created');
        }
      }
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

userRouter.post(
  '/login',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.userId;
      const user = await UserService.getUserByUserId({
        userId,
      });

      if (user) {
        return res.status(201).json(user);
      }
      return res.status(404).json('User could not be found');
    } catch (error: any) {
      console.log('error', error);
      return res.status(500).json(error.message);
    }
  }
);

export default userRouter;
