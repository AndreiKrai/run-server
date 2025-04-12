import { z } from "zod";

// General validation rules for common fields
const nameSchema = z.string().max(100, { 
  message: "Name cannot exceed 100 characters" 
}).optional().nullable();

const urlSchema = z.string().url({ 
  message: "Must be a valid URL" 
}).max(500, { 
  message: "URL cannot exceed 500 characters" 
}).optional().nullable();

const shortTextSchema = z.string().max(100, { 
  message: "Text cannot exceed 100 characters" 
}).optional().nullable();

// Schema for updating profile
const updateProfile = z.object({
  name: nameSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  displayName: nameSchema,
  gender: shortTextSchema,
  birthdate: z.union([
    z.date(), 
    z.string().datetime({ message: "Must be a valid ISO datetime string" }),
    z.null()
  ]).optional().nullable(),
  location: shortTextSchema,
  website: urlSchema,
  bio: z.string().max(500, { 
    message: "Bio cannot exceed 500 characters" 
  }).optional().nullable(),
  picture: urlSchema,
  coverPhoto: urlSchema,
  phoneNumber: z.string().max(20, {
    message: "Phone number cannot exceed 20 characters"
  }).optional().nullable(),
  language: shortTextSchema,
  timezone: shortTextSchema,
  twitter: shortTextSchema,
  instagram: shortTextSchema,
  linkedin: shortTextSchema
}).refine(data => Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined).length > 0, {
  message: "At least one field must be provided",
  path: ["_all"]
});

// Schema for updating profile picture
const updatePicture = z.object({
  picture: z.string().url({
    message: "Picture must be a valid URL"
  }).max(500, {
    message: "Picture URL cannot exceed 500 characters"
  })
});

// Schema for updating cover photo
const updateCoverPhoto = z.object({
  coverPhoto: z.string().url({
    message: "Cover photo must be a valid URL"
  }).max(500, {
    message: "Cover photo URL cannot exceed 500 characters"
  })
});

// Export schemas and their inferred types
export type UpdateProfileBody = z.infer<typeof updateProfile>;
export type UpdatePictureBody = z.infer<typeof updatePicture>;
export type UpdateCoverPhotoBody = z.infer<typeof updateCoverPhoto>;

const profileSchema = {
  updateProfile,
  updatePicture,
  updateCoverPhoto
};

export default profileSchema;