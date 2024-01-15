import { PrismaClient } from "@prisma/client";
import moment from "moment";

function hasUndefinedValue<T>(obj: T): boolean {
  if (typeof obj !== "object" || obj === null) return false;
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    if (value === undefined) return true;
    if (typeof value === "object" && !Array.isArray(value))
      if (hasUndefinedValue(value)) return true;
  }
  return false;
}

const useDeletedMiddleware = async (
  prisma: PrismaClient,
  modelName: string
) => {
  prisma.$use(async (params, next) => {
    // Check incoming query type
    if (params.model == modelName) {
      if (params.action == "findMany" || params.action === "count") {
        // Find queries
        // Add condition for not deleted
        if (params.args && params.args["where"]) {
          params.args["where"] = {
            ...(params.args?.["where"] ?? {}),
            deletedAt: {
              isSet: false,
            },
          };
        }
      } else if (params.action == "delete" || params.action == "deleteMany") {
        // Delete queries
        // Change action to an update
        params.action = "updateMany";
        const deletedAtValue = moment().toDate();
        if (params.args.data != undefined) {
          params.args.data["deletedAt"] = deletedAtValue;
        } else {
          params.args["data"] = { deletedAt: deletedAtValue };
        }
      }
    }

    return next(params);
  });
};

const usePreventUndefinedFilter = async (prisma: PrismaClient) => {
  prisma.$use(async (params, next) => {
    if (hasUndefinedValue(params.args?.where)) {
      for (const filterArg in params.args?.where) {
        if (params.args?.where[filterArg] === undefined) {
          params.args.where[filterArg] = null;
        }
      }
    }

    return await next(params);
  });
};

const getPrismaClient = () => {
  const prisma = new PrismaClient();
  // model nào mà soft deleted thì thêm vào đây
  useDeletedMiddleware(prisma, "User");
  usePreventUndefinedFilter(prisma);
  return prisma;
};

export const prisma = getPrismaClient();
