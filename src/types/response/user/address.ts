import { ApiResponse } from "../wrapper";

/**
 * Address data structure
 */
 interface AddressData {
  id: number;
  type?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isPrimary: boolean;
  label?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get address response data
 */
 interface AddressResponseData {
  address: AddressData;
}

/**
 * Get all addresses response data
 */
 interface AddressesResponseData {
  addresses: AddressData[];
  total: number;
}

/**
 * Create address response data
 */
 interface CreateAddressResponseData {
  address: AddressData;
  message: string;
}

/**
 * Update address response data
 */
 interface UpdateAddressResponseData {
  address: AddressData;
  message: string;
}

/**
 * Delete address response data
 */
 interface DeleteAddressResponseData {
  message: string;
}

/**
 * Set primary address response data
 */
 interface SetPrimaryAddressResponseData {
  address: AddressData;
  message: string;
}

// ===================API Response Data Types (client get that)===================

export namespace APIAddress {
  export type Get = ApiResponse<AddressResponseData>;
  export type GetAll = ApiResponse<AddressesResponseData>;
  export type Create = ApiResponse<CreateAddressResponseData>;
  export type Update = ApiResponse<UpdateAddressResponseData>;
  export type Delete = ApiResponse<DeleteAddressResponseData>;
  export type SetPrimary = ApiResponse<SetPrimaryAddressResponseData>;
}

// ===================Controller Response Data Types ===================

export namespace CntrAddress {
  export type Get = AddressResponseData;
  export type GetAll = AddressesResponseData;
  export type Create = CreateAddressResponseData;
  export type Update = UpdateAddressResponseData;
  export type Delete = DeleteAddressResponseData;
  export type SetPrimary = SetPrimaryAddressResponseData;
}
