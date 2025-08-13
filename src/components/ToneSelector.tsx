import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ToneSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const tones = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
  { value: "storytelling", label: "Storytelling" },
];

const ToneSelector = ({ value, onValueChange }: ToneSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Tone</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="rounded-2xl h-12">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          {tones.map((tone) => (
            <SelectItem key={tone.value} value={tone.value}>
              {tone.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ToneSelector;