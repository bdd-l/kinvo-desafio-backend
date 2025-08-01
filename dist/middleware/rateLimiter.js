"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
/**
 * Rate limiter middleware for Express applications
 *
 * Tracks requests by IP address and enforces limits to prevent abuse.
 * Uses an in-memory store with automatic cleanup to prevent memory bloat.
 *
 * Time Complexity: O(1) for all middleware operations
 * Space Complexity: O(min(n, maxEntries)) where n is unique IPs making requests
 */
class RateLimiter {
    /**
     * Creates a new rate limiter instance
     *
     * @param maxRequests - Maximum number of requests allowed in the window (default: 10)
     * @param windowMs - Time window in milliseconds (default: 60 seconds)
     * @param blockDurationMs - Duration to block after exceeding limit (default: 1 hour)
     * @param maxEntries - Maximum number of IP entries to store (default: 5000)
     */
    constructor(maxRequests = 10, windowMs = 60000, blockDurationMs = 3600000, maxEntries = 5000) {
        this.store = new Map();
        /**
         * Express middleware function for rate limiting
         */
        this.limit = (req, res, next) => {
            const ip = this.getClientIp(req);
            const now = Date.now();
            // Check if client is currently blocked
            const client = this.store.get(ip);
            if (client && client.blockedUntil && client.blockedUntil > now) {
                const retryAfter = Math.ceil((client.blockedUntil - now) / 1000);
                res.set("Retry-After", retryAfter.toString());
                return res.status(429).json({
                    error: "Too many requests, please try again later",
                    retryAfterSeconds: retryAfter,
                });
            }
            // Initialize or update client record
            if (!client) {
                this.store.set(ip, {
                    count: 1,
                    lastRequest: now,
                });
            }
            else {
                // Reset counter if outside the time window
                if (now - client.lastRequest > this.windowMs) {
                    client.count = 1;
                }
                else {
                    client.count++;
                }
                client.lastRequest = now;
            }
            // Check if limit exceeded
            const currentClient = this.store.get(ip);
            if (currentClient.count > this.maxRequests) {
                // Block the client
                currentClient.blockedUntil = now + this.blockDurationMs;
                const retryAfter = Math.ceil(this.blockDurationMs / 1000);
                res.set("Retry-After", retryAfter.toString());
                return res.status(429).json({
                    error: "Too many requests, please try again later",
                    retryAfterSeconds: retryAfter,
                });
            }
            next();
        };
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.blockDurationMs = blockDurationMs;
        this.maxEntries = maxEntries;
        // Run cleanup every 5 minutes to prevent memory bloat
        this.cleanupInterval = setInterval(() => this.cleanup(), 300000);
    }
    /**
     * Cleans up the store to prevent memory bloat
     * Keeps only the most active recent entries
     */
    cleanup() {
        const entries = Array.from(this.store.entries());
        // Sort by last request time (most recent first)
        entries.sort((a, b) => b[1].lastRequest - a[1].lastRequest);
        // Keep only the most recent entries up to maxEntries
        if (entries.length > this.maxEntries) {
            for (let i = this.maxEntries; i < entries.length; i++) {
                this.store.delete(entries[i][0]);
            }
        }
        // Remove expired blocks
        const now = Date.now();
        for (const [ip, client] of this.store.entries()) {
            if (client.blockedUntil && client.blockedUntil <= now) {
                delete client.blockedUntil;
            }
        }
    }
    /**
     * Gets the client IP address from request
     * Handles proxies via X-Forwarded-For header
     */
    getClientIp(req) {
        // Handle case when behind a proxy
        const forwarded = req.headers["x-forwarded-for"];
        if (typeof forwarded === "string") {
            return forwarded.split(",")[0].trim();
        }
        // Fallback to socket IP
        return req.socket.remoteAddress || "unknown";
    }
    /**
     * Cleans up resources when server shuts down
     */
    shutdown() {
        clearInterval(this.cleanupInterval);
    }
}
exports.RateLimiter = RateLimiter;
