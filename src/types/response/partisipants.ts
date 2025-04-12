import { ApiResponse } from './wrapper';
/**
 * Participant data structure
 */
export interface ParticipantData {
  id: number;
  userId: number;
  eventId: number;
  categoryId: number;
  
  // Registration details
  registrationDate: Date;
  status: string;
  bibNumber: string | null;
  
  // Payment information
  paymentStatus: string;
  amountPaid: number;
  transactionId: string | null;
  paymentDate: Date | null;
  
  // Other fields
  shirtSize: string | null;
  estimatedFinishTime: string | null;
  notes: string | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Related data
  user?: {
    id: number;
    email: string;
    profile?: {
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  };
  event?: {
    id: number;
    name: string;
    eventDate: Date;
    eventType: string;
  };
  category?: {
    id: number;
    name: string;
    distance: number;
    gender: string | null;
  };
  result?: {
    id: number;
    finishTime: string;
    timeInSeconds: number;
    status: string;
  } | null;
}


/**
 * Registration data structure (for user's own registrations)
 */
export interface RegistrationData {
  id: number;
  eventId: number;
  categoryId: number;
  registrationDate: Date;
  status: string;
  bibNumber: string | null;
  paymentStatus: string;
  amountPaid: number;
  shirtSize: string | null;
  estimatedFinishTime: string | null;
  notes: string | null;
  
  // Included relations
  event?: {
    id: number;
    name: string;
    eventDate: Date;
    // Other event fields...
  };
  category?: {
    id: number;
    name: string;
    distance: number;
    // Other category fields...
  };
  result?: {
    id: number;
    finishTime: string;
    timeInSeconds: number;
    verificationMethod: string;
  } | null;
}

/**
 * Pagination structure
 */
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Get all participants response
 */
export interface GetAllParticipantsResponseData {
  participants: ParticipantData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Get single participant response
 */
export interface GetParticipantResponseData {
  participant: ParticipantData;
}

/**
 * Create participant response
 */
export interface CreateParticipantResponseData {
  participant: ParticipantData;
  message: string;
}

/**
 * Update participant response
 */
export interface UpdateParticipantResponseData {
  participant: ParticipantData;
  message: string;
}

/**
 * Cancel participant response
 */
export interface CancelParticipantResponseData {
  message: string;
}

/**
 * Register for event response
 */
export interface RegisterResponseData {
  participant: ParticipantData;
  message: string;
}
// export interface RegisterResponseData {
//   registration: ParticipantData;
//   message: string;
//   paymentInfo?: {
//     url: string;
//     amount: number;
//     currency: string;
//   };
// }

/**
 * Update registration response
 */
export interface UpdateRegistrationResponseData {
  registration: ParticipantData;
  message: string;
}

/**
 * Cancel registration response
 */
export interface CancelRegistrationResponseData {
  registration: RegistrationData;
  message: string;
}

/**
 * Get my registrations response
 */
export interface GetMyRegistrationsResponseData {
  registration: RegistrationData[];
  pagination: PaginationData;
}
/**
 * Delete participant response
 */
export interface DeleteParticipantResponseData {
  message: string;
}
export namespace APIParticipants {
    export type GetAll = ApiResponse<GetAllParticipantsResponseData>;
    export type Get = ApiResponse<GetParticipantResponseData>;
    export type Create = ApiResponse<CreateParticipantResponseData>;
    export type Update = ApiResponse<UpdateParticipantResponseData>;
    export type Cancel = ApiResponse<CancelParticipantResponseData>;
    export type Register = ApiResponse<RegisterResponseData>;
    export type UpdateRegistration = ApiResponse<UpdateRegistrationResponseData>;
    export type CancelRegistration = ApiResponse<CancelRegistrationResponseData>;
    export type GetMyRegistrations = ApiResponse<GetMyRegistrationsResponseData>;
    export type Delete = ApiResponse<DeleteParticipantResponseData>;
  }
  
  export namespace CntrParticipants {
    export type GetAll = GetAllParticipantsResponseData;
    export type Get = GetParticipantResponseData;
    export type Create = CreateParticipantResponseData;
    export type Update = UpdateParticipantResponseData;
    export type Cancel = CancelParticipantResponseData;
    export type Register = RegisterResponseData;
    export type UpdateRegistration = UpdateRegistrationResponseData;
    export type CancelRegistration = CancelRegistrationResponseData;
    export type GetMyRegistrations = GetMyRegistrationsResponseData;
    export type Delete = DeleteParticipantResponseData;
  }
