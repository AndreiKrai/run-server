import { Router } from "express";
import address from "../../controllers/user/address";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import validateBody from "../../middlewares/validateBody";
import validateParams from "../../middlewares/validateParams";
import addressSchema from "../../schemas/user/address";

const router = Router();

// Get all addresses for authenticated user
router.get("/", ctrlWrapper(address.getAllAddresses));

// Get specific address
router.get(
  "/:id",
  validateParams(addressSchema.addressId),
  ctrlWrapper(address.getAddress)
);

// Create new address
router.post(
  "/",
  validateBody(addressSchema.createAddress),
  ctrlWrapper(address.createAddress)
);

// Update existing address
router.put(
  "/:id",
  validateParams(addressSchema.addressId),
  validateBody(addressSchema.updateAddress),
  ctrlWrapper(address.updateAddress)
);

// Delete address
router.delete(
  "/:id",
  validateParams(addressSchema.addressId),
  ctrlWrapper(address.deleteAddress)
);

// Set address as primary
router.patch(
  "/:id/primary",
  validateParams(addressSchema.addressId),
  ctrlWrapper(address.setPrimaryAddress)
);

export default router;
