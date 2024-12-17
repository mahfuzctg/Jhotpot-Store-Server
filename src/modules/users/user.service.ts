import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import prisma from '../../utils/prisma';
import config from '../../config';
import bcrypt from 'bcryptjs';
import { Prisma, UserRole, UserStatus } from '@prisma/client';
import { createToken } from '../../utils/verifyJWT';
import { IAuthUser } from './user.interface';
import {
  calculatePagination,
  IPaginationOptions,
} from '../../utils/calculatePagination';

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
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
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
          'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/83221961/original/425127947f0688643bcefba40b83c767b13e2a6a/illustrate-your-cartoon-avatar.jpg',
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
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
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
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
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
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
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
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
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
          'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/83221961/original/425127947f0688643bcefba40b83c767b13e2a6a/illustrate-your-cartoon-avatar.jpg',
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
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
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
      include: {
        products: {
          include: {
            category: true,
          },
        },
        orders: true,
        followers: {
          include: {
            customer: true,
          },
        },
      },
    });
  } else if (userInfo.role === UserRole.CUSTOMER) {
    profileInfo = await prisma.customer.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        customerCoupons: true,
        orders: true,
        reviews: true,
        follows: {
          include: {
            vendor: true,
          },
        },
        recentProductView: true,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const getVendorUser = async (id: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      products: true,
      followers: true,
      orders: true,
    },
  });

  return vendor;
};

const getCustomerUser = async (email: string) => {
  const vendor = await prisma.customer.findUniqueOrThrow({
    where: {
      email,
      isDeleted: false,
    },
    include: {
      follows: true,
      orders: true,
      reviews: true,
      recentProductView: true,
    },
  });

  return vendor;
};

const followVendor = async (payload: { vendorId: string }, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const follow = await prisma.follow.create({
    data: {
      customerId: customer.id,
      vendorId: vendor.id,
    },
    include: {
      customer: true,
      vendor: true,
    },
  });

  return follow;
};

const unfollowVendor = async (
  payload: { vendorId: string },
  user: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const unfollow = await prisma.follow.delete({
    where: {
      customerId_vendorId: {
        customerId: customer.id,
        vendorId: vendor.id,
      },
    },
  });

  return unfollow;
};

const updateCustomer = async (
  payload: {
    name?: string;
    profilePhoto?: string;
    address?: string;
    phone?: string;
  },
  userData: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const result = await prisma.customer.update({
    where: {
      email: customer.email,
    },
    data: payload,
    include: {
      follows: true,
      orders: true,
      reviews: true,
      recentProductView: true,
    },
  });

  return result;
};

const updateVendor = async (
  payload: {
    name?: string;
    shopName?: string;
    logo?: string;
    description?: string;
  },
  userData: IAuthUser,
) => {
  const vendor = await prisma.vendor.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const result = await prisma.vendor.update({
    where: {
      email: vendor.email,
    },
    data: payload,
    include: {
      orders: true,
      products: true,
      followers: true,
    },
  });

  return result;
};

const getAllUsers = async (
  filters: { role?: UserRole },
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { role } = filters;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (role) {
    andConditions.push({
      role: {
        equals: role,
      },
    });
  }

  // andConditions.push({
  //   status: 'ACTIVE',
  // });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    include: {
      admin: true,
      vendor: true,
      customer: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: users,
  };
};

const blockUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user doesn't exist!");
  }

  const { role } = user;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email },
      data: { status: 'BLOCKED' },
    });

    if (role === 'VENDOR') {
      await tx.vendor.updateMany({
        where: { email },
        data: { isDeleted: true },
      });
    } else if (role === 'CUSTOMER') {
      await tx.customer.updateMany({
        where: { email },
        data: { isDeleted: true },
      });
    } else {
      throw new Error('Invalid role for blocking');
    }
  });

  return { message: `User with email ${email} has been blocked` };
};

const unblockUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user doesn't exist!");
  }

  const { role } = user;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    if (role === 'VENDOR') {
      await tx.vendor.updateMany({
        where: { email },
        data: { isDeleted: false },
      });
    } else if (role === 'CUSTOMER') {
      await tx.customer.updateMany({
        where: { email },
        data: { isDeleted: false },
      });
    } else {
      throw new Error('Invalid role for blocking');
    }
  });

  return { message: `User with email ${email} has been unblocked` };
};

export const userService = {
  createAdmin,
  createVendor,
  createCustomer,
  getMyProfile,
  getVendorUser,
  getCustomerUser,
  followVendor,
  unfollowVendor,
  updateCustomer,
  updateVendor,
  getAllUsers,
  blockUser,
  unblockUser,
};