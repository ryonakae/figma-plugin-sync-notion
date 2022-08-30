# Sync Notion Figma Plugin

![](./cover.png)

Sync text from Notion database to Figma document.  
Useful when managing app text in Notion or for multilingual support.

## 🔥 How to use

- \[Notion\] Create a reverse proxy to avoid [CORS errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors).
  - [More information](#%EF%B8%8F-create-a-reverse-proxy-to-avoid-cors-errors)
- \[Notion\] [Create a Notion integration.](https://developers.notion.com/docs/getting-started#step-1-create-an-integration)
- \[Notion\] Create a database.
- \[Notion\] [Share the database with your integration.](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration)
- \[Notion\] Add pages with unique key (e.g., page title) and values to the database.
  - Currently, title, formula, and text properties are supported.
  - Variables can be embedded. e.g., `{name} follows you. (Age: {age})`
- \[Figma\] Rename text layers you want to sync to `#<Key Name of Notion>`.
  - e.g., `#pageTitle`, `#description` and `#signInWithApple`
  - You can pass parameters. e.g., `#notification?name=Alistair Warren&age=24`. If there are variables in Notion database value, it will replace the text with that value in it.
  - In this example, the text will replaced by `Alistair Warren follows you. (Age: 24)`
- \[Figma\] Open this plugin and fill in each field.
- \[Figma\] Press the "Sync Notion" button.
- Enjoy😎🏝

### "Sync Notion" button

Sync all text contained in the selected element. If nothing is selected, all text on this page will be synced.

### "Sync with Highlight" option

If this option is enabled, highlight all text that has correct layer name format: `#<Key Name of Notion>`.  
Text is highlighted in blue if the key is correct and in red if it's incorrect.  
It is useful to check that the layer names are formatted correctly or that they have no typos.

## ⚙️ Create a reverse proxy to avoid CORS errors

Here are the steps to create a reverse proxy in [Cloudflare Workers](https://workers.cloudflare.com/).  
(This is just one example.)

- Sign up or login to Cloudflare Workers.
- Select "Workers" from the menu. Then create a new service.
  - The service name can be any name you like.
  - e.g., `https://reverse-proxy.yourname.workers.dev`
- After the service is created, click "Quick Edit" to open the editor.
- Enter the following code into your editor. Then click "Save and Deploy.

```
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(`
        Usage:\n
          ${url.origin}/<url>
      `);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        ok: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type, Notion-Version"
        }
      });
    }

    let response = await fetch(request.url.slice(url.origin.length + 1), {
      method: request.method,
      headers: request.headers,
      redirect: "follow",
      body: request.body
    });
    response = new Response(response.body, response);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Authorization, Content-Type, Notion-Version");

    return response;
  } catch (e) {
    return new Response(e.stack || e, { status: 500 });
  }
}
```

- Now you can access any API with the URL: `https://reverse-proxy.yourname.workers.dev/https://any-api-url` without any CORS errors.

The URL entered into the "Notion API URL" field of this Figma plugin is `https://reverse-proxy.yourname.workers.dev/https://api.notion.com` (not required for "v1" and later).

## 📮 Support

If you have any plobrem or feedback, please use the [GitHub Issues](https://github.com/ryonakae/figma-plugin-sync-notion/issues).

---

This plugin is made by Ryo Nakae 🙎‍♂️.

- https://brdr.jp
- https://twitter.com/ryo_dg
- https://github.com/ryonakae
