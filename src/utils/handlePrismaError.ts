export const handlePrismaError = (
  res: any,
  operation: string,
  error: unknown,
) => {
  console.error(`Error ${operation} transaction:`, error);
  return res.status(500).json({
    error: `Failed to ${operation} transaction. Please try again later.`,
  });
};
