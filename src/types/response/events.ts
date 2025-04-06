import { ApiResponse } from "./wrapper";
/**
 * Event data structure
 */
export interface EventData {
  id: number;
  name: string;
  description: string | null;
  eventType: string;
  status: string;
  
  // Date information
  eventDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  resultsEntryDeadline: Date | null;
  
  // Location information
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  
  // Event details
  featuredImage: string | null;
  bannerImage: string | null;
  
  // Payment information
  basePrice: number;
  currency: string;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category data structure
 */
export interface CategoryData {
  id: number;
  name: string;
  description: string | null;
  distance: number;
  gender: string | null;
  minAge: number | null;
  maxAge: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all events response
 */
export interface GetAllEventsResponseData {
  events: EventData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Get single event response
 */
export interface GetEventResponseData {
  event: EventData;
}

/**
 * Create event response
 */
export interface CreateEventResponseData {
  event: EventData;
  message: string;
}

/**
 * Update event response
 */
export interface UpdateEventResponseData {
  event: EventData;
  message: string;
}

/**
 * Delete event response
 */
export interface DeleteEventResponseData {
  message: string;
}

/**
 * Get event categories response
 */
export interface GetCategoriesResponseData {
  categories: CategoryData[];
}

/**
 * Create category response
 */
export interface CreateCategoryResponseData {
  category: CategoryData;
  message: string;
}

/**
 * Update category response
 */
export interface UpdateCategoryResponseData {
  category: CategoryData;
  message: string;
}

/**
 * Delete category response
 */
export interface DeleteCategoryResponseData {
  message: string;
}

export namespace APIEvents {
    export type GetAll = ApiResponse<GetAllEventsResponseData>;
    export type Get = ApiResponse<GetEventResponseData>;
    export type Create = ApiResponse<CreateEventResponseData>;
    export type Update = ApiResponse<UpdateEventResponseData>;
    export type Delete = ApiResponse<DeleteEventResponseData>;
    export type GetCategories = ApiResponse<GetCategoriesResponseData>;
    export type CreateCategory = ApiResponse<CreateCategoryResponseData>;
    export type UpdateCategory = ApiResponse<UpdateCategoryResponseData>;
    export type DeleteCategory = ApiResponse<DeleteCategoryResponseData>;
  }
  
  export namespace CntrEvents {
    export type GetAll = GetAllEventsResponseData;
    export type Get = GetEventResponseData;
    export type Create = CreateEventResponseData;
    export type Update = UpdateEventResponseData;
    export type Delete = DeleteEventResponseData;
    export type GetCategories = GetCategoriesResponseData;
    export type CreateCategory = CreateCategoryResponseData;
    export type UpdateCategory = UpdateCategoryResponseData;
    export type DeleteCategory = DeleteCategoryResponseData;
  }