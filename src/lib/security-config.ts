/**
 * Security Configuration
 * 
 * This file contains security-related configuration that should be
 * reviewed and adjusted for production deployment.
 */

export const securityConfig = {
    // Rate limiting configuration
    rateLimits: {
        // Global rate limit (requests per minute per IP)
        global: {
            windowMs: 60 * 1000,
            maxRequests: 300
        },
        // Auth endpoints (stricter to prevent brute force)
        auth: {
            windowMs: 60 * 1000,
            maxRequests: 5
        },
        // Admin API endpoints
        admin: {
            windowMs: 60 * 1000,
            maxRequests: 30
        },
        // File upload (very strict)
        upload: {
            windowMs: 60 * 1000,
            maxRequests: 10
        },
        // Public read endpoints
        public: {
            windowMs: 60 * 1000,
            maxRequests: 60
        }
    },

    // Session configuration
    session: {
        cookieName: 'dps_admin_session',
        maxAge: 60 * 60 * 8, // 8 hours in seconds
        sameSite: 'strict' as const,
        httpOnly: true
    },

    // File upload configuration
    upload: {
        maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        allowedVideoTypes: ['video/mp4', 'video/webm']
    },

    // Input validation
    validation: {
        maxStringLength: 10000,
        maxIdLength: 100,
        maxArrayItems: 1000
    },

    // Content Security Policy
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://res.cloudinary.com"],
        mediaSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        baseUri: ["'self'"]
    },

    // Allowed sections for content API (whitelist)
    allowedSections: ['home', 'about', 'contact', 'academics', 'admissions'],
    allowedSubsections: {
        home: ['hero', 'testimonials', 'whyChooseUs', 'care'],
        about: ['principal', 'faculty', 'vision', 'mission'],
        contact: ['info', 'address', 'phone', 'email', 'hours'],
        academics: ['curriculum', 'sections', 'methodology'],
        admissions: ['process', 'eligibility', 'documents', 'fees']
    } as Record<string, string[]>,

    // Blocked URL patterns (attack signatures)
    blockedPatterns: [
        /\.\.\//,           // Path traversal
        /\0/,               // Null byte
        /<script/i,         // Script injection
        /javascript:/i,     // JavaScript protocol
        /vbscript:/i,       // VBScript protocol
        /onload=/i,         // Event handlers
        /onerror=/i,
        /%00/,              // URL-encoded null byte
        /union.*select/i,   // SQL injection
        /insert.*into/i,
        /delete.*from/i,
        /drop.*table/i
    ]
}

/**
 * Security checklist for production deployment:
 * 
 * 1. Environment Variables:
 *    - ADMIN_USERNAME: Strong, unique username
 *    - ADMIN_PASSWORD: Strong password (min 12 chars, mixed case, numbers, symbols)
 *    - NODE_ENV: Set to 'production'
 * 
 * 2. HTTPS:
 *    - Ensure HTTPS is enforced
 *    - Update session cookie secure flag
 * 
 * 3. Rate Limiting:
 *    - For high-traffic sites, use Redis instead of in-memory store
 *    - Adjust limits based on expected traffic
 * 
 * 4. Logging:
 *    - Implement proper logging for security events
 *    - Monitor for suspicious patterns
 * 
 * 5. Updates:
 *    - Keep all dependencies updated
 *    - Run `npm audit` regularly
 * 
 * 6. Backup:
 *    - Regular backups of data files
 *    - Test restore procedures
 * 
 * 7. Firewall:
 *    - Consider implementing WAF (Web Application Firewall)
 *    - Block known malicious IPs
 */
