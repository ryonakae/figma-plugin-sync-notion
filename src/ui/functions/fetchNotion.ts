import { getPropertyValue } from '@/ui/util'

import type { KeyValue, NotionPage } from '@/types/common'

type Options = {
  apiUrl: string
  integrationToken: string
  databaseId: string
  keyPropertyName: string
  valuePropertyName: string
  next_cursor?: string
  keyValuesArray: KeyValue[]
}

export default async function fetchNotion(options: Options) {
  console.log(
    'fetchNotion',
    options.apiUrl,
    options.integrationToken,
    options.databaseId,
    options.keyPropertyName,
    options.valuePropertyName,
    options.next_cursor,
  )

  // パラメータを定義
  // 引数next_cursorがある場合は、start_cursorを設定
  const reqParams = {
    page_size: 100,
    start_cursor: options.next_cursor || undefined,
  }

  // データベースをfetchしてpageの配列を取得
  const res = await fetch(
    `${options.apiUrl}/v1/databases/${options.databaseId}/query`,
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
    throw new Error('Failed to fetch database.')
  })
  const resJson = await res.json()
  console.log(resJson)
  const pages = resJson.results as NotionPage[]

  // pagesが無かったら処理中断
  if (!pages) {
    throw new Error('No pages in this database.')
  }

  // pageごとに処理実行
  pages.forEach(row => {
    // keyPropertyNameと同じプロパティが無かったら処理中断
    if (!row.properties[options.keyPropertyName]) {
      throw new Error('Key property name is wrong.')
    }

    // valuePropertyNameと同じプロパティが無かったら処理中断
    if (!row.properties[options.valuePropertyName]) {
      throw new Error('Value property name is wrong.')
    }

    // keyPropertyNameからpropertyを探す
    const keyProperty = row.properties[options.keyPropertyName]
    // keyのtypeがtitle, formula, textでない場合は処理中断
    if (
      keyProperty.type !== 'title' &&
      keyProperty.type !== 'rich_text' &&
      keyProperty.type !== 'formula'
    ) {
      throw new Error('Key property type is wrong.')
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
      throw new Error('Value property type is wrong.')
    }
    // propertyのtypeを判別してvalueを取得する
    const value = getPropertyValue(valueProperty)

    // keyValuesの配列にkeyとvalueを追加
    options.keyValuesArray.push({
      id: row.id,
      key,
      value,
    })
  })

  // resのhas_moreフラグがtrueなら再度fetchNotion関数を実行する
  // falseなら終了
  if (resJson.has_more) {
    await fetchNotion({ ...options, next_cursor: resJson.next_cursor })
  } else {
    return
  }
}
