import express from 'express';
import type { Request, Response } from 'express';

import * as EventService from './events.service';
import * as UserService from '../user/user.service';

import { body } from 'express-validator';
import { validateRequestSchema } from '../../middleware/validate-request-schema';
import { authMiddleware } from '../../middleware/authMiddleware';
import { CreateEventBody, EditEventBody } from './events.service';
import { Event } from '@prisma/client';

const eventRouter = express.Router();

//POST: Create new event
eventRouter.post(
  '/createEvent',
  authMiddleware,
  body('title').isString(),
  body('description').isString(),
  body('date').isString(),
  body('userId').isString(),
  body('place').isString(),
  body('maxCapacity').isNumeric(),
  validateRequestSchema,
  async (req: Request, res: Response) => {
    try {
      const { title, description, date, userId, place, maxCapacity } =
        req.body as CreateEventBody;
      const newEvent = await EventService.createEvent({
        title,
        description,
        date,
        userId,
        place,
        maxCapacity,
      });
      if (newEvent) {
        return res.status(201).json(newEvent);
      }
      return res.status(404).json('Event could not be created');
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

type GetEventsResult = (Event & {
  numberOfAttendees: number;
})[];

//GET: All events
eventRouter.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const events = await EventService.getAllEvents();
    const result: GetEventsResult = events.map(
      ({
        createdAt,
        date,
        description,
        eventAttendances,
        id,
        maxCapacity,
        place,
        title,
        updatedAt,
        userId,
      }) => ({
        createdAt,
        date,
        description,
        id,
        maxCapacity,
        place,
        title,
        updatedAt,
        userId,
        numberOfAttendees: eventAttendances.length,
      })
    );

    if (events) {
      return res.status(200).json(result);
    }
    return res.status(404).json('Events could not be found');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
//GET: attending events ids
eventRouter.get(
  '/my-events-ids',
  authMiddleware,
  body('userId').isString(),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const attendingEventsByUser =
        await EventService.getAttendingEventIdsByUserId(userId);

      if (attendingEventsByUser) {
        return res.status(200).json(attendingEventsByUser);
      }
      return res.status(404).json('Events could not be found');
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

//GET: my attending events
eventRouter.get(
  '/my-events',
  authMiddleware,
  body('userId').isString(),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const attendingEventsByUser =
        await EventService.getAttendingEventsByUserId(userId);

      if (attendingEventsByUser) {
        return res.status(200).json(attendingEventsByUser);
      }
      return res.status(404).json('Events could not be found');
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: A single event by ID

type GetEventResult = Event & {
  numberOfAttendees: number;
};
eventRouter.get(
  '/:eventId',
  authMiddleware,
  async (request: Request, response: Response) => {
    const id: string = request.params.eventId;

    try {
      const event = await EventService.getEventWithAttendances(id);

      if (event) {
        const {
          createdAt,
          date,
          description,
          eventAttendances,
          id,
          maxCapacity,
          place,
          title,
          updatedAt,
          userId,
        } = event;
        const result: GetEventResult = {
          createdAt,
          date,
          description,
          id,
          maxCapacity,
          place,
          title,
          updatedAt,
          userId,
          numberOfAttendees: eventAttendances.length,
        };
        return response.status(200).json(result);
      }
      return response.status(404).json('Event could not be found');
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
//POST: Login to event
eventRouter.post(
  '/login',
  authMiddleware,
  body('eventId').isString(),
  validateRequestSchema,
  async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      // @ts-ignore
      const userId = req.userId;
      const event = await EventService.getEventWithAttendances(eventId);

      if (event && event.maxCapacity > event.eventAttendances.length) {
        const eventAttendance = await EventService.loginToEvent({
          eventId,
          userId,
        });

        if (eventAttendance) {
          return res.status(200).json(eventAttendance);
        }
        return res.status(404).json('Events could not be found');
      }
      return res.status(403).json('Event capacity is full.');
    } catch (error: any) {
      console.log('error', error);
      return res.status(500).json(error.message);
    }
  }
);
//DELETE: Logout from event
eventRouter.delete(
  '/logout',
  authMiddleware,

  body('eventId').isString(),
  async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      // @ts-ignore
      const userId = req.userId;
      await EventService.logoutFromEvent({ userId, eventId });

      return res.status(204).json('success');
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

//PUT: Edit event
eventRouter.put(
  '/editEvent/:id',
  authMiddleware,
  body('title').isString(),
  body('description').isString(),
  body('date').isString(),
  body('place').isString(),
  body('maxCapacity').isNumeric(),
  validateRequestSchema,
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const event = await EventService.getEventWithAttendances(id);
    // @ts-ignore
    const userId = req.userId;
    const user = await UserService.getUserByUserId({
      userId,
    });

    try {
      if (user?.isOrganizer && user.id === event?.userId) {
        const { date, description, maxCapacity, place, title } =
          req.body as EditEventBody;
        const updatedEvent = await EventService.editEvent({
          date,
          description,
          eventId: id,
          maxCapacity,
          place,
          title,
        });
        if (updatedEvent) {
          return res.status(201).json(updatedEvent);
        }
        return res.status(404).json('Event could not be edited.');
      }
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

//DELETE: Delete event
eventRouter.delete(
  '/deleteEvent',
  authMiddleware,
  body('eventId').isString(),
  async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      // @ts-ignore

      await EventService.deleteEvent({ eventId });

      return res.status(204).json('success');
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

export default eventRouter;
