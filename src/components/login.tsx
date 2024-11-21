"use client"

import React from "react"
import Head from "next/head"
import Link from "next/link"
import { NextRouter } from "next/router"
import { useRouter, useSearchParams } from "next/navigation"

import { AxiosError } from "axios"
import { CardTitle } from "@ory/themes"
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"

import ory from "@/pkg/sdk"
import { handleGetFlowError, handleFlowError } from "@/pkg/errors"
import { ActionCard, CenterLink, useLogoutLink, Flow, MarginCard } from "@/pkg"

export default function LoginPage() {
  const [flow, setFlow] = React.useState<LoginFlow>()

  const searchParams = useSearchParams()
  const router = useRouter()
  
  const returnTo = searchParams.get('return_to')
  const flowId = searchParams.get('flow')
  const refresh = searchParams.get('refresh')
  const aal = searchParams.get('aal')

  React.useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleGetFlowError(router as unknown as NextRouter, "login", setFlow))
      return
    }

    ory
      .createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router as unknown as NextRouter, "login", setFlow))
  }, [flowId, aal, refresh, returnTo, flow])

  const onSubmit = (values: UpdateLoginFlowBody) => {
    router.push(`/login?flow=${flow?.id}`)
    
    return ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      .then(() => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to
          return
        }
        router.push("/")
      })
      .catch(handleFlowError(router as unknown as NextRouter, "login", setFlow))
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data as LoginFlow)
          return
        }
        return Promise.reject(err)
      })
  }

  return (
    <>
      <Head>
        <title>Sign in - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action"
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication"
            }
            return "Sign In"
          })()}
        </CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      {aal || refresh ? (
        <ActionCard>
          <CenterLink data-testid="logout-link" onClick={useLogoutLink([aal, refresh])}>
            Log out
          </CenterLink>
        </ActionCard>
      ) : (
        <>
          <ActionCard>
            <Link href="/registration" passHref>
              <CenterLink>Create account</CenterLink>
            </Link>
          </ActionCard>
          <ActionCard>
            <Link href="/recovery" passHref>
              <CenterLink>Recover your account</CenterLink>
            </Link>
          </ActionCard>
        </>
      )}
    </>
  )
}