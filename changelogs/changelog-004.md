---
title: 🚀 Introducing API for bookmarking
slug: changelog-004
publishedAt: 2023-06-15
image: changelog-004.webp
---

### New Features

- **API for Bookmarking**: We are happy to announce the introduction of our first API endpoint dedicated to adding bookmarks. Now, you can seamlessly integrate bookmarking functionality into your workflows using our API with your **API key**.

### Getting your Team's API Key

To generate an **API key**, follow these simple steps:

1. Go to the "Settings" page of your team in [digest.club](https://digest.club/).
2. Click on "Create New" to generate a new API key.
3. The API key will be generated, and you can copy it to your clipboard by clicking on the icon in the input.

### Adding a Bookmark via API

To add a bookmark via the API, make an HTTP **POST** request to this endpoint: _/api/bookmark_.

Include the bookmark URL in the request body under the **linkUrl** field. Additionally, to authenticate yourself with the API, pass the API key in the _"Authorization"_ header with the _"Bearer "_ prefix.

```
Method: POST
Endpoint: https://www.digest.club/api/bookmark
Headers:
- Authorization: Bearer YOUR_API_KEY

Body:
  {
  "linkUrl": "https://www.example.com"
  }
```

Here's an example using cURL:

```bash
curl -X POST https://www.digest.club/api/bookmark \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d "linkUrl=https://www.example.com"
```

## Integration Possibilities

The API for Bookmarking opens up possibilities for integrating Digest.club into your workflows. Whether you want to automate bookmarking or sync Digests with other platforms, the API provides the flexibility you need.

Happy digesting! 🚀
