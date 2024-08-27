/** @jsx h */
import { h } from 'preact'

import { render } from '@create-figma-plugin/ui'

import App from '@/ui/App'
import '@/ui/i18n'

import '!./styles/output.css'

function Plugin() {
  return <App />
}

export default render(Plugin)
