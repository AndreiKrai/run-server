import { ApiResponse } from "../wrapper";
/**
 * Profile data structure
 */
interface ProfileData {
  id: number;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  gender?: string | null;
  birthdate?: Date | null;
  location?: string | null;
  website?: string | null;
  bio?: string | null;
  picture?: string | null;
  coverPhoto?: string | null;
  phoneNumber?: string | null;
  language?: string | null;
  timezone?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get profile response data
 */
interface ProfileResponseData {
  profile: ProfileData;
}

/**
 * Update profile response data
 */
interface UpdateProfileResponseData {
  profile: ProfileData;
  message: string;
}

/**
 * Update profile picture response data
 */
interface UpdateProfilePictureResponseData {
  picture: string;
  message: string;
}

/**
 * Update cover photo response data
 */
interface UpdateCoverPhotoResponseData {
  coverPhoto: string;
  message: string;
}

export namespace APIProfile {
  export type Get = ApiResponse<ProfileResponseData>;
  export type Update = ApiResponse<UpdateProfileResponseData>;
  export type UpdatePicture = ApiResponse<UpdateProfilePictureResponseData>;
  export type UpdateCoverPhoto = ApiResponse<UpdateCoverPhotoResponseData>;
}

export namespace CntrProfile {
  export type Get = ProfileResponseData;
  export type Update = UpdateProfileResponseData;
  export type UpdatePicture = UpdateProfilePictureResponseData;
  export type UpdateCoverPhoto = UpdateCoverPhotoResponseData;
}
