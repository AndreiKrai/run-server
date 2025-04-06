import { Router } from "express";
import eventController from "../controllers/events";
import ctrlWrapper from "../helpers/ctrlWrapper";
import authMiddleware from "../middlewares/authMeddleware";
import { isAdmin } from "../middlewares/roleMiddleware";
import validateBody from "../middlewares/validateBody";
import validateParams from "../middlewares/validateParams";
import { validateQuery } from "../middlewares/validateQuery";
import eventSchema from "../schemas/events";

const router = Router();

// Public routes - anyone can view events
router.get(
  "/",
  validateQuery(eventSchema.eventFilters),
  ctrlWrapper(eventController.getAllEvents)
);

router.get(
  "/:id",
  validateParams(eventSchema.eventId),
  ctrlWrapper(eventController.getEvent)
);

router.get(
  "/:id/categories",
  validateParams(eventSchema.eventId),
  ctrlWrapper(eventController.getCategoriesByEvent)
);

// Protected routes - admin only can create/modify events
router.use(authMiddleware);
router.use(isAdmin);

router.post(
  "/",
  validateBody(eventSchema.createEvent),
  ctrlWrapper(eventController.createEvent)
);

router.put(
  "/:id",
  validateParams(eventSchema.eventId),
  validateBody(eventSchema.updateEvent),
  ctrlWrapper(eventController.updateEvent)
);

router.delete(
  "/:id",
  validateParams(eventSchema.eventId),
  ctrlWrapper(eventController.deleteEvent)
);

// Category management
router.post(
  "/:id/categories",
  validateParams(eventSchema.eventId),
  validateBody(eventSchema.createCategory),
  ctrlWrapper(eventController.createCategory)
);

router.put(
  "/categories/:id",
  validateParams(eventSchema.categoryId),
  validateBody(eventSchema.updateCategory),
  ctrlWrapper(eventController.updateCategory)
);

router.delete(
  "/categories/:id",
  validateParams(eventSchema.categoryId),
  ctrlWrapper(eventController.deleteCategory)
);

export default router;
