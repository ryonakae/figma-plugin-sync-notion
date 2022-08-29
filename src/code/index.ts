import onSync from '@/code/onSync'
import { getOptions, setOptions } from '@/code/options'
import { closePlugin, notify } from '@/code/util'

// find系の高速化
figma.skipInvisibleInstanceChildren = true

// 右パネルに起動ボタンを表示
figma.root.setRelaunchData({ open: '' })

// UIからのメッセージを監視
figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case 'close-plugin':
      closePlugin()
      break

    case 'notify':
      notify(msg)
      break

    case 'get-options':
      // オプションを取得
      const options = await getOptions()

      // オプションをUIに送信
      figma.ui.postMessage({
        type: 'get-options-success',
        options
      } as PluginMessage)
      console.log('getOptions success', options)
      break

    case 'set-options':
      setOptions(msg)
      break

    case 'sync':
      onSync(msg)
      break

    default:
      break
  }
}

// UIを表示
figma.showUI(__html__, {
  width: 300,
  height: 450
})
