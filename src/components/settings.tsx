"use client"

import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { CardTitle, H3, P } from "@ory/themes"
import { AxiosError } from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

import { ActionCard, CenterLink, Flow, Methods } from "@/pkg"
import { handleFlowError } from "@/pkg/errors"
import ory from "@/pkg/sdk"
import { NextRouter } from "next/router"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function SettingsCard({
  flow,
  only,
  children,
}: Props & { children: ReactNode }) {
  if (!flow) return null

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes

  if (nodes.length === 0) return null

  return <ActionCard wide>{children}</ActionCard>
}

export default function SettingsPage() {
  const [flow, setFlow] = useState<SettingsFlow>()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')

  useEffect(() => {
    if (!flowId) {
      // If no flow ID was given, we need to create a settings flow
      ory
        .createBrowserSettingsFlow()
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 401:
              return router.push("/login")
          }
          return Promise.reject(err)
        })
      return
    }

    // If the flow ID was given, we fetch it
    ory
      .getSettingsFlow({ id: String(flowId) })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router as unknown as NextRouter, "settings", setFlow))
  }, [flowId, router])

  const onSubmit = async (values: UpdateSettingsFlowBody) => {
    router.push(`/settings?flow=${flow?.id}`)

    ory
      .updateSettingsFlow({
        flow: String(flow?.id),
        updateSettingsFlowBody: values,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router as unknown as NextRouter, "settings", setFlow))
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data as SettingsFlow)
          return
        }
        return Promise.reject(err)
      })
  }

  return (
    <>
      <CardTitle>Settings</CardTitle>

      <SettingsCard only="profile" flow={flow}>
        <H3>Profile Settings</H3>
        <P>Manage your profile settings</P>
        <Flow onSubmit={onSubmit} flow={flow} only="profile" />
      </SettingsCard>

      <SettingsCard only="password" flow={flow}>
        <H3>Change Password</H3>
        <P>Change your account password</P>
        <Flow onSubmit={onSubmit} flow={flow} only="password" />
      </SettingsCard>

      <SettingsCard only="oidc" flow={flow}>
        <H3>Social Sign In</H3>
        <P>Connect or disconnect social sign in methods</P>
        <Flow onSubmit={onSubmit} flow={flow} only="oidc" />
      </SettingsCard>

      <SettingsCard only="lookup_secret" flow={flow}>
        <H3>Backup Recovery Codes</H3>
        <P>Add or remove backup recovery codes</P>
        <Flow onSubmit={onSubmit} flow={flow} only="lookup_secret" />
      </SettingsCard>

      <SettingsCard only="totp" flow={flow}>
        <H3>2FA TOTP</H3>
        <P>Add or remove TOTP 2FA</P>
        <Flow onSubmit={onSubmit} flow={flow} only="totp" />
      </SettingsCard>

      <SettingsCard only="webauthn" flow={flow}>
        <H3>Hardware Tokens and Biometrics</H3>
        <P>Add or remove hardware tokens and biometric authentication methods</P>
        <Flow onSubmit={onSubmit} flow={flow} only="webauthn" />
      </SettingsCard>

      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Back to Home</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}