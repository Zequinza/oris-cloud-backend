import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const method = req.method;
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? "❌" : "✅";

    console.log(`${statusColor} ${method} ${path} - ${statusCode} (${duration}ms)`);
  });

  next();
};
