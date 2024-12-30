import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OdontogramDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ToothSection {
  name: 'oclusal' | 'mesial' | 'distal' | 'palatino' | 'vestibular';
  color: string;
}

interface ToothData {
  sections: Record<string, string>; // section name -> color
  condition: string;
}

const TOTAL_TEETH = 32;
const DEFAULT_SECTIONS: ToothSection[] = [
  { name: 'oclusal', color: '#FFFFFF' },
  { name: 'mesial', color: '#FFFFFF' },
  { name: 'distal', color: '#FFFFFF' },
  { name: 'palatino', color: '#FFFFFF' },
  { name: 'vestibular', color: '#FFFFFF' },
];

const COLORS = [
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#FEC6A1', // Soft Orange
  '#E5DEFF', // Soft Purple
  '#FFDEE2', // Soft Pink
  '#FDE1D3', // Soft Peach
  '#D3E4FD', // Soft Blue
  '#F1F0FB', // Soft Gray
  '#FFFFFF', // White
];

export const OdontogramDialog = ({ patientId, open, onOpenChange }: OdontogramDialogProps) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [condition, setCondition] = useState("");
  const [teethData, setTeethData] = useState<Record<number, ToothData>>({});

  const { data: dentalRecords, isLoading } = useQuery({
    queryKey: ["dental-records", patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const { data, error } = await supabase
        .from("dental_records")
        .select("*")
        .eq("patient_id", patientId);
      if (error) throw error;
      return data;
    },
    enabled: !!patientId,
    onSuccess: (data) => {
      // Initialize teeth data from records
      const newTeethData: Record<number, ToothData> = {};
      data.forEach((record) => {
        newTeethData[record.tooth_number] = {
          sections: record.sections || {},
          condition: record.condition || "",
        };
      });
      setTeethData(newTeethData);
    },
  });

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const record = dentalRecords?.find(r => r.tooth_number === toothNumber);
    setCondition(record?.condition || "");
  };

  const handleSectionClick = (section: string) => {
    if (selectedTooth === null) return;
    setSelectedSection(section);
    
    // Update the color for the selected section
    const updatedTeethData = {
      ...teethData,
      [selectedTooth]: {
        sections: {
          ...(teethData[selectedTooth]?.sections || {}),
          [section]: selectedColor,
        },
        condition: teethData[selectedTooth]?.condition || "",
      },
    };
    setTeethData(updatedTeethData);
  };

  const handleSaveCondition = async () => {
    if (!selectedTooth || !condition || !patientId) {
      toast.error("Por favor seleccione un diente y una condición");
      return;
    }

    try {
      const existingRecord = dentalRecords?.find(r => r.tooth_number === selectedTooth);
      const sections = teethData[selectedTooth]?.sections || {};

      if (existingRecord) {
        const { error } = await supabase
          .from("dental_records")
          .update({ condition, sections })
          .eq("id", existingRecord.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("dental_records")
          .insert({
            patient_id: patientId,
            tooth_number: selectedTooth,
            condition,
            sections,
          });

        if (error) throw error;
      }

      toast.success("Registro dental guardado exitosamente");
    } catch (error) {
      console.error("Error saving dental record:", error);
      toast.error("Error al guardar el registro dental");
    }
  };

  const renderToothSections = (toothNumber: number) => {
    const toothData = teethData[toothNumber] || { sections: {}, condition: "" };
    
    return (
      <div className="relative w-16 h-16">
        {/* Oclusal (Center) */}
        <div
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['oclusal'] || '#FFFFFF' }}
          onClick={() => handleSectionClick('oclusal')}
        />
        {/* Mesial (Top) */}
        <div
          className="absolute top-0 left-1/4 w-1/2 h-1/4 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['mesial'] || '#FFFFFF' }}
          onClick={() => handleSectionClick('mesial')}
        />
        {/* Distal (Bottom) */}
        <div
          className="absolute bottom-0 left-1/4 w-1/2 h-1/4 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['distal'] || '#FFFFFF' }}
          onClick={() => handleSectionClick('distal')}
        />
        {/* Palatino (Left) */}
        <div
          className="absolute top-1/4 left-0 w-1/4 h-1/2 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['palatino'] || '#FFFFFF' }}
          onClick={() => handleSectionClick('palatino')}
        />
        {/* Vestibular (Right) */}
        <div
          className="absolute top-1/4 right-0 w-1/4 h-1/2 border border-gray-300 cursor-pointer"
          style={{ backgroundColor: toothData.sections['vestibular'] || '#FFFFFF' }}
          onClick={() => handleSectionClick('vestibular')}
        />
        {/* Tooth Number */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 font-bold text-sm">
          {toothNumber}
        </div>
        {/* Condition Text */}
        {toothData.condition && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs truncate max-w-[60px]">
            {toothData.condition}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Odontograma</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Color Picker */}
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Color:</span>
              <div className="flex gap-1">
                {COLORS.map((color) => (
                  <div
                    key={color}
                    className={`w-6 h-6 rounded cursor-pointer border ${
                      selectedColor === color ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Teeth Grid */}
            <div className="grid grid-cols-8 gap-8">
              {Array.from({ length: TOTAL_TEETH }, (_, i) => {
                const toothNumber = i + 1;
                return (
                  <div
                    key={toothNumber}
                    className={`relative ${
                      selectedTooth === toothNumber ? 'ring-2 ring-blue-500 rounded-lg' : ''
                    }`}
                    onClick={() => handleToothClick(toothNumber)}
                  >
                    {renderToothSections(toothNumber)}
                  </div>
                );
              })}
            </div>

            {/* Condition Selector */}
            {selectedTooth && (
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="">Seleccionar condición</option>
                  <option value="Caries">Caries</option>
                  <option value="Obturado">Obturado</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Corona">Corona</option>
                  <option value="Puente">Puente</option>
                </select>
                <Button onClick={handleSaveCondition}>Guardar</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};