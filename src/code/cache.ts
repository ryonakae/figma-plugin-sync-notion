export async function getCache(): Promise<KeyValue[]> {
  console.log('getCache')

  let cache: KeyValue[]

  // キャッシュのデータをDodumentから取得
  const data = figma.root.getPluginData('cache')
  console.log('data', data)

  // データがあったらパース、無かったら空配列を返す
  if (data) {
    cache = JSON.parse(data)
  } else {
    cache = []
  }

  return cache
}

export async function setCache(keyValues: KeyValue[]) {
  // キャッシュをDocumentに保存
  figma.root.setPluginData('cache', JSON.stringify(keyValues))
  console.log('setCache success', keyValues)
}
