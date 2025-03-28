import {
  HeliconeRequest,
  MapperType,
  Provider,
} from "@/packages/llm-mapper/types";

const isAssistantRequest = (request: HeliconeRequest) => {
  return (
    request.request_body.hasOwnProperty("assistant_id") ||
    request.request_body.hasOwnProperty("metadata") ||
    request.response_body.hasOwnProperty("metadata") ||
    (Array.isArray(request.response_body.data) &&
      request.response_body.data.some((item: any) =>
        item.hasOwnProperty("metadata")
      ))
  );
};

export const getMapperTypeFromHeliconeRequest = (
  heliconeRequest: HeliconeRequest,
  model: string
) => {
  return getMapperType({
    model,
    provider: heliconeRequest.provider,
    path: heliconeRequest.target_url,
    isAssistant: isAssistantRequest(heliconeRequest),
  });
};

export const getMapperType = ({
  model,
  provider,
  path,
  isAssistant,
}: {
  model: string;
  provider: Provider;
  path?: string | null;
  isAssistant?: boolean;
}): MapperType => {
  if (/^gpt-3\.5-turbo-instruct/.test(model)) {
    return "openai-instruct";
  }

  if (
    /^mistralai\/Mistral-7B-Instruct-v\d+\.\d+$/.test(model) ||
    /^(ft:)?gpt-(4|3\.5|35)(?!-turbo-instruct)(-turbo)?(-\d{2}k)?(-\d{4})?/.test(
      model
    ) ||
    /^o1-(preview|mini)(-\d{4}-\d{2}-\d{2})?$/.test(model) ||
    /^meta-llama\/.*/i.test(model) ||
    provider === "OPENROUTER" ||
    provider === "CUSTOM" ||
    provider === "GROQ" ||
    provider === "TOGETHER" ||
    (provider as any) === "TOGETHERAI" ||
    path?.includes("oai2ant") ||
    model == "gpt-4-vision-preview" ||
    model == "gpt-4-1106-vision-preview"
  ) {
    return "openai-chat";
  }

  if (isAssistant) {
    return "openai-assistant";
  }

  if (model && model.toLowerCase().includes("gemini")) {
    return "gemini-chat";
  }

  if (model == "black-forest-labs/FLUX.1-schnell") {
    return "black-forest-labs-image";
  }

  if (model === "dall-e-3" || model === "dall-e-2") {
    return "openai-image";
  }

  if (/^text-moderation(-\[\w+\]|-\d+)?$/.test(model)) {
    return "openai-moderation";
  }

  if (/^text-embedding/.test(model)) {
    return "openai-embedding";
  }

  if (/^claude/.test(model)) {
    return "anthropic-chat";
  }

  return "unknown";
};
