import { prisma } from "../config/prismaConfig.js";
//Function to create the residency
export const createResidency = async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;
  console.log(req.body.data);
  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });
    res.send({ message: "Residency created successfully", residency });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Residency of this address is already here");
    }
    throw new Error(error.message);
  }
};
//Function to get all residencies
export const getAllResidencies = async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies);
};
//Function to get specific residency by id
export const getResidency = async (req, res) => {
  const { id } = req.params;
  try {
    const residency = await prisma.residency.findUnique({
      where: { id: id },
    });
    res.send(residency);
  } catch (error) {
    throw new Error(error.message);
  }
};
