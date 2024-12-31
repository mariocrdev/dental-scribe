import { ToothData } from "@/types/odontogram";

interface ToothRendererProps {
  toothNumber: number;
  toothData: ToothData;
  onSectionClick: (section: string) => void;
}

export const ToothRenderer = ({ toothNumber, toothData, onSectionClick }: ToothRendererProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Tooth Number Section */}
      <div className="text-xs font-bold">
        {toothNumber}
      </div>
      
      {/* Tooth Diagram */}
      <div className="relative w-14 h-14">
        {/* Oclusal (Center) */}
        <div
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['oclusal'] || '#FFFFFF' }}
          onClick={() => onSectionClick('oclusal')}
        />
        {/* Mesial (Top) */}
        <div
          className="absolute top-0 left-1/4 w-1/2 h-1/4 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['mesial'] || '#FFFFFF' }}
          onClick={() => onSectionClick('mesial')}
        />
        {/* Distal (Bottom) */}
        <div
          className="absolute bottom-0 left-1/4 w-1/2 h-1/4 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['distal'] || '#FFFFFF' }}
          onClick={() => onSectionClick('distal')}
        />
        {/* Palatino (Left) */}
        <div
          className="absolute top-1/4 left-0 w-1/4 h-1/2 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['palatino'] || '#FFFFFF' }}
          onClick={() => onSectionClick('palatino')}
        />
        {/* Vestibular (Right) */}
        <div
          className="absolute top-1/4 right-0 w-1/4 h-1/2 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['vestibular'] || '#FFFFFF' }}
          onClick={() => onSectionClick('vestibular')}
        />
      </div>
      
      {/* Condition Text Section */}
      <div className="h-3 text-[10px] text-center">
        {toothData.condition}
      </div>
    </div>
  );
};

