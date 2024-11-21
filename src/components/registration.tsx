"use client"

import React from "react"
import { AxiosError } from "axios"
import { CardTitle } from "@ory/themes"
import { NextRouter } from "next/router"
import { useRouter, useSearchParams } from "next/navigation"
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"

import ory from "@/pkg/sdk"
import { handleFlowError } from "@/pkg/errors"
import { ActionCard, CenterLink, Flow, MarginCard } from "@/pkg"

// Renders the registration page
export default function RegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [flow, setFlow] = React.useState<RegistrationFlow>()

  // Get query parameters
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')

  React.useEffect(() => {
    // If we already have a flow, do nothing
    if (flow) return

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getRegistrationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router as unknown as NextRouter, "registration", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserRegistrationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router as unknown as NextRouter, "registration", setFlow))
  }, [flowId, returnTo, flow, router])

  const onSubmit = async (values: UpdateRegistrationFlowBody) => {
    // Use router.push instead of router.replace
    router.push(`/registration?flow=${flow?.id}`)

    ory
      .updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
      .then(async ({ data }) => {
        console.log("This is the user session: ", data, data.identity)

        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                router.push("/verification?flow=" + item.flow.id)
                return
            }
          }
        }

        router.push(flow?.return_to || "/")
      })
      .catch(handleFlowError(router as unknown as NextRouter, "registration", setFlow))
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data as RegistrationFlow)
          return
        }
        return Promise.reject(err)
      })
  }

  return (
    <>
      <MarginCard>
        <CardTitle>Create account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <CenterLink data-testid="cta-link" as="a" href="/login">
          Sign in
        </CenterLink>
      </ActionCard>
    </>
  )
}
