import { ToothData } from "@/types/odontogram";

interface ToothRendererProps {
  toothNumber: number;
  toothData: ToothData;
  onSectionClick: (section: string) => void;
}

export const ToothRenderer = ({ toothNumber, toothData, onSectionClick }: ToothRendererProps) => {
  return (
    <div className="relative w-16 h-16 mx-4">
      {/* Tooth Number */}
      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 font-bold text-sm">
        {toothNumber}
      </div>
      
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
      
      {/* Condition Text */}
      {toothData.condition && (
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-xs truncate max-w-[80px] text-center">
          {toothData.condition}
        </div>
      )}
    </div>
  );
};