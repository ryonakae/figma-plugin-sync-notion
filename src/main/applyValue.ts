import { loadFontsAsync } from '@create-figma-plugin/utilities'
import queryString, { type ParsedQuery } from 'query-string'

import i18n from '@/i18n/main'
import { getTextNodes } from '@/main/util'

import type { NotionKeyValue, TargetTextRange } from '@/types/common'

export default async function applyValue(
  keyValues: NotionKeyValue[],
  options: {
    targetTextRange: TargetTextRange
    includeComponents: boolean
    includeInstances: boolean
  },
) {
  console.log('applyValue', keyValues, options)

  // textNodeを取得
  const textNodes = await getTextNodes(options)

  console.log('textNodes', textNodes)

  // textNodeが1つもなかったら処理を終了
  if (textNodes.length === 0) {
    // 選択状態によってトーストを出し分け
    if (options.targetTextRange === 'selection') {
      figma.notify(i18n.t('notifications.main.noTextInSelection'))
    } else if (options.targetTextRange === 'currentPage') {
      figma.notify(i18n.t('notifications.main.noTextInCurrentPage'))
    } else if (options.targetTextRange === 'allPages') {
      figma.notify(i18n.t('notifications.main.noTextInAllPages'))
    }

    return
  }

  // matchedTextNodesを格納する配列を用意
  let matchedTextNodes: TextNode[] = []

  // textNodeの中からレイヤー名が#で始まるものだけを探してmatchedTextNodesに追加
  matchedTextNodes = textNodes.filter(textNode => {
    return textNode.name.startsWith('#')
  })

  console.log('matchedTextNodes', matchedTextNodes)

  // matchedTextNodesが空なら処理を終了
  if (matchedTextNodes.length === 0) {
    figma.notify(i18n.t('notifications.applyValue.noMatchingText'))
    return
  }

  // 事前にフォントをロード
  await loadFontsAsync(matchedTextNodes).catch((error: Error) => {
    const errorMessage = i18n.t('notifications.main.errorLoadFonts')
    figma.notify(errorMessage, { error: true })
    throw new Error(errorMessage)
  })

  // matchedTextNodesごとに処理を実行
  matchedTextNodes.forEach(textNode => {
    // クエリパラメータを取得する
    // ?から後ろの部分をクエリパラメータと見なす
    // 一部の文字がうまくパースされないので、パース前にエンコードする
    const originalParam = textNode.name.split('?')[1] as string | undefined
    let param: ParsedQuery<string>
    if (originalParam) {
      const replacedParam = originalParam.replace(/\+/g, '%2B')
      param = queryString.parse(replacedParam)
    } else {
      param = queryString.parse('')
    }

    // レイヤー名から#を取ってkey名にする
    // #から、?までの部分をkey名と見なす
    const key = textNode.name.split('?')[0].replace(/^#/, '')

    // key名を使ってkeyValuesからオブジェクトを検索する
    const keyValue = keyValues.find(keyValue => {
      return keyValue.key === key
    })

    // テキストを置換する
    // keyValueオブジェクトが見つかった場合
    if (keyValue) {
      console.log('keyValue found', key)

      // 見つかったkeyValueオブジェクトからvalueを取り出す
      const value = keyValue.value

      console.log('value', value)
      console.log('param', param)

      // テキストをvalueに置換
      // paramがある場合→valueの中の{paramKey}の置き換えを試みる
      if (Object.keys(param).length) {
        // valueの中に{paramKey}があるか探す
        const matchedParamKeys = value.match(/(?<=\{).*?(?=\})/g)

        // 無い場合、仕方がないので普通にvalueを入れる
        if (!matchedParamKeys) {
          textNode.characters = value
          return
        }

        // value内にある{paramKey}毎に置換
        let replacedValue = value
        matchedParamKeys.forEach(paramKey => {
          replacedValue = replacedValue.replace(
            new RegExp(`{${paramKey}}`, 'g'),
            param[paramKey] !== undefined
              ? String(param[paramKey])
              : `{${paramKey}}`,
          )
        })

        // replacedValueをテキスト本文にする
        textNode.characters = replacedValue
      }
      // paramが無い場合→普通にvalueを入れる
      else {
        textNode.characters = value
      }
    }
    // keyValueオブジェクトが見つからなかった場合
    else {
      console.log('keyValue not found', key)
    }
  })

  // 完了通知
  // 選択状態によってトーストを出し分け
  if (options.targetTextRange === 'selection') {
    figma.notify(i18n.t('notifications.applyValue.finishSelection'))
  } else if (options.targetTextRange === 'currentPage') {
    figma.notify(i18n.t('notifications.applyValue.finishCurrentPage'))
  } else if (options.targetTextRange === 'allPages') {
    figma.notify(i18n.t('notifications.applyValue.finishAllPages'))
  }
}
