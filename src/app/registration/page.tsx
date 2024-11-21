import type { Metadata } from "next"

import { RegistrationView } from "@/components"

export const metadata: Metadata = {
  title: "Create account - Ory NextJS Integration Example",
  description: "NextJS + React + Vercel + Ory",
}

export default function RegistrationPage() {
  return <RegistrationView />
}
