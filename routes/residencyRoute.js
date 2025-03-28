import express from "express";
import {
  createResidency,
  getAllResidencies,
  getResidency,
} from "../controllers/residencyController.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();
router.post("/create", jwtCheck, createResidency);
router.get("/allRes", getAllResidencies);
router.get("/:id", getResidency);

export { router as residencyRoute };
