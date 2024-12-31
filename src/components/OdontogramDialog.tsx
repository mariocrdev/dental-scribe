import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
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
      console.log("Fetching dental records for patient:", patientId);
      const { data, error } = await supabase
        .from("dental_records")
        .select("*")
        .eq("patient_id", patientId);
      
      if (error) {
        console.error("Error fetching dental records:", error);
        throw error;
      }
      
      console.log("Fetched dental records:", data);
      return data;
    },
    enabled: !!patientId && open,
  });

  useEffect(() => {
    if (dentalRecords) {
      console.log("Updating teeth data from records:", dentalRecords);
      const newTeethData: Record<number, ToothData> = {};
      dentalRecords.forEach((record) => {
        newTeethData[record.tooth_number] = {
          sections: record.sections as Record<string, string> || {},
          condition: record.condition || "",
        };
      });
      console.log("New teeth data:", newTeethData);
      setTeethData(newTeethData);
    }
  }, [dentalRecords]);

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const record = dentalRecords?.find(r => r.tooth_number === toothNumber);
    setCondition(record?.condition || "");
  };

  const handleSectionClick = async (section: string) => {
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

    try {
      const existingRecord = dentalRecords?.find(r => r.tooth_number === selectedTooth);
      const sections = updatedTeethData[selectedTooth].sections;

      if (existingRecord) {
        const { error } = await supabase
          .from("dental_records")
          .update({ sections })
          .eq("id", existingRecord.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("dental_records")
          .insert({
            patient_id: patientId,
            tooth_number: selectedTooth,
            sections,
            condition: "",
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving dental record:", error);
      toast.error("Error al guardar el color del diente");
    }
  };

  const handleSaveCondition = async () => {
    if (!selectedTooth || !condition || !patientId) {
      toast.error("Por favor seleccione un diente y una condición");
      return;
    }

    try {
      const existingRecord = dentalRecords?.find(r => r.tooth_number === selectedTooth);

      if (existingRecord) {
        const { error } = await supabase
          .from("dental_records")
          .update({ condition })
          .eq("id", existingRecord.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("dental_records")
          .insert({
            patient_id: patientId,
            tooth_number: selectedTooth,
            condition,
            sections: teethData[selectedTooth]?.sections || {},
          });

        if (error) throw error;
      }

      toast.success("Condición guardada exitosamente");
    } catch (error) {
      console.error("Error saving dental record:", error);
      toast.error("Error al guardar la condición");
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
          <div className="grid gap-6">
            <ColorPicker
              colors={COLORS}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />

            <div className="grid grid-cols-8 gap-x-2 gap-y-4">
              {Array.from({ length: TOTAL_TEETH }, (_, i) => {
                const toothNumber = i + 1;
                return (
                  <div
                    key={toothNumber}
                    className={`${
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
                <Button onClick={handleSaveCondition}>Guardar Condición</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

