import prisma from "../services/prisma";
import * as Req from "../types/request";
import * as Res from "../types/response/contrResp";
import {
  TypedBodyHandler,
  TypedParamsHandler,
  TypedFullHandler,
  TypedQueryHandler,
  ApiResponder,
} from "../types/ExpressHandler";
import { User } from "../types/db";

/**
 * Get all participants with filtering and pagination
 */
const getAllParticipants: TypedQueryHandler<
  Req.Participants.GetAll["query"],
  Res.Participants.GetAll
> = async (req, res, next) => {
  // Default values for pagination
  const page = Number(req.query?.page || 1);
  const limit = Number(req.query?.limit || 10);
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};

  if (req.query?.eventId) {
    where.eventId = Number(req.query.eventId);
  }

  if (req.query?.categoryId) {
    where.categoryId = Number(req.query.categoryId);
  }

  if (req.query?.status) {
    where.status = req.query.status;
  }

  if (req.query?.paymentStatus) {
    where.paymentStatus = req.query.paymentStatus;
  }

  if (req.query?.search) {
    where.OR = [
      {
        user: {
          email: { contains: req.query.search, mode: "insensitive" },
        },
      },
      {
        user: {
          profile: {
            OR: [
              {
                firstName: { contains: req.query.search, mode: "insensitive" },
              },
              { lastName: { contains: req.query.search, mode: "insensitive" } },
              {
                displayName: {
                  contains: req.query.search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      },
      { bibNumber: { contains: req.query.search } },
    ];
  }

  // Get participants with pagination
  const participants = await prisma.participant.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
      event: true,
      category: true,
    },
    orderBy: { registrationDate: "desc" },
    skip,
    take: limit,
  });

  // Get total count for pagination
  const total = await prisma.participant.count({ where });

  // Calculate total pages
  const pages = Math.ceil(total / limit);

  return ApiResponder.success<Res.Participants.GetAll>(res, {
    participants,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  });
};

/**
 * Get participant by ID
 */
const getParticipant: TypedParamsHandler<
  Req.Participants.Get["params"],
  Res.Participants.Get
> = async (req, res, next) => {
  const { id } = req.params;
  const participantId = parseInt(id);

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
      event: true,
      category: true,
      result: true,
    },
  });

  if (!participant) {
    return ApiResponder.error(res, 404, "Participant not found");
  }

  return ApiResponder.success<Res.Participants.Get>(res, { participant });
};

/**
 * Create a participant (admin function)
 */
const createParticipant: TypedBodyHandler<
  Req.Participants.Create["body"],
  Res.Participants.Create
> = async (req, res, next) => {
  const { eventId, categoryId, userId, amountPaid, ...participantData } =
    req.body;

  // Verify event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return ApiResponder.error(res, 404, "Event not found");
  }

  // Verify category exists and belongs to event
  const category = await prisma.eventCategory.findFirst({
    where: {
      id: categoryId,
      eventId,
    },
  });

  if (!category) {
    return ApiResponder.error(
      res,
      404,
      "Category not found or doesn't belong to this event"
    );
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return ApiResponder.error(res, 404, "User not found");
  }

  // Check for existing registration
  const existingRegistration = await prisma.participant.findFirst({
    where: {
      userId,
      eventId,
      categoryId,
    },
  });

  if (existingRegistration) {
    return ApiResponder.error(
      res,
      409,
      "User is already registered for this event category"
    );
  }

  // Create participant
  const participant = await prisma.participant.create({
    data: {
      userId,
      eventId,
      categoryId,
      amountPaid: amountPaid ?? 0,
      ...participantData,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
      event: true,
      category: true,
    },
  });

  return ApiResponder.success<Res.Participants.Create>(
    res,
    {
      participant,
      message: "Participant registered successfully",
    },
    201
  );
};

/**
 * Update a participant (admin function)
 */
const updateParticipant: TypedFullHandler<
  Req.Participants.Update["params"],
  Req.Participants.Update["body"],
  Res.Participants.Update
> = async (req, res, next) => {
  const { id } = req.params;
  const participantId = parseInt(id);
  const updateData = req.body;

  // Check if participant exists
  const existingParticipant = await prisma.participant.findUnique({
    where: { id: participantId },
  });

  if (!existingParticipant) {
    return ApiResponder.error(res, 404, "Participant not found");
  }

  // Handle date conversion
  if (updateData.paymentDate && typeof updateData.paymentDate === "string") {
    updateData.paymentDate = new Date(updateData.paymentDate);
  }

  // Update participant
  const participant = await prisma.participant.update({
    where: { id: participantId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
      event: true,
      category: true,
    },
  });

  return ApiResponder.success<Res.Participants.Update>(res, {
    participant,
    message: "Participant updated successfully",
  });
};

/**
 * Delete a participant
 */
const deleteParticipant: TypedParamsHandler<
  Req.Participants.Delete["params"],
  Res.Participants.Delete
> = async (req, res, next) => {
  const { id } = req.params;
  const participantId = parseInt(id);

  // Check if participant exists
  const existingParticipant = await prisma.participant.findUnique({
    where: { id: participantId },
  });

  if (!existingParticipant) {
    return ApiResponder.error(res, 404, "Participant not found");
  }

  // Delete participant
  await prisma.participant.delete({
    where: { id: participantId },
  });

  return ApiResponder.success<Res.Participants.Delete>(res, {
    message: "Participant deleted successfully",
  });
};

/**
 * Register current user for an event
 */
