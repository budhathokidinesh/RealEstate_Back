import express from "express";
import {
  allFav,
  bookVisit,
  cancelBoking,
  createUser,
  getAllBookings,
  toFav,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/cancelBooking/:id", cancelBoking);
router.post("/toFav/:rId", toFav);
router.post("/allFav/", allFav);

export { router as userRoute };
