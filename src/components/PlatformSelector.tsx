import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageCircle, Linkedin, Facebook, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const platforms = [
  { id: "reddit", label: "Reddit", icon: MessageCircle, color: "from-orange-500 to-red-500" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-700" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "from-blue-500 to-blue-600" },
  { id: "twitter", label: "X (Twitter)", icon: Twitter, color: "from-gray-800 to-black" },
];

const PlatformSelector = ({ value, onValueChange }: PlatformSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-on-surface">Choose Platform</Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="grid grid-cols-2 gap-4"
      >
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = value === platform.id;
          return (
            <div key={platform.id} className="relative">
              <RadioGroupItem value={platform.id} id={platform.id} className="sr-only" />
              <Label
                htmlFor={platform.id}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:shadow-elevation-2",
                  isSelected
                    ? "border-primary bg-primary-container text-primary-container-foreground shadow-elevation-2"
                    : "border-outline-variant bg-surface hover:border-outline"
                )}
              >
                <div className={cn(
                  "p-4 rounded-2xl bg-gradient-to-br shadow-elevation-1 transition-transform duration-300",
                  platform.color,
                  isSelected ? "scale-110" : "hover:scale-105"
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="font-medium text-center">{platform.label}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default PlatformSelector;