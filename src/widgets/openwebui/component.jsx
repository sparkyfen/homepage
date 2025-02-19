import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export const openWebuiDefaultFields = ["models"];

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const params = {
    key: widget.key
  };
  const { data: data, error: error } = useWidgetAPI(widget, "models", params);
  const [showModels] = useMemo(() => {
    // Default values if fields is not set
    if (!widget.fields) return [true];
    const hasModels = widget.fields?.includes("models") || false;
    return [hasModels];
  }, [widget.fields]);

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="openwebui.version" />
        {showModels && <Block label="openwebui.models" />}
      </Container>
    );
  }

  const { openwebui } = data;
  return (
    <Container service={service}>
      <Block 
        label="openwebui.version" 
        value={openwebui.settings.ui.version}
      />
      {showModels && (<Block 
        label="openwebui.models" 
        value={openwebui.models.data.length} 
      />)}
    </Container>
  );
}