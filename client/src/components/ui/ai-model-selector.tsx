import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Sparkles, Zap } from "lucide-react";

interface AIModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface AIModelOption {
  id: string;
  name: string;
  provider: string;
}

const FALLBACK_MODELS: AIModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "o3-mini", name: "O3 Mini", provider: "OpenAI" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "gemini-flash", name: "Gemini Flash", provider: "Google" },
];

const getModelIcon = (provider: string) => {
  switch (provider.toLowerCase()) {
    case "anthropic":
      return Sparkles;
    case "google":
      return Zap;
    case "openai":
    default:
      return Brain;
  }
};

export function AIModelSelector({ value, onChange, className }: AIModelSelectorProps) {
  const [models, setModels] = useState<AIModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadModels = async () => {
      try {
        const response = await fetch("/api/ai-models", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load models (${response.status})`);
        }
        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data.filter((item): item is AIModelOption => (
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.provider === "string"
            ))
          : [];

        if (!normalized.length) {
          throw new Error("No models returned");
        }

        if (isMounted) {
          setModels(normalized);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (isMounted) {
          setModels(FALLBACK_MODELS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadModels();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const displayModels = models.length ? models : FALLBACK_MODELS;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {(() => {
            const model = displayModels.find(m => m.id === value);
            return model ? (
              <div className="flex items-center space-x-2">
                {(() => {
                  const Icon = getModelIcon(model.provider);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span>{model.name}</span>
              </div>
            ) : (
              <span>{isLoading ? "Loading models..." : "Select model..."}</span>
            );
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Loading models...
          </SelectItem>
        ) : (
          displayModels.map((model) => {
            const Icon = getModelIcon(model.provider);
            return (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-slate-500">{model.provider}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
}
