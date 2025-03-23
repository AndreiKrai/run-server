import prisma from "../../services/prisma";
import * as Req from "../../types/request";
import * as Res from "../../types/response/contrResp";
import {
  TypedBodyHandler,
  TypedParamsHandler,
  TypedFullHandler,
  ApiResponder,
} from "../../types/ExpressHandler";
import { User } from "../../types/db";

/**
 * Get all addresses for the authenticated user
 */
const getAllAddresses: TypedBodyHandler<
  Req.User.Address.GetAll["query"],
  Res.User.Address.GetAll
> = async (req, res, next) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const limit = req.query?.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query?.offset ? parseInt(req.query.offset as string) : 0;

    // Get addresses with pagination
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }],
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.address.count({
      where: { userId },
    });

    return ApiResponder.success<Res.User.Address.GetAll>(res, {
      addresses,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific address by ID
 */
const getAddress: TypedParamsHandler<
  Req.User.Address.Get["params"],
  Res.User.Address.Get
> = async (req, res, next) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const { id } = req.params;
    const addressId = parseInt(id);

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      return ApiResponder.error(res, 404, "Address not found");
    }

    return ApiResponder.success<Res.User.Address.Get>(res, {
      address,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new address for the authenticated user
 */
const createAddress: TypedBodyHandler<
  Req.User.Address.Create["body"],
  Res.User.Address.Create
> = async (req, res, next) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const { type, street, city, state, postalCode, country, isPrimary, label } =
      req.body;

    // If this is the primary address, unset any existing primary address
    if (isPrimary) {
      await prisma.address.updateMany({
        where: {
          userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        type,
        street,
        city,
        state,
        postalCode,
        country,
        isPrimary: isPrimary || false,
        label,
      },
    });

    return ApiResponder.success<Res.User.Address.Create>(
      res,
      {
        address,
        message: "Address created successfully",
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing address
 */
const updateAddress: TypedFullHandler<
  Req.User.Address.Update["params"],
  Req.User.Address.Update["body"],
  Res.User.Address.Update
> = async (req, res, next) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const { id } = req.params;
    const addressId = parseInt(id);
    const { type, street, city, state, postalCode, country, isPrimary, label } =
      req.body;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return ApiResponder.error(res, 404, "Address not found");
    }

    // If this is being set as primary address, unset any existing primary address
    if (isPrimary && !existingAddress.isPrimary) {
      await prisma.address.updateMany({
        where: {
          userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Update the address
    const address = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        type,
        street,
        city,
        state,
        postalCode,
        country,
        isPrimary:
          isPrimary !== undefined ? isPrimary : existingAddress.isPrimary,
        label,
      },
    });

    return ApiResponder.success<Res.User.Address.Update>(res, {
      address,
      message: "Address updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an address
 */
const deleteAddress: TypedParamsHandler<
  Req.User.Address.Delete["params"],
  Res.User.Address.Delete
> = async (req, res, next) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const { id } = req.params;
    const addressId = parseInt(id);

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return ApiResponder.error(res, 404, "Address not found");
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return ApiResponder.success<Res.User.Address.Delete>(res, {
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Set an address as primary
 */
const setPrimaryAddress: TypedParamsHandler<
  Req.User.Address.SetPrimary["params"],
  Res.User.Address.SetPrimary
> = async (req, res, next) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const { id } = req.params;
    const addressId = parseInt(id);

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return ApiResponder.error(res, 404, "Address not found");
    }

    // If already primary, just return success
    if (existingAddress.isPrimary) {
      return ApiResponder.success<Res.User.Address.SetPrimary>(res, {
        address: existingAddress,
        message: "Address is already set as primary",
      });
    }

    // Unset any existing primary address
    await prisma.address.updateMany({
      where: {
        userId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set this address as primary
    const address = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isPrimary: true,
      },
    });

    return ApiResponder.success<Res.User.Address.SetPrimary>(res, {
      address,
      message: "Address set as primary successfully",
    });
  } catch (error) {
    next(error);
  }
};

const address = {
  getAllAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
};

export default address;
