import { useTranslation } from 'react-i18next'

import type {
  NotionFomula,
  NotionKeyValue,
  NotionPage,
  NotionRichText,
  NotionTitle,
} from '@/types/common'

export default function useNotion() {
  const { t } = useTranslation()

  async function fetchNotion(options: {
    proxyUrl: string
    integrationToken: string
    databaseId: string
    keyPropertyName: string
    valuePropertyName: string
    nextCursor?: string
    keyValuesArray: NotionKeyValue[]
  }) {
    console.log('fetchNotion', options)

    // proxyUrlから末尾のスラッシュを削除
    const proxyUrl = options.proxyUrl.replace(/\/$/, '')

    // パラメータを定義
    // 引数nextCursorがある場合は、start_cursorを設定
    const reqParams = {
      page_size: 100,
      start_cursor: options.nextCursor || undefined,
    }

    // データベースをfetchしてpageの配列を取得
    const res = await fetch(
      `${proxyUrl}/https://api.notion.com/v1/databases/${options.databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${options.integrationToken}`,
          'Notion-Version': '2021-08-16',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqParams),
      },
    ).catch(() => {
      throw new Error(t('notifications.Fetch.error.failedFetch'))
    })
    const resJson = await res.json()
    console.log(resJson)
    const pages = resJson.results as NotionPage[]

    if (!pages) {
      // pagesが無かったら処理中断
      throw new Error(t('notifications.Fetch.error.noPages'))
    }

    // pageごとに処理実行
    pages.forEach(row => {
      // keyPropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[options.keyPropertyName]) {
        throw new Error(t('notifications.Fetch.error.wrongKeyName'))
      }

      // valuePropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[options.valuePropertyName]) {
        throw new Error(t('notifications.Fetch.error.wrongValueName'))
      }

      // keyPropertyNameからpropertyを探す
      const keyProperty = row.properties[options.keyPropertyName]
      // keyのtypeがtitle, formula, textでない場合は処理中断
      if (
        keyProperty.type !== 'title' &&
        keyProperty.type !== 'rich_text' &&
        keyProperty.type !== 'formula'
      ) {
        throw new Error(t('notifications.Fetch.error.wrongKeyType'))
      }
      // propertyのtypeを判別してkeyを取得する
      const key = getPropertyValue(keyProperty)

      // valuePropertyNameからpropertyを探す
      const valueProperty = row.properties[options.valuePropertyName]
      // valueのtypeがtitle, formula, textでない場合は処理中断
      if (
        valueProperty.type !== 'title' &&
        valueProperty.type !== 'rich_text' &&
        valueProperty.type !== 'formula'
      ) {
        throw new Error(t('notifications.Fetch.error.wrongValueType'))
      }
      // propertyのtypeを判別してvalueを取得する
      const value = getPropertyValue(valueProperty)

      // keyValuesの配列にkeyとvalueを追加
      options.keyValuesArray.push({
        id: row.id,
        key,
        value,
        created_time: row.created_time,
        last_edited_time: row.last_edited_time,
        url: row.url,
      })
    })

    if (resJson.has_more) {
      // resのhas_moreフラグがtrueなら、nextCursorに値を入れて再度fetchNotion関数を実行
      // falseなら終了
      await fetchNotion({ ...options, nextCursor: resJson.next_cursor })
    } else {
      return
    }
  }

  function getPropertyValue(
    property: NotionTitle | NotionFomula | NotionRichText,
  ): string {
    let value: string

    if (property.type === 'title') {
      if (property.title.length) {
        value = property.title[0].plain_text
      } else {
        value = ''
      }
    } else if (property.type === 'rich_text') {
      if (property.rich_text.length) {
        value = property.rich_text[0].plain_text
      } else {
        value = ''
      }
    } else if (property.type === 'formula') {
      value = property.formula.string
    } else {
      value = ''
    }

    return value
  }

  return { fetchNotion }
}
