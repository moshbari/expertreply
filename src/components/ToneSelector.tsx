import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Palette, Users, Heart, Brain, BookOpen, Smile } from "lucide-react";

interface ToneSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const tones = [
  { value: "casual", label: "Casual", icon: Users, description: "Relaxed and friendly" },
  { value: "professional", label: "Professional", icon: Brain, description: "Formal and authoritative" },
  { value: "friendly", label: "Friendly", icon: Smile, description: "Warm and approachable" },
  { value: "empathetic", label: "Empathetic", icon: Heart, description: "Understanding and supportive" },
  { value: "storytelling", label: "Storytelling", icon: BookOpen, description: "Narrative and engaging" },
];

const ToneSelector = ({ value, onValueChange }: ToneSelectorProps) => {
  const selectedTone = tones.find(tone => tone.value === value);
  
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-on-surface flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        Select Tone
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-16 rounded-3xl border-2 border-outline-variant hover:border-outline bg-surface-container">
          <div className="flex items-center gap-3 w-full">
            {selectedTone && (
              <>
                <div className="p-2 rounded-xl bg-primary/10">
                  <selectedTone.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <SelectValue />
                  <p className="text-xs text-on-surface-variant">{selectedTone.description}</p>
                </div>
              </>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-2xl shadow-elevation-3 bg-white dark:bg-gray-800 z-50">
          {tones.map((tone) => {
            const Icon = tone.icon;
            return (
              <SelectItem key={tone.value} value={tone.value} className="rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{tone.label}</div>
                    <div className="text-xs text-on-surface-variant">{tone.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ToneSelector;