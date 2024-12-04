import { UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { createToken } from "../../utils/verifyJWT";
import { IAuthUser } from "./user.interface";

const createAdmin = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is already exist!");
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      include: {
        admin: true,
      },
    });

    await tx.admin.create({
      data: {
        name: payload.name,
        email: user.email,
        profilePhoto:
          "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/83221961/original/425127947f0688643bcefba40b83c767b13e2a6a/illustrate-your-cartoon-avatar.jpg",
      },
    });

    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id as string,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  const combinedResult = { accessToken, refreshToken, newUser };

  return combinedResult;
};

const createVendor = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is already exist!");
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      },
      include: {
        vendor: true,
      },
    });

    await tx.vendor.create({
      data: {
        name: payload.name,
        email: user.email,
      },
      include: {
        user: true,
      },
    });

    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id as string,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  const combinedResult = { accessToken, refreshToken, newUser };

  return combinedResult;
};

const createCustomer = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is already exist!");
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
      include: {
        customer: true,
      },
    });

    await tx.customer.create({
      data: {
        name: payload.name,
        email: user.email,
        profilePhoto:
          "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/83221961/original/425127947f0688643bcefba40b83c767b13e2a6a/illustrate-your-cartoon-avatar.jpg",
      },
    });

    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id as string,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  const combinedResult = { accessToken, refreshToken, newUser };

  return combinedResult;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.VENDOR) {
    profileInfo = await prisma.vendor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.CUSTOMER) {
    profileInfo = await prisma.customer.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

export const userService = {
  createAdmin,
  createVendor,
  createCustomer,
  getMyProfile,
};
