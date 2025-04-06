import { z } from "zod";

// Schema for event ID parameter validation
const eventId = z.object({
  id: z.coerce
    .number()
    .int({
      message: "Event ID must be an integer",
    })
    .positive({
      message: "Event ID must be a positive number",
    }),
});

// Schema for category ID parameter validation
const categoryId = z.object({
  id: z.coerce
    .number()
    .int({
      message: "Category ID must be an integer",
    })
    .positive({
      message: "Category ID must be a positive number",
    }),
});

// Schema for creating a new event
const baseEventSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Event name is required",
    })
    .max(100, {
      message: "Event name cannot exceed 100 characters",
    }),
  description: z
    .string()
    .max(2000, {
      message: "Description cannot exceed 2000 characters",
    })
    .optional(),
  eventType: z
    .string()
    .min(1, {
      message: "Event type is required",
    })
    .max(50, {
      message: "Event type cannot exceed 50 characters",
    }),
  status: z
    .enum(["upcoming", "active", "completed", "cancelled"])
    .default("upcoming"),

  // Date information
  eventDate: z.coerce.date({
    errorMap: () => ({ message: "Event date must be a valid date" }),
  }),
  registrationStartDate: z.coerce.date({
    errorMap: () => ({
      message: "Registration start date must be a valid date",
    }),
  }),
  registrationEndDate: z.coerce.date({
    errorMap: () => ({ message: "Registration end date must be a valid date" }),
  }),
  resultsEntryDeadline: z.coerce
    .date({
      errorMap: () => ({
        message: "Results entry deadline must be a valid date",
      }),
    })
    .optional()
    .nullable(),

  // Location information
  location: z
    .string()
    .max(100, {
      message: "Location cannot exceed 100 characters",
    })
    .optional()
    .nullable(),
  address: z
    .string()
    .max(255, {
      message: "Address cannot exceed 255 characters",
    })
    .optional()
    .nullable(),
  city: z
    .string()
    .max(100, {
      message: "City cannot exceed 100 characters",
    })
    .optional()
    .nullable(),
  state: z
    .string()
    .max(100, {
      message: "State cannot exceed 100 characters",
    })
    .optional()
    .nullable(),
  country: z
    .string()
    .max(100, {
      message: "Country cannot exceed 100 characters",
    })
    .optional()
    .nullable(),
  postalCode: z
    .string()
    .max(20, {
      message: "Postal code cannot exceed 20 characters",
    })
    .optional()
    .nullable(),

  // Event details
  featuredImage: z
    .string()
    .url({
      message: "Featured image must be a valid URL",
    })
    .max(500, {
      message: "Featured image URL cannot exceed 500 characters",
    })
    .optional()
    .nullable(),
  bannerImage: z
    .string()
    .url({
      message: "Banner image must be a valid URL",
    })
    .max(500, {
      message: "Banner image URL cannot exceed 500 characters",
    })
    .optional()
    .nullable(),

  // Payment information
  basePrice: z.number().nonnegative({
    message: "Base price cannot be negative",
  }),
  currency: z
    .string()
    .max(3, {
      message: "Currency code cannot exceed 3 characters",
    })
    .default("USD"),
});

// Create partial version BEFORE applying refinements
const updateEvent = baseEventSchema.partial();

// Then apply refinements to the original for the full version
const createEvent = baseEventSchema
  .refine((data) => data.registrationStartDate < data.registrationEndDate, {
    message: "Registration start date must be before registration end date",
    path: ["registrationStartDate"],
  })
  .refine((data) => data.registrationEndDate <= data.eventDate, {
    message: "Registration end date must be on or before event date",
    path: ["registrationEndDate"],
  });

// Schema for creating a new category

const baseCategorySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Category name is required",
    })
    .max(100, {
      message: "Category name cannot exceed 100 characters",
    }),
  description: z
    .string()
    .max(500, {
      message: "Description cannot exceed 500 characters",
    })
    .optional()
    .nullable(),
  distance: z.number().positive({
    message: "Distance must be a positive number",
  }),
  gender: z.enum(["male", "female", "any"]).optional().nullable(),
  minAge: z
    .number()
    .int({
      message: "Minimum age must be an integer",
    })
    .nonnegative({
      message: "Minimum age cannot be negative",
    })
    .optional()
    .nullable(),
  maxAge: z
    .number()
    .int({
      message: "Maximum age must be an integer",
    })
    .positive({
      message: "Maximum age must be positive",
    })
    .optional()
    .nullable(),
});

// Create partial version BEFORE refinements
const updateCategory = baseCategorySchema.partial();

// Apply refinements for the full version
const createCategory = baseCategorySchema.refine(
  (data) => !data.minAge || !data.maxAge || data.minAge <= data.maxAge,
  {
    message: "Minimum age must be less than or equal to maximum age",
    path: ["minAge"],
  }
);

// Schema for filtering events
const eventFilters = z.object({
  search: z.string().optional(),
  eventType: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(["upcoming", "active", "completed", "cancelled"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Type exports
export type EventIdParam = z.infer<typeof eventId>;
export type CategoryIdParam = z.infer<typeof categoryId>;
export type CreateEventBody = z.infer<typeof createEvent>;
export type UpdateEventBody = z.infer<typeof updateEvent>;
export type CreateCategoryBody = z.infer<typeof createCategory>;
export type UpdateCategoryBody = z.infer<typeof updateCategory>;
export type EventFiltersQuery = z.infer<typeof eventFilters>;

const eventSchema = {
  eventId,
  categoryId,
  createEvent,
  updateEvent,
  createCategory,
  updateCategory,
  eventFilters,
};

export default eventSchema;
