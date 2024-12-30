import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ToothRenderer } from "./ToothRenderer";
import { ColorPicker } from "./ColorPicker";
import { COLORS, TOTAL_TEETH, ToothData } from "@/types/odontogram";

interface OdontogramDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    meta: {
      onSettled: (data) => {
        if (data) {
          const newTeethData: Record<number, ToothData> = {};
          data.forEach((record) => {
            newTeethData[record.tooth_number] = {
              sections: record.sections || {},
              condition: record.condition || "",
            };
          });
          setTeethData(newTeethData);
        }
      }
    }
  });

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const record = dentalRecords?.find(r => r.tooth_number === toothNumber);
    setCondition(record?.condition || "");
  };

  const handleSectionClick = (section: string) => {
    if (selectedTooth === null) return;
    setSelectedSection(section);
    
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
            <ColorPicker
              colors={COLORS}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />

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
                    <ToothRenderer
                      toothNumber={toothNumber}
                      toothData={teethData[toothNumber] || { sections: {}, condition: "" }}
                      onSectionClick={handleSectionClick}
                    />
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