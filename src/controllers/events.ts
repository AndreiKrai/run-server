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

/**
 * Get all events with pagination and filtering
 */
const getAllEvents: TypedQueryHandler<
  Req.Events.GetAll["query"],
  Res.Events.GetAll
> = async (req, res, _next) => {
  // Default values
  const page = Number(req.query?.page || 1);
  const limit = Number(req.query?.limit || 10);
  const skip = (page - 1) * limit;
  
  // Build where clause for filtering
  const where: any = {};
  
  if (req.query?.search) {
    where.OR = [
      { name: { contains: req.query.search, mode: 'insensitive' } },
      { description: { contains: req.query.search, mode: 'insensitive' } },
    ];
  }
  
  if (req.query?.eventType) {
    where.eventType = req.query.eventType;
  }
  
  if (req.query?.status) {
    where.status = req.query.status;
  }
  
  if (req.query?.country) {
    where.country = { contains: req.query.country, mode: 'insensitive' };
  }
  
  if (req.query?.city) {
    where.city = { contains: req.query.city, mode: 'insensitive' };
  }
  
  if (req.query?.startDate) {
    where.eventDate = { 
      ...(where.eventDate || {}),
      gte: new Date(req.query.startDate)
    };
  }
  
  if (req.query?.endDate) {
    where.eventDate = {
      ...(where.eventDate || {}),
      lte: new Date(req.query.endDate)
    };
  }
  
  // Get events with pagination
  const events = await prisma.event.findMany({
    where,
    orderBy: [
      { eventDate: 'asc' },
      { name: 'asc' }
    ],
    skip,
    take: limit,
  });
  
  // Get total count for pagination
  const total = await prisma.event.count({ where });
  
  // Calculate total pages
  const pages = Math.ceil(total / limit);
  
  return ApiResponder.success<Res.Events.GetAll>(res, {
    events,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  });
};

/**
 * Get a specific event by ID
 */
const getEvent: TypedParamsHandler<
  Req.Events.Get["params"],
  Res.Events.Get
> = async (req, res, next) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  
  if (!event) {
    return ApiResponder.error(res, 404, "Event not found");
  }
  
  return ApiResponder.success<Res.Events.Get>(res, { event });
};

/**
 * Create a new event
 */
const createEvent: TypedBodyHandler<
  Req.Events.Create["body"],
  Res.Events.Create
> = async (req, res, next) => {
  const eventData = req.body;
  
  // Convert string dates to Date objects if needed
  if (typeof eventData.eventDate === 'string') {
    eventData.eventDate = new Date(eventData.eventDate);
  }
  
  if (typeof eventData.registrationStartDate === 'string') {
    eventData.registrationStartDate = new Date(eventData.registrationStartDate);
  }
  
  if (typeof eventData.registrationEndDate === 'string') {
    eventData.registrationEndDate = new Date(eventData.registrationEndDate);
  }
  
  if (eventData.resultsEntryDeadline && typeof eventData.resultsEntryDeadline === 'string') {
    eventData.resultsEntryDeadline = new Date(eventData.resultsEntryDeadline);
  }
  
  // Create the event
  const event = await prisma.event.create({
    data: eventData
  });
  
  return ApiResponder.success<Res.Events.Create>(
    res,
    {
      event,
      message: "Event created successfully"
    },
    201
  );
};

/**
 * Update an existing event
 */
const updateEvent: TypedFullHandler<
  Req.Events.Update["params"],
  Req.Events.Update["body"],
  Res.Events.Update
> = async (req, res, next) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  const eventData = req.body;
  
  // Check if event exists
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId }
  });
  
  if (!existingEvent) {
    return ApiResponder.error(res, 404, "Event not found");
  }
  
  // Convert string dates to Date objects if needed
  if (eventData.eventDate && typeof eventData.eventDate === 'string') {
    eventData.eventDate = new Date(eventData.eventDate);
  }
  
  if (eventData.registrationStartDate && typeof eventData.registrationStartDate === 'string') {
    eventData.registrationStartDate = new Date(eventData.registrationStartDate);
  }
  
  if (eventData.registrationEndDate && typeof eventData.registrationEndDate === 'string') {
    eventData.registrationEndDate = new Date(eventData.registrationEndDate);
  }
  
  if (eventData.resultsEntryDeadline && typeof eventData.resultsEntryDeadline === 'string') {
    eventData.resultsEntryDeadline = new Date(eventData.resultsEntryDeadline);
  }
  
  // Update the event
  const event = await prisma.event.update({
    where: { id: eventId },
    data: eventData
  });
  
  return ApiResponder.success<Res.Events.Update>(res, {
    event,
    message: "Event updated successfully"
  });
};

/**
 * Delete an event
 */
const deleteEvent: TypedParamsHandler<
  Req.Events.Delete["params"],
  Res.Events.Delete
> = async (req, res, next) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  
  // Check if event exists
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId }
  });
  
  if (!existingEvent) {
    return ApiResponder.error(res, 404, "Event not found");
  }
  
  // Delete the event
  await prisma.event.delete({
    where: { id: eventId }
  });
  
  return ApiResponder.success<Res.Events.Delete>(res, {
    message: "Event deleted successfully"
  });
};

/**
 * Get all categories for a specific event
 */
const getCategoriesByEvent: TypedParamsHandler<
  Req.Events.GetCategories["params"],
  Res.Events.GetCategories
> = async (req, res, next) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  
  // Check if event exists
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId }
  });
  
  if (!existingEvent) {
    return ApiResponder.error(res, 404, "Event not found");
  }
  
  // Get categories
  const categories = await prisma.eventCategory.findMany({
    where: { eventId }
  });
  
  return ApiResponder.success<Res.Events.GetCategories>(res, {
    categories
  });
};

/**
 * Create a new category for an event
 */
const createCategory: TypedFullHandler<
  Req.Events.CreateCategory["params"],
  Req.Events.CreateCategory["body"],
  Res.Events.CreateCategory
> = async (req, res, next) => {
  const { id } = req.params;
  const eventId = parseInt(id);
  const categoryData = req.body;
  

  console.log("Creating category for event:", eventId);
  console.log("Category data:", categoryData);
  
  // Check if event exists
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId }
  });
  
  if (!existingEvent) {
    return ApiResponder.error(res, 404, "Event not found");
  }
  
  // Create the category
  const category = await prisma.eventCategory.create({
    data: {
      ...categoryData,
      eventId
    }
  });
  
  console.log("Created category:", category);
    
  return ApiResponder.success<Res.Events.CreateCategory>(
    res,
    {
      category,
      message: "Category created successfully"
    },
    201
  );
};

/**
 * Update an existing category
 */
const updateCategory: TypedFullHandler<
  Req.Events.UpdateCategory["params"],
  Req.Events.UpdateCategory["body"],
  Res.Events.UpdateCategory
> = async (req, res, next) => {
  const { id } = req.params;
  const categoryId = parseInt(id);
  const categoryData = req.body;
  
  // Check if category exists
  const existingCategory = await prisma.eventCategory.findUnique({
    where: { id: categoryId }
  });
  
  if (!existingCategory) {
    return ApiResponder.error(res, 404, "Category not found");
  }
  
  // Update the category
  const category = await prisma.eventCategory.update({
    where: { id: categoryId },
    data: categoryData
  });
  
  return ApiResponder.success<Res.Events.UpdateCategory>(res, {
    category,
    message: "Category updated successfully"
  });
};

/**
 * Delete a category
 */
const deleteCategory: TypedParamsHandler<
  Req.Events.DeleteCategory["params"],
  Res.Events.DeleteCategory
> = async (req, res, next) => {
  const { id } = req.params;
  const categoryId = parseInt(id);
  
  // Check if category exists
  const existingCategory = await prisma.eventCategory.findUnique({
    where: { id: categoryId }
  });
  
  if (!existingCategory) {
    return ApiResponder.error(res, 404, "Category not found");
  }
  
  // Delete the category
  await prisma.eventCategory.delete({
    where: { id: categoryId }
  });
  
  return ApiResponder.success<Res.Events.DeleteCategory>(res, {
    message: "Category deleted successfully"
  });
};

const eventController = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategoriesByEvent,
  createCategory,
  updateCategory,
  deleteCategory
};

export default eventController;