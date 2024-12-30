interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker = ({ colors, selectedColor, onColorSelect }: ColorPickerProps) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium">Color:</span>
      <div className="flex gap-1">
        {colors.map((color) => (
          <div
            key={color}
            className={`w-6 h-6 rounded cursor-pointer border ${
              selectedColor === color ? 'border-black' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
};