import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CustomColorPickerProps {
  onColorSelect: (color: string) => void;
}

export const CustomColorPicker = ({ onColorSelect }: CustomColorPickerProps) => {
  const [customColor, setCustomColor] = useState("#000000");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onColorSelect(newColor);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Color personalizado:</span>
      <Input
        type="color"
        value={customColor}
        onChange={handleColorChange}
        className="w-12 h-8 p-0 border-none"
      />
    </div>
  );
};