import { openWebuiDefaultFields } from "./component";

import { httpProxy } from "utils/proxy/http";
import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";

const logger = createLogger("openwebuiProxyHandler");

async function requestEndpoint(apiBaseUrl, action, apiKey) {
  const request = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  };
  const apiUrl = `${apiBaseUrl}/${action}`;
  const [status, , data] = await httpProxy(apiUrl, request);
  if (status !== 200) {
    logger.debug(`HTTP ${status} performing XMLRequest for ${action}`, data);
    throw new Error(`Failed fetching '${action}'`);
  }
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch (e) {
    logger.debug(`Failed parsing ${action} response:`, e);
    throw new Error(`Failed parsing '${action}' response`);
  }

  return jsonData;
}

export default async function openwebuiProxyHandler(req, res) {
  const { group, service, index } = req.query;
  const serviceWidget = await getServiceWidget(group, service, index);

  if (!serviceWidget) {
    res.status(500).json({ error: { message: "Service widget not found" } });
    return;
  }

  if (!serviceWidget.url) {
    res.status(500).json({ error: { message: "Service widget url not configured" } });
    return;
  }

  const serviceWidgetUrl = new URL(serviceWidget.url);
  const apiBaseUrl = `${serviceWidgetUrl.protocol}//${serviceWidgetUrl.hostname}${serviceWidgetUrl.port ? ':' + serviceWidgetUrl.port : ''}/api`;

  if (!serviceWidget.fields?.length > 0) {
    serviceWidget.fields = openWebuiDefaultFields;
  }
  const requestModels = ["models"].some((field) => serviceWidget.fields?.includes(field));

  await Promise.all([
    requestEndpoint(apiBaseUrl, "v1/users/user/settings", serviceWidget.key),
    requestModels ? requestEndpoint(apiBaseUrl, "models", serviceWidget.key) : null,
  ])
  .then(([settingsResponse, modelResponse]) => {
    res.status(200).json({
      openwebui: {
        models: modelResponse || undefined,
        settings: settingsResponse || undefined,
      }
    });
  })
  .catch((error) => {
    res.status(500).json({ error: { message: error.message } });
  });
}
