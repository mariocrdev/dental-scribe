import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { OdontogramDialog } from "./OdontogramDialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface PatientDetailsDialogProps {
  patient: Tables<"patients"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PatientDetailsDialog = ({ patient, open, onOpenChange }: PatientDetailsDialogProps) => {
  const [showOdontogram, setShowOdontogram] = useState(false);

  if (!patient) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Detalles del Paciente</DialogTitle>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogHeader>
          
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium text-gray-500">Nombre Completo</dt>
                    <dd>{patient.first_name} {patient.last_name}</dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-500">Fecha de Nacimiento</dt>
                    <dd>
                      {patient.birth_date ? format(new Date(patient.birth_date), 'dd/MM/yyyy') : 'No especificada'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-500">Teléfono</dt>
                    <dd>{patient.phone || 'No especificado'}</dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-500">Email</dt>
                    <dd>{patient.email || 'No especificado'}</dd>
                  </div>
                  
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-500">Dirección</dt>
                    <dd>{patient.address || 'No especificada'}</dd>
                  </div>
                  
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-500">Historia Médica</dt>
                    <dd className="whitespace-pre-wrap">
                      {patient.medical_history || 'No especificada'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <OdontogramDialog
        patientId={patient.id}
        open={showOdontogram}
        onOpenChange={setShowOdontogram}
      />
    </>
  );
};