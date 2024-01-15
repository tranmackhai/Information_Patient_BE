import { Router } from "express";
import {
  getDistrictsByProvince,
  getWardsByDistrict,
  getProvinces,
} from "../controllers/address";

export const addressLevelRouter = Router();

addressLevelRouter.get("/province", getProvinces);
addressLevelRouter.get("/district-by-province", getDistrictsByProvince);
addressLevelRouter.get("/ward-by-district", getWardsByDistrict);