const registerForEvent: TypedFullHandler<
  Req.Participants.Register["params"],
  Req.Participants.Register["body"],
  Res.Participants.Register
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;
  const { id: eventId } = req.params;
  const { categoryId, shirtSize, estimatedFinishTime, notes } = req.body;

  // Verify event exists and registration is open
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
  });

  if (!event) {
    return ApiResponder.error(res, 404, "Event not found");
  }

  const now = new Date();

  if (now < event.registrationStartDate) {
    return ApiResponder.error(res, 400, "Registration is not open yet");
  }

  if (now > event.registrationEndDate) {
    return ApiResponder.error(res, 400, "Registration has closed");
  }

  // Verify category exists and belongs to event
  const category = await prisma.eventCategory.findFirst({
    where: {
      id: categoryId,
      eventId: parseInt(eventId),
    },
  });

  if (!category) {
    return ApiResponder.error(
      res,
      404,
      "Category not found or doesn't belong to this event"
    );
  }

  // Check for existing registration
  const existingRegistration = await prisma.participant.findFirst({
    where: {
      userId,
      eventId: parseInt(eventId),
      categoryId,
    },
  });

  if (existingRegistration) {
    return ApiResponder.error(
      res,
      409,
      "You are already registered for this category"
    );
  }

  // Create participant registration
  const participant = await prisma.participant.create({
    data: {
      userId,
      eventId: parseInt(eventId),
      categoryId,
      shirtSize,
      estimatedFinishTime,
      notes,
      // Default values
      status: "pending",
      paymentStatus: "unpaid",
      amountPaid: event.basePrice ?? 0,
    },
    include: {
      event: true,
      category: true,
    },
  });

  return ApiResponder.success<Res.Participants.Register>(
    res,
    {
      participant,
      message: "Registration submitted successfully",
    },
    201
  );
};

/**
 * Get current user's registrations
 */
const getMyRegistrations: TypedQueryHandler<
  Req.Participants.GetMyRegistrations["query"],
  Res.Participants.GetMyRegistrations
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;

  // Default values for pagination
  const page = Number(req.query?.page || 1);
  const limit = Number(req.query?.limit || 10);
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { userId };

  if (req.query?.status) {
    where.status = req.query.status;
  }

  if (req.query?.eventId) {
    where.eventId = parseInt(req.query.eventId as string);
  }

  // Get registrations with pagination
  const registration = await prisma.participant.findMany({
    where,
    include: {
      event: true,
      category: true,
      result: true,
    },
    orderBy: { registrationDate: "desc" },
    skip,
    take: limit,
  });

  // Get total count for pagination
  const total = await prisma.participant.count({ where });

  // Calculate total pages
  const pages = Math.ceil(total / limit);

  return ApiResponder.success<Res.Participants.GetMyRegistrations>(res, {
    registration,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  });
};

/**
 * Update user's own registration
 */
const updateMyRegistration: TypedFullHandler<
  Req.Participants.UpdateRegistration["params"],
  Req.Participants.UpdateRegistration["body"],
  Res.Participants.UpdateRegistration
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;
  const { id } = req.params;
  const participantId = parseInt(id);
  const updateData = req.body;

  // Check if registration exists and belongs to user
  const existingRegistration = await prisma.participant.findFirst({
    where: {
      id: participantId,
      userId,
    },
    include: { event: true },
  });

  if (!existingRegistration) {
    return ApiResponder.error(res, 404, "Registration not found");
  }

  // Check if registration can be updated
  const now = new Date();
  if (now > existingRegistration.event.registrationEndDate) {
    return ApiResponder.error(res, 400, "Registration period has ended");
  }

  if (existingRegistration.status === "cancelled") {
    return ApiResponder.error(
      res,
      400,
      "Cannot update a cancelled registration"
    );
  }

  // Update registration (limited fields for the user)
  const registration = await prisma.participant.update({
    where: { id: participantId },
    data: {
      shirtSize: updateData.shirtSize,
      estimatedFinishTime: updateData.estimatedFinishTime,
      notes: updateData.notes,
    },
    include: {
      event: true,
      category: true,
    },
  });

  return ApiResponder.success<Res.Participants.UpdateRegistration>(res, {
    registration,
    message: "Registration updated successfully",
  });
};

/**
 * Cancel user's own registration
 */
const cancelMyRegistration: TypedParamsHandler<
  Req.Participants.CancelRegistration["params"],
  Res.Participants.CancelRegistration
> = async (req, res, _next) => {
  const user = req.user as User;
  const userId = user.id;
  const { eventId, categoryId } = req.params;
  const participantId = parseInt(eventId);

  // Check if registration exists and belongs to user
  const existingRegistration = await prisma.participant.findFirst({
    where: {
      id: participantId,
      userId,
    },
    include: { event: true },
  });

  if (!existingRegistration) {
    return ApiResponder.error(res, 404, "Registration not found");
  }

  // Check if registration can be cancelled
  if (existingRegistration.status === "cancelled") {
    return ApiResponder.error(res, 400, "Registration is already cancelled");
  }

  const now = new Date();
  if (now > existingRegistration.event.eventDate) {
    return ApiResponder.error(
      res,
      400,
      "Cannot cancel registration after event date"
    );
  }

  // Cancel registration
  const registration = await prisma.participant.update({
    where: { id: participantId },
    data: {
      status: "cancelled",
    },
    include: {
      event: true,
      category: true,
    },
  });

  return ApiResponder.success<Res.Participants.CancelRegistration>(res, {
    registration,
    message: "Registration cancelled successfully",
  });
};

const participantController = {
  getAllParticipants,
  getParticipant,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  registerForEvent,
  getMyRegistrations,
  updateMyRegistration,
  cancelMyRegistration,
};

export default participantController;
