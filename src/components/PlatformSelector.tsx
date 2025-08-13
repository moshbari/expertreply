import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageCircle, Linkedin, Facebook, Twitter } from "lucide-react";

interface PlatformSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const platforms = [
  { id: "reddit", label: "Reddit", icon: MessageCircle },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "twitter", label: "X (Twitter)", icon: Twitter },
];

const PlatformSelector = ({ value, onValueChange }: PlatformSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Platform</Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-4"
      >
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.id} className="flex items-center space-x-2">
              <RadioGroupItem value={platform.id} id={platform.id} />
              <Label
                htmlFor={platform.id}
                className="flex items-center gap-2 cursor-pointer font-medium"
              >
                <Icon className="h-4 w-4" />
                {platform.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default PlatformSelector;