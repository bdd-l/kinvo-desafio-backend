"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = void 0;
const handlePrismaError = (res, operation, error) => {
    console.error(`Error ${operation} transaction:`, error);
    return res.status(500).json({
        error: `Failed to ${operation} transaction. Please try again later.`,
    });
};
exports.handlePrismaError = handlePrismaError;
