import { Request, Response } from "express";

export class HealthController {
  public static check(_req: Request, res: Response): void {
    const memoryUsage = process.memoryUsage();
    res.status(200).json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "DevPulse Core REST API",
      version: "1.0.0",
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      },
    });
  }
}
