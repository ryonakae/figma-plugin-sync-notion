const CLIENT_STORAGE_KEY_NAME = 'sync-notion'

const defaultOptions: Options = {
  apiUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
  valuePropertyName: ''
}

async function closePlugin() {
  figma.closePlugin()
}

function notify(msg: NotifyMessage) {
  const message = msg.message
  const options = msg.options || undefined
  figma.notify(message, options)
}

async function getOptions() {
  // オプションをclientStorageから取得、無かったらdefaultOptionsを参照
  const options: Options =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)) ||
    defaultOptions

  // UIに送信
  figma.ui.postMessage({
    type: 'get-options-success',
    options
  } as PluginMessage)

  console.log('getOptions success', options)
}

async function setOptions(msg: SetOptionsMessage) {
  // 現在のオプションをclientStorageから取得、無かったらdefaultOptionsを参照
  const currentOptions: Options =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)) ||
    defaultOptions

  // UIから送られてきたオプションを現在のものとマージ
  const newOptions: Options = {
    ...(currentOptions || defaultOptions),
    ...msg.options
  }

  // 新しいオプションをclientStorageに保存
  await figma.clientStorage.setAsync(CLIENT_STORAGE_KEY_NAME, newOptions)

  console.log('setOptions success', newOptions)
}

async function onSync(msg: SyncMessage) {
  console.log('onSync', msg.keyValues)

  let keyValues = msg.keyValues

  // textNodeを検索
  // 要素を選択している時は各選択ごとに処理
  // textならそのまま追加、group, frame, componentならその中のtextを探して追加
  // 何も選択していない時は現在のページ内の全てのtextNodeを取得
  let textNodes: TextNode[] = []
  if (figma.currentPage.selection.length) {
    figma.currentPage.selection.forEach(selection => {
      if (selection.type === 'TEXT') {
        textNodes.push(selection)
      } else if (
        selection.type === 'GROUP' ||
        selection.type === 'FRAME' ||
        selection.type === 'COMPONENT' ||
        selection.type === 'COMPONENT_SET' ||
        selection.type === 'INSTANCE'
      ) {
        textNodes = selection.findAllWithCriteria({ types: ['TEXT'] })
      }
    })
  } else {
    textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
  }

  // textNodeが1つも無かったら処理を中断
  if (!textNodes.length) {
    // 選択状態によってトーストを出し分け
    if (figma.currentPage.selection.length) {
      figma.notify('No text in selection.')
    } else {
      figma.notify('No text in this page.')
    }
    return
  }

  // textNodeの中からレイヤー名が#で始まるものだけを探して新しい配列を作る
  const matchedTextNodes = textNodes.filter(textNode => {
    return textNode.name.startsWith('#')
  })

  // matchedTextNodesが空なら処理中断
  if (!matchedTextNodes.length) {
    figma.notify('No matching text.')
    return
  }

  // matchedTextNodesごとに処理を実行
  await Promise.all(
    matchedTextNodes.map(async textNode => {
      // レイヤー名が#で始まるもの以外は処理しない
      if (!textNode.name.startsWith('#')) {
        return
      }

      // レイヤー名から#を取ってkey名にする
      const key = textNode.name.replace(/^#/, '')

      // key名を使ってkeyValuesからオブジェクトを検索する
      const keyValue = keyValues.find(keyValue => {
        return keyValue.key === key
      })

      // keyValueオブジェクトが見つからなかったら処理中断
      if (!keyValue) {
        return
      }

      // 見つかったkeyValueオブジェクトからvalueを取り出す
      const value = keyValue.value
      console.log(key, value)

      // テキスト置換のために事前にフォントをロード
      let fontName: FontName
      if (textNode.characters) {
        fontName = textNode.getRangeFontName(0, 1) as FontName
      } else {
        fontName = textNode.fontName as FontName
      }
      await figma.loadFontAsync(fontName)

      // テキストをvalueに置換
      textNode.characters = value
    })
  )

  // 完了の旨をトーストで表示
  // 選択中かそうでないかで分岐
  if (figma.currentPage.selection.length) {
    figma.notify('Sync all text in selection with Notion.')
  } else {
    figma.notify('Sync all text in this page with Notion.')
  }

  // 配列を空にしてメモリ解放
  textNodes = []
  keyValues = []
}

// find系の高速化
figma.skipInvisibleInstanceChildren = true

// UIからのメッセージを監視
figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case 'close-plugin':
      closePlugin()
      break

    case 'notify':
      notify(msg)
      break

    case 'get-options':
      getOptions()
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

// 右パネルに起動ボタンを表示
figma.root.setRelaunchData({ open: '' })

// UIを表示
figma.showUI(__html__, {
  width: 300,
  height: 400
})
