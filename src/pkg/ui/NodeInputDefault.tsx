import { TextInput } from "@ory/themes"

import { NodeInputProps } from "./helpers"

export function NodeInputDefault(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }

  const inputProps: any = {
    title: node.meta.label?.text,
    onClick,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    type: attributes.type,
    name: attributes.name,
    value: value.toString(),
    disabled: attributes.disabled || disabled,
    state: node.messages.find(({ type }) => type === "error") ? "error" : undefined,
    subtitle: (
      <>
        {node.messages.map(({ text, id }, k) => (
          <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
            {text}
          </span>
        ))}
      </>
    )
  }

  if (node.messages.length > 0) {
    inputProps.help = "true"
  }

  return <TextInput {...inputProps} />
}
