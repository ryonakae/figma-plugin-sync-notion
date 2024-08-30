import type { NotionKeyValue } from '@/types/common'

export default function useNotionKeyValue() {
  function getKeyWithQueryStrings(keyValue: NotionKeyValue) {
    // 波括弧で囲まれたパラメータを抽出
    const params =
      keyValue.value.match(/\{([^}]+)\}/g)?.map(param => param.slice(1, -1)) ||
      []

    // パラメータが存在する場合、クエリ文字列を生成
    if (params.length > 0) {
      const queryString = params.map(param => `${param}=${param}`).join('&')
      return `#${keyValue.key}?${queryString}`
    }

    // パラメータが存在しない場合、キーのみを返す
    return `#${keyValue.key}`
  }

  return { getKeyWithQueryStrings }
}
