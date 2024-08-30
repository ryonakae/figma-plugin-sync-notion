/** @jsx h */
import { h } from 'preact'

import { render } from '@create-figma-plugin/ui'
import { I18nextProvider } from 'react-i18next'

import i18n from '@/i18n/ui'
import App from '@/ui/App'
import '!./styles/output.css'

function Plugin() {
  return (
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  )
}

export default render(Plugin)
