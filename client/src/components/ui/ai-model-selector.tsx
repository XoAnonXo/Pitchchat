import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Zap, Sparkles } from "lucide-react";

interface AIModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AIModelSelector({ value, onChange, className }: AIModelSelectorProps) {
  const models = [
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", icon: Brain },
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider: "Anthropic", icon: Sparkles },
    { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", provider: "Google", icon: Zap },
    { id: "grok-2-1212", name: "Grok 2", provider: "xAI", icon: Brain },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {(() => {
            const model = models.find(m => m.id === value);
            return model ? (
              <div className="flex items-center space-x-2">
                <model.icon className="w-4 h-4" />
                <span>{model.name}</span>
              </div>
            ) : (
              <span>Select model...</span>
            );
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center space-x-2">
              <model.icon className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-slate-500">{model.provider}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}