import express from "express";
import {
  allFav,
  bookVisit,
  cancelBoking,
  createUser,
  getAllBookings,
  toFav,
} from "../controllers/userController.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/cancelBooking/:id", cancelBoking);
router.post("/toFav/:rId", toFav);
router.post("/allFav/", allFav);

export { router as userRoute };
