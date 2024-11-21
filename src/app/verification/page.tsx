import { Metadata } from "next";
import { VerificationView } from "@/components";

export const metadata: Metadata = {
  title: "Verify your email - Ory NextJS Integration Example",
  description: "NextJS + React + Vercel + Ory",
}

export default function VerificationPage() {
  return <VerificationView />
}
