import { prisma } from "../config/prismaConfig.js";
//Function for the registering the users
export const createUser = async (req, res) => {
  const { email } = await req.body;
  console.log(email);
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  if (!userExist) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else res.status(201).json({ message: "User already registered" });
};
//Function for the book visit
export const bookVisit = async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({
        message:
          "You have already booked this residency. Would you like to book other residencies. We have many residencies suitable for you. Thanks",
      });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res
        .status(200)
        .json({ message: "Your booking is successfull. See you soon." });
    }
  } catch (error) {
    console.error("Error booking visit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Function to get all bookings of a user
export const getAllBookings = async (req, res) => {
  const { email } = req.body;
  try {
    const booking = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Function to cancel the booking
export const cancelBoking = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.status(200).json({ message: "Booking cancelled successfully." });
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Funtion to add a residencies in favourite list
export const toFav = async (req, res) => {
  const { email } = req.body;
  const { rId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (user.favResidenciesID.includes(rId)) {
      const udateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rId),
          },
        },
      });
      res
        .status(200)
        .json({ message: "Removed from the favourites", user: udateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email: email },
        data: {
          favResidenciesID: {
            push: rId,
          },
        },
      });
      res.status(200).json({ message: "Updated favourites", user: updateUser });
    }
  } catch (error) {
    console.error("Error updating favourites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//THis is to get all the favourites
export const allFav = async (req, res) => {
  const { email } = req.body;
  try {
    const favRes = await prisma.user.findUnique({
      where: { email: email },
      select: { favResidenciesID: true },
    });
    res.status(200).json(favRes);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
