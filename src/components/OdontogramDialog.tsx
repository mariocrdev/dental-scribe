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

const TOTAL_TEETH = 32;

export const OdontogramDialog = ({ patientId, open, onOpenChange }: OdontogramDialogProps) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [condition, setCondition] = useState("");

  const { data: dentalRecords, isLoading } = useQuery({
    queryKey: ["dental-records", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dental_records")
        .select("*")
        .eq("patient_id", patientId);
      
      if (error) throw error;
      return data;
    },
  });

  const handleToothClick = async (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const record = dentalRecords?.find(r => r.tooth_number === toothNumber);
    setCondition(record?.condition || "");
  };

  const handleSaveCondition = async () => {
    if (!selectedTooth || !condition) return;

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
          });

        if (error) throw error;
      }

      toast.success("Registro dental guardado exitosamente");
      setSelectedTooth(null);
      setCondition("");
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
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: TOTAL_TEETH }, (_, i) => {
                const toothNumber = i + 1;
                const record = dentalRecords?.find(r => r.tooth_number === toothNumber);
                return (
                  <Button
                    key={toothNumber}
                    variant={selectedTooth === toothNumber ? "default" : "outline"}
                    className="h-16 w-16"
                    onClick={() => handleToothClick(toothNumber)}
                  >
                    <div className="text-center">
                      <div className="font-bold">{toothNumber}</div>
                      {record && (
                        <div className="text-xs truncate max-w-[60px]">
                          {record.condition}
                        </div>
                      )}
                    </div>
                  </Button>
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
                <Button onClick={handleSaveCondition}>Guardar</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};