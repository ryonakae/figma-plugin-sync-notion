export async function closePlugin() {
  figma.closePlugin()
}

export function notify(msg: NotifyMessage) {
  const message = msg.message
  const options = msg.options || undefined
  figma.notify(message, options)
}
