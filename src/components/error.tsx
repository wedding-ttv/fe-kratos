"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AxiosError } from "axios"
import { FlowError } from "@ory/client"
import { CardTitle, CodeBox } from "@ory/themes"

import { ActionCard, CenterLink, MarginCard } from "@/pkg"
import ory from "@/pkg/sdk"

export default function ErrorPage() {
  const [error, setError] = React.useState<FlowError | string>()
  const router = useRouter()
  
  // Chuyển sang sử dụng Web API để lấy search params trong client component
  const searchParams = new URLSearchParams(window.location.search)
  const id = searchParams.get('id')

  React.useEffect(() => {
    if (error) return

    ory
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        setError(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          case 403:
          case 410:
            // Redirect home in all these cases
            return router.push("/")
        }

        return Promise.reject(err)
      })
  }, [id, router, error])

  if (!error) {
    return null
  }

  return (
    <>
      <MarginCard wide>
        <CardTitle>An error occurred</CardTitle>
        <CodeBox code={JSON.stringify(error, null, 2)} />
      </MarginCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}