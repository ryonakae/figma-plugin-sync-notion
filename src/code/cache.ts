import { CLIENT_STORAGE_CACHE_KEY_NAME } from '@/code/constants'

export async function getCache(): Promise<KeyValue[]> {
  // キャッシュをclientStorageから取得、KeyValue[]を返す
  // 無かったら空配列を返す
  const cache: KeyValue[] =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_CACHE_KEY_NAME)) || []
  return cache
}

export async function setCache(keyValues: KeyValue[]) {
  // キャッシュをclientStorageに保存
  await figma.clientStorage.setAsync(CLIENT_STORAGE_CACHE_KEY_NAME, keyValues)
  console.log('setCache success', keyValues)
}
