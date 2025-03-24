export namespace Profile {
  /**
   * Get profile
   */
  export interface Get {}

  /**
   * Update profile request body
   */
  export interface Update {
    body: {
      name?: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
      gender?: string;
      birthdate?: Date | string | null;
      location?: string;
      website?: string;
      bio?: string;
      picture?: string;
      coverPhoto?: string;
      phoneNumber?: string;
      language?: string;
      timezone?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  }

  /**
   * Update profile picture
   */
  export interface UpdatePicture {
    body: {
      picture: string;
    };
  }
  
  /**
   * Update cover photo
   */
  export interface UpdateCoverPhoto {
    body: {
      coverPhoto: string;
    };
  }
}