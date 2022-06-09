# Sync Notion Figma Plugin

Sync text from Notion database to Figma document.  
Useful when managing app text in Notion or for multilingual support.

## 🔥 How to use

- Create a reverse proxy to avoid CORS errors.
  - [More information](#-create-a-reverse-proxy-to-avoid-cors-errors)
- Create a database in Notion.
- Add pages with unique key (e.g., page title) and values to the database.
  - Currently, title, formula, and text properties are supported.
- In Figma, rename text layers you want to sync to `#<Key Property Name of Notion>`.
  - e.g., `#pageTitle`, `#description` and `#signInWithApple`
- Open this plugin and fill in each field.
- Press the "Sync Notion" button.
- Enjoy😎

## 👨‍💻 Create a reverse proxy to avoid CORS errors

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

<!-- <img width="367" alt="CleanShot 2022-06-09 at 21 04 31@2x" src="https://user-images.githubusercontent.com/6018455/172842719-7ed928ab-4664-41db-863b-5ef158ec1dc7.png"> -->
