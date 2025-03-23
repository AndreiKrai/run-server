import { User } from '../../db';
export namespace Address {
  /**
   * Get all addresses for a user
   */
  export interface GetAll {
    query?: {
      limit?: number;
      offset?: number;
    };
  }

  /**
   * Get a single address
   */
  export interface Get {
    params: {
      id: string;
    };
  }

  /**
   * Create a new address
   */
  export interface Create {
    body: {
      type?: string;      // "home", "work", "gym", etc.
      street?: string;    // Street address line
      city?: string;
      state?: string;     // State/Province/Region
      postalCode?: string;
      country?: string;
      isPrimary?: boolean;
      label?: string;     // Custom label
    };
    user: User;
  }

  /**
   * Update an existing address
   */
  export interface Update {
    params: {
      id: string;
    };
    body: {
      type?: string;
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      isPrimary?: boolean;
      label?: string;
    };
  }

  /**
   * Delete an address
   */
  export interface Delete {
    params: {
      id: string;
    };
  }

  /**
   * Set an address as primary
   */
  export interface SetPrimary {
    params: {
      id: string;
    };
    
  }
}