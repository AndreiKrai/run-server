import { z } from "zod";

// Schema for address ID parameter validation
const addressId = z.object({
  id: z.coerce
    .number()
    .int({
      message: "Address ID must be an integer",
    })
    .positive({
      message: "Address ID must be a positive number",
    }),
});

// Schema for creating a new address
const createAddress = z
  .object({
    type: z
      .string()
      .max(50, {
        message: "Type cannot exceed 50 characters",
      })
      .optional(),
    street: z
      .string()
      .max(255, {
        message: "Street address cannot exceed 255 characters",
      })
      .optional(),
    city: z
      .string()
      .max(100, {
        message: "City cannot exceed 100 characters",
      })
      .optional(),
    state: z
      .string()
      .max(100, {
        message: "State/Province cannot exceed 100 characters",
      })
      .optional(),
    postalCode: z
      .string()
      .max(20, {
        message: "Postal code cannot exceed 20 characters",
      })
      .optional(),
    country: z
      .string()
      .max(100, {
        message: "Country cannot exceed 100 characters",
      })
      .optional(),
    isPrimary: z.boolean().default(false).optional(),
    label: z
      .string()
      .max(100, {
        message: "Label cannot exceed 100 characters",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Ensure at least one field is provided
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided",
      path: ["_all"], // This indicates the error applies to the whole object
    }
  );

// Schema for updating an address
const updateAddress = z
  .object({
    type: z
      .string()
      .max(50, {
        message: "Type cannot exceed 50 characters",
      })
      .optional(),
    street: z
      .string()
      .max(255, {
        message: "Street address cannot exceed 255 characters",
      })
      .optional(),
    city: z
      .string()
      .max(100, {
        message: "City cannot exceed 100 characters",
      })
      .optional(),
    state: z
      .string()
      .max(100, {
        message: "State/Province cannot exceed 100 characters",
      })
      .optional(),
    postalCode: z
      .string()
      .max(20, {
        message: "Postal code cannot exceed 20 characters",
      })
      .optional(),
    country: z
      .string()
      .max(100, {
        message: "Country cannot exceed 100 characters",
      })
      .optional(),
    isPrimary: z.boolean().optional(),
    label: z
      .string()
      .max(100, {
        message: "Label cannot exceed 100 characters",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Ensure at least one field is provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
      path: ["_all"],
    }
  );

// Type inference from Zod schemas
export type AddressIdParams = z.infer<typeof addressId>;
export type CreateAddressBody = z.infer<typeof createAddress>;
export type UpdateAddressBody = z.infer<typeof updateAddress>;

const addressSchema = {
  addressId,
  createAddress,
  updateAddress,
};

export default addressSchema;
