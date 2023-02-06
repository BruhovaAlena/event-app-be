import express, { Express, Request, Response } from 'express';
import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequestSchema } from '../middleware/validate-request-schema';
import { PrismaClient, Event } from '@prisma/client';

const prisma = new PrismaClient();

const rootRouter = Router();

// rootRouter.post(
//   '/register',
//   body('name').isString(),
//   body('surname').isString(),
//   body('address').isString(),
//   body('email').isString(),
//   body('password').isString().isLength({ min: 5 }),
//   body('isOrganizer').isBoolean(),
//   validateRequestSchema,
//   async (req: Request, res: Response) => {
//     const { email, password, isOrganizer, name, surname, address } = req.body;

//     const authToken = getAuthorizationToken(req.headers?.authorization ?? '');
//     if (authToken) {
//       const firebaseResponse = await firebaseAdmin
//         .auth()
//         .verifyIdToken(authToken);

//       if (firebaseResponse.email === email) {
//         const user = await prisma.user.create({
//           data: {
//             email,
//             password,
//             isOrganizer,
//             name,
//             surname,
//             address,
//             firebaseId: firebaseResponse.uid,
//           },
//         });
//         res.json(user).status(201);
//       }

//       res.status(401);
//     }
//   }
// );

// rootRouter.post(
//   '/login',
//   // body('email').isString(),
//   // body('password').isString().isLength({ min: 5 }),

//   // validateRequestSchema,
//   async (req: Request, res: Response) => {
//     console.log('req.body', req);
//     const { firebaseId } = req.body as LoginBody;
//     const user = await prisma.user.findFirst({
//       where: { firebaseId },
//     });
//     res.status(201).json(user);
//   }
// );

rootRouter.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
  res.sendStatus(201);
});

rootRouter.get(
  '/user/:id',
  body('id').isString(),
  validateRequestSchema,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.json(user);
    res.sendStatus(201);
  }
);

rootRouter.put(
  '/user',
  body('username').isString(),
  validateRequestSchema,
  async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    res.json(updatedUser);
    res.sendStatus(201);
  }
);

rootRouter.delete('/user/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedUser = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  res.json(deletedUser);
  res.sendStatus(201);
});

// type CreateEventBody = {
//   title: string;
//   description: string;
//   date: string;
//   userId: string;
//   place: string;
// };
// rootRouter.post(
//   '/events',
//   body('title').isString(),
//   body('description').isString(),
//   body('date').isString(),
//   body('userId').isString(),
//   body('place').isString(),
//   validateRequestSchema,
//   async (req: Request, res: Response) => {
//     const { title, description, date, userId, place } =
//       req.body as CreateEventBody;

//     const event = await prisma.event.create({
//       data: {
//         title,
//         description,
//         date: new Date(date).toISOString(),
//         userId,
//         place,
//       },
//     });

//     res.status(201).json(event);
//   }
// );

// rootRouter.get('/events', async (req: Request, res: Response) => {
//   console.log('ajdnfjs');
//   const events = await prisma.event.findMany();
//   res.status(200).json(events);
// });

// rootRouter.get('/events', async (req: Request, res: Response) => {
//   const events = await prisma.event.findMany({
//     take: 3,
//   });
//   res.json(events);
// });

// rootRouter.put(
//   '/events',
//   body('title').isString(),
//   body('description').isString(),
//   body('place').isString(),
//   body('date').isString(),
//   body('maxCapacity').isNumeric(),
//   validateRequestSchema,
//   async (req: Request, res: Response) => {
//     const { id, title, description, place, date, maxCapacity } = req.body;
//     const updatedEvent = await prisma.event.update({
//       where: {
//         id: id,
//       },
//       data: {
//         title,
//         description,
//         place,
//         date,
//         maxCapacity,
//       },
//     });
//     res.json(updatedEvent);
//     res.sendStatus(201);
//   }
// );

// rootRouter.delete('/events/:id', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const deletedEvent = await prisma.event.delete({
//     where: {
//       id: id,
//     },
//   });

//   res.json(deletedEvent);
//   res.sendStatus(201);
// });

export { rootRouter as router };
