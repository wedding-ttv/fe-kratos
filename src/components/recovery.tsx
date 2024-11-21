"use client"

import React from "react"
import Link from "next/link"
import { NextRouter } from "next/router"
import { useRouter, useSearchParams } from "next/navigation"

import { AxiosError } from "axios"
import { CardTitle } from "@ory/themes"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"

import ory from "@/pkg/sdk"
import { handleFlowError } from "@/pkg/errors"
import { Flow, ActionCard, CenterLink, MarginCard } from "@/pkg"

export default function RecoveryPage() {
  const [flow, setFlow] = React.useState<RecoveryFlow>()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get query parameters
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')

  React.useEffect(() => {
    // If we already have a flow, do nothing
    if (flow) return

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router as unknown as NextRouter, "recovery", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserRecoveryFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router as unknown as NextRouter, "recovery", setFlow))
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data as RecoveryFlow)
          return
        }
        return Promise.reject(err)
      })
  }, [flowId, router, returnTo, flow])

  const onSubmit = (values: UpdateRecoveryFlowBody) => {
    router.push(`/recovery?flow=${flow?.id}`)
    
    return ory
      .updateRecoveryFlow({
        flow: String(flow?.id),
        updateRecoveryFlowBody: values,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router as unknown as NextRouter, "recovery", setFlow))
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data as RecoveryFlow)
          return
        }
        throw err
      })
  }

  return (
    <>
      <MarginCard>
        <CardTitle>Recover your account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}
