import { EventFiltersQuery } from "../../schemas/events";

  export interface GetAll {
    query?: EventFiltersQuery;
  }

  // Get a single event
  export interface Get {
    params: {
      id: string;
    };
  }

  // Create a new event
  export interface Create {
    body: {
      name: string;
      description?: string;
      eventType: string;
      status?: "upcoming" | "active" | "completed" | "cancelled";
      eventDate: Date | string;
      registrationStartDate: Date | string;
      registrationEndDate: Date | string;
      resultsEntryDeadline?: Date | string | null;
      location?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      postalCode?: string | null;
      featuredImage?: string | null;
      bannerImage?: string | null;
      basePrice: number;
      currency?: string;
    };
  }

  // Update an event
  export interface Update {
    params: {
      id: string;
    };
    body: Partial<Create["body"]>;
  }

  // Delete an event
  export interface Delete {
    params: {
      id: string;
    };
  }

  // Create a category for an event
  export interface CreateCategory {
    params: {
      id: string;
    };
    body: {
      name: string;
      description?: string | null;
      distance: number;
      gender?: "male" | "female" | "any" | null;
      minAge?: number | null;
      maxAge?: number | null;
    };
  }

  // Get all categories for an event
  export interface GetCategories {
    params: {
      id: string;
    };
  }

  // Update a category
  export interface UpdateCategory {
    params: {
      id: string;
    };
    body: Partial<CreateCategory["body"]>;
  }

  // Delete a category
  export interface DeleteCategory {
    params: {
      id: string;
    };
  }
