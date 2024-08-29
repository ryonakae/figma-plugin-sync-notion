# Sync Notion Figma Plugin

![](./cover.png)

Sync text from Notion database to Figma document.  
Useful when managing app text in Notion or for multilingual support.  
\-  
NotionのデータベースからFigmaのドキュメントにテキストを同期するプラグインです。  
アプリケーションのテキストをNotionで管理したい場合や多言語対応をしたい場合に便利です。

## 🔥 How to use / 使い方

### 「取得」タブ / Fetch tab
Fetches text from a database in Notion. The data is cached to this document and restored at next time it is launched. If you have updated Notion database, fetch again.  
\-  
Notionのデータベースからテキストを取得します。取得したテキストはこのドキュメントにキャッシュされ、次回起動時に復元されます。もしNotionのデータベースを更新した場合は、再度取得してください。

#### 1. データベースID / Database ID
Specify the Notion database ID ([Reference](https://developers.notion.com/reference/retrieve-a-database)).  
\-  
NotionのデータベースIDを指定します ([参考](https://developers.notion.com/reference/retrieve-a-database))。

#### 2. インテグレーショントークン / Integration token
First, create a new integration in Notion ([Reference](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)).  
Next, give your integration page permissions ([Reference](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)).  
Input the copied token.  
\-  
まず、Notionで新しくインテグレーションを作成します ([参考](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion))。  
次に、作成したインテグレーションにデータベースへのアクセス権限を与えます ([参考](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions))。  
コピーしたトークンを入力してください。

#### 3. キーのプロパティ名 / Key property name
Specify the name of the property that is the key of the data to be fetched (e.g. Name, Key, Title, etc.).  
Currently, title, formula and text properties are supported.  
\-  
取得するデータのキーとなるプロパティ名を指定します (例: Name、Key、Titleなど)。  
現在、タイトル、フォーミュラ、テキストプロパティが対応しています。

#### 4. 値のプロパティ名 / Value property name
Specify the name of the property that is the value of the data to be fetched (e.g. Value, en, ja, etc.).  
Currently, title, formula and text properties are supported.  
\-  
取得するデータの値となるプロパティ名を指定します (例: Value、en、jaなど)。  
現在、タイトル、フォーミュラ、テキストプロパティが対応しています。

After entering the information for steps 1-4, click the "Fetch text from Notion" button to retrieve the text. Depending on the number of items in the database, this process may take some time.  
To delete the cache, click the "Clear cache" button.  
\-  
1-4を入力したら、「Notionからテキストを取得」ボタンをクリックし、テキストを取得します。データベースの項目数によっては、しばらく待つ必要があります。  
キャッシュを削除する場合は、「キャッシュを削除」ボタンをクリックしてください。
