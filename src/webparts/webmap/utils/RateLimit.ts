import { updateLoader } from "./loader";

// Sharepoint Api Limit: 3000 calls per 5 minutes per User

// More relevant for exif extraction method

export class RateLimiter {
    private static instance: RateLimiter;
    private requestCount = 0;
    private windowStart = Date.now();
    private readonly WINDOW_SIZE = 6 * 60 * 1000; // 6 minutes buffer
    private readonly MAX_REQUESTS_PER_WINDOW = 2500; // Max 2500 requests
    private loaderId: string;
  
    public constructor(loaderId: string) {
      this.loaderId = loaderId;
      // Versuch gespeicherte Daten zu laden
        const saved = sessionStorage.getItem("rateLimiter");
        if (saved) {
        try {
            const data = JSON.parse(saved);
            this.requestCount = data.requestCount || 0;
            this.windowStart = data.windowStart || Date.now();
        } catch {
            // falls corrupted → ignorieren
        }
        }
    }

    private persistState(): void {
        sessionStorage.setItem("rateLimiter", JSON.stringify({
          requestCount: this.requestCount,
          windowStart: this.windowStart
        }));
      }
  
    // Check if we're approaching rate limits
    public async checkRateLimit(): Promise<void> {
        const now = Date.now();
        
        // Reset window if 6 minutes have passed
        if (now - this.windowStart >= this.WINDOW_SIZE) {
                this.requestCount = 0;
                this.windowStart = now;
                this.persistState();
            }
            
            // If we're approaching the limit, wait until next window
            if (this.requestCount >= this.MAX_REQUESTS_PER_WINDOW) {
            const timeToWait = this.WINDOW_SIZE - (now - this.windowStart);
            if (timeToWait > 0) {
                updateLoader(this.loaderId, `Rate limit reached. Waiting ${Math.ceil(timeToWait / 1000)}s...`);
                await new Promise(resolve => setTimeout(resolve, timeToWait));
                this.requestCount = 0;
                this.windowStart = Date.now();
                this.persistState();
            }
        }
    }

    public incrementRequestCount(): void {
        this.requestCount++;
        this.persistState();
    }
  }
  
  