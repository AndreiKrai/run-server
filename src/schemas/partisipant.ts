import { z } from "zod";

// Schema for participant ID parameter validation
const participantId = z.object({
  id: z.coerce
    .number()
    .int({
      message: "Participant ID must be an integer",
    })
    .positive({
      message: "Participant ID must be a positive number",
    }),
});

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

// Schema for creating a new participant
const createParticipant = z.object({
  eventId: z.number().int().positive({
    message: "Event ID must be a positive integer",
  }),
  categoryId: z.number().int().positive({
    message: "Category ID must be a positive integer",
  }),
  
  // Optional fields
  status: z
    .enum(["pending", "confirmed", "cancelled"])
    .optional()
    .default("pending"),
  paymentStatus: z
    .enum(["unpaid", "paid", "refunded"])
    .optional()
    .default("unpaid"),
  amountPaid: z
    .number()
    .nonnegative({
      message: "Amount paid cannot be negative",
    })
    .optional(),
  bibNumber: z
    .string()
    .max(20, {
      message: "Bib number cannot exceed 20 characters",
    })
    .optional()
    .nullable(),
  shirtSize: z
    .enum(["XS", "S", "M", "L", "XL", "XXL"])
    .optional()
    .nullable(),
  estimatedFinishTime: z
    .string()
    .regex(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/, {
      message: "Estimated finish time must be in format HH:MM:SS",
    })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, {
      message: "Notes cannot exceed 500 characters",
    })
    .optional()
    .nullable(),
});

// Schema for user registering for an event
const register = z.object({
  categoryId: z.number().int().positive({
    message: "Category ID must be a positive integer",
  }),
  shirtSize: z
    .enum(["XS", "S", "M", "L", "XL", "XXL"])
    .optional()
    .nullable(),
  estimatedFinishTime: z
    .string()
    .regex(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/, {
      message: "Estimated finish time must be in format HH:MM:SS",
    })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, {
      message: "Notes cannot exceed 500 characters",
    })
    .optional()
    .nullable(),
});

// Schema for updating a participant registration
const updateParticipant = z.object({
  status: z
    .enum(["pending", "confirmed", "cancelled"])
    .optional(),
  paymentStatus: z
    .enum(["unpaid", "paid", "refunded"])
    .optional(),
  amountPaid: z
    .number()
    .nonnegative({
      message: "Amount paid cannot be negative",
    })
    .optional(),
  transactionId: z
    .string()
    .max(100, {
      message: "Transaction ID cannot exceed 100 characters",
    })
    .optional()
    .nullable(),
  paymentDate: z
    .date()
    .optional()
    .nullable(),
  bibNumber: z
    .string()
    .max(20, {
      message: "Bib number cannot exceed 20 characters",
    })
    .optional()
    .nullable(),
  shirtSize: z
    .enum(["XS", "S", "M", "L", "XL", "XXL"])
    .optional()
    .nullable(),
  estimatedFinishTime: z
    .string()
    .regex(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/, {
      message: "Estimated finish time must be in format HH:MM:SS",
    })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, {
      message: "Notes cannot exceed 500 characters",
    })
    .optional()
    .nullable(),
});

// Schema for user updating their registration
const updateRegistration = updateParticipant.omit({
  status: true,
  paymentStatus: true,
  amountPaid: true,
  transactionId: true,
  paymentDate: true,
  bibNumber: true,
});

// Schema for filtering participants
const participantFilters = z.object({
  eventId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
}).optional();

// Type exports
export type ParticipantIdParam = z.infer<typeof participantId>;
export type EventIdParam = z.infer<typeof eventId>;
export type CategoryIdParam = z.infer<typeof categoryId>;
export type CreateParticipantBody = z.infer<typeof createParticipant>;
export type RegisterBody = z.infer<typeof register>;
export type UpdateParticipantBody = z.infer<typeof updateParticipant>;
export type UpdateRegistrationBody = z.infer<typeof updateRegistration>;
export type ParticipantFiltersQuery = z.infer<typeof participantFilters>;

const participantSchema = {
  participantId,
  eventId,
  categoryId,
  createParticipant,
  register,
  updateParticipant,
  updateRegistration,
  participantFilters
};

export default participantSchema;