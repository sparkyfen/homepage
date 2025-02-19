---
title: Open-WebUI
description: Open-WebUI widget configuration
---

Learn more about [Open-WebUI](https://openwebui.com/).

Provides information from Open-WebUI. Create an API key in Open-Webui by opening the left panel, click your accoun, `Settings` -> `Account` -> `API keys` and then click "GENERATE API KEY". Note, this is different than the `JWT Token`.

Allowed fields: `["models", "version"]`.

```yaml
widget:
  type: openwebui
  url: http://host.or.ip:port
  key: YOUR_API_KEY
```