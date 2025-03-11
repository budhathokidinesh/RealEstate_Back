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
  } else res.send(201).json({ message: "User already registered" });
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
      res.send("Your booking is successfull. See you soon.");
    }
  } catch (error) {
    throw new Error(error.message);
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
    res.status(200).send(booking);
  } catch (error) {
    throw new Error(error.message);
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
      res.send("Booking cancelled successfully.");
    }
  } catch (error) {
    throw new Error(error.message);
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
      res.send({ message: "Removed from the favourites", user: udateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email: email },
        data: {
          favResidenciesID: {
            push: rId,
          },
        },
      });
      res.send({ message: "Updated favourites", user: updateUser });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
//function to get all favourite
export const allFav = async (req, res) => {
  const { email } = req.body;
  try {
    const favRes = await prisma.user.findUnique({
      where: { email: email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favRes);
  } catch (error) {
    throw new Error(error.message);
  }
};
