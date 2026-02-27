"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Send } from "lucide-react"

interface AdmissionModalProps {
  children: React.ReactNode
}

export function AdmissionModal({ children }: AdmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert("Thank you for your enquiry! We will contact you soon.")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="font-serif text-2xl">
            Admission Enquiry
          </DialogTitle>
          <DialogDescription>
            Fill in your details and we&apos;ll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Parent's Name"
              required
              aria-label="Parent's Name"
            />
            <Input
              placeholder="Student's Name"
              required
              aria-label="Student's Name"
            />
          </div>
          <Input
            type="tel"
            placeholder="Phone Number"
            required
            aria-label="Phone Number"
          />
          <Input
            type="email"
            placeholder="Email Address"
            required
            aria-label="Email Address"
          />
          <select
            className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
            aria-label="Class seeking admission"
          >
            <option value="">Select Class</option>
            <option value="nursery">Nursery</option>
            <option value="lkg">LKG</option>
            <option value="ukg">UKG</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
          <Textarea
            placeholder="Any specific queries or requirements?"
            aria-label="Additional queries"
          />
          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Enquiry
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
