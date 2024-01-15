import { Router } from "express";
import { getAddressLevelByParent, getProvinces } from "../controllers/address";

export const addressLevelRouter = Router();

addressLevelRouter.get("/province", getProvinces);
addressLevelRouter.get("/address-level", getAddressLevelByParent);
