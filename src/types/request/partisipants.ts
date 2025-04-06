import { 
  ParticipantFiltersQuery, 
  CreateParticipantBody, 
  UpdateParticipantBody, 
  RegisterBody,
  UpdateRegistrationBody
} from "../../schemas/participant";

export namespace Participant {
  // Get all participants with filtering
  export interface GetAll {
    query?: ParticipantFiltersQuery;
  }

  // Get a single participant
  export interface Get {
    params: {
      id: string;
    };
  }

  // Get participants for an event
  export interface GetByEvent {
    params: {
      id: string;
    };
    query?: Omit<ParticipantFiltersQuery, 'eventId'>;
  }

  // Get participants for a category
  export interface GetByCategory {
    params: {
      id: string;
    };
    query?: Omit<ParticipantFiltersQuery, 'categoryId'>;
  }

  // Create a new participant (admin)
  export interface Create {
    body: CreateParticipantBody & {
      userId: number;
    };
  }

  // Register for an event (user)
  export interface Register {
    params: {
      id: string; // Event ID
    };
    body: RegisterBody;
  }

  // Update a participant (admin)
  export interface Update {
    params: {
      id: string;
    };
    body: UpdateParticipantBody;
  }

  // Update registration (user)
  export interface UpdateRegistration {
    params: {
      id: string; // Participant ID
    };
    body: UpdateRegistrationBody;
  }

  // Cancel registration (admin)
  export interface Cancel {
    params: {
      id: string;
    };
  }

  // Cancel own registration (user)
  export interface CancelRegistration {
    params: {
      eventId: string;
      categoryId: string;
    };
  }
}