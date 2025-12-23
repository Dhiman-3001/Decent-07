'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log exception to an error reporting service
        console.error(error)
    }, [error])

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
                    <div className="text-center space-y-4 max-w-md">
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Something went wrong!</h2>
                        <p className="text-neutral-600">
                            We apologize for the inconvenience. A critical error has occurred on our servers.
                        </p>
                        <div className="pt-4">
                            <Button
                                onClick={() => reset()}
                                variant="gradient"
                            >
                                Try again
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
