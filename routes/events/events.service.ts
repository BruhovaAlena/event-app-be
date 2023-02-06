import { db } from '../../utils/db.server';

export type CreateEventBody = {
  title: string;
  description: string;
  date: string;
  userId: string;
  place: string;
  maxCapacity: number;
};

export const createEvent = async ({
  date,
  description,
  place,
  title,
  userId,
  maxCapacity,
}: CreateEventBody) => {
  return db.event.create({
    data: {
      title,
      description,
      date: new Date(date).toISOString(),
      place,
      userId,
      maxCapacity,
    },
  });
};

export const getAllEvents = async () => {
  return db.event.findMany({
    include: {
      eventAttendances: true,
    },
  });
};

export const getEventWithAttendances = async (id: string) => {
  return db.event.findUnique({
    where: {
      id,
    },
    include: {
      eventAttendances: true,
    },
  });
};

export const loginToEvent = async ({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) => {
  return db.eventAttendance.create({
    data: {
      userId,
      eventId,
    },
  });
};

export const getAttendingEventIdsByUserId = async (userId: string) => {
  const eventAttenances = await db.eventAttendance.findMany({
    where: {
      userId,
    },
  });
  return eventAttenances.map(({ eventId }) => eventId);
};

export const getAttendingEventsByUserId = async (userId: string) => {
  const eventAttendances = await db.eventAttendance.findMany({
    where: {
      userId,
    },
  });
  return eventAttendances;
};

export const logoutFromEvent = async ({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) => {
  await db.eventAttendance.delete({
    where: {
      userId_eventId: {
        eventId,
        userId,
      },
    },
  });
};

export type EditEventBody = {
  title: string;
  description: string;
  date: string;
  place: string;
  maxCapacity: number;
  eventId: string;
};

export const editEvent = async ({
  date,
  description,
  eventId,
  maxCapacity,
  place,
  title,
}: EditEventBody) => {
  console.log({
    date,
    description,
    eventId,
    maxCapacity,
    place,
    title,
  });
  const updatedEvent = await db.event.update({
    where: {
      id: eventId,
    },
    data: {
      title,
      date: new Date(date).toISOString(),
      description,
      maxCapacity,
      place,
    },
    select: {
      id: true,
      description: true,
      place: true,
      date: true,
      maxCapacity: true,
      title: true,
    },
  });
  return updatedEvent;
};

export const deleteEvent = async ({ eventId }: { eventId: string }) => {
  await db.event.delete({
    where: {
      id: eventId,
    },
  });
};
