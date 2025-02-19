import openwebuiProxyHandler from "./proxy";
const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: openwebuiProxyHandler,
  mappings: {
    models: {
      endpoint: "models"
    },
    settings: {
      endpoint: "v1/users/user/settings"
    }
  },
};
export default widget;