import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { OdontogramDialog } from "./OdontogramDialog";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientDetailsDialogProps {
  patient: Tables<"patients"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PatientDetailsDialog = ({ patient, open, onOpenChange }: PatientDetailsDialogProps) => {
  const [showOdontogram, setShowOdontogram] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Tables<"patients"> | null>(null);
  const { toast } = useToast();

  if (!patient) return null;

  const handleEdit = () => {
    setEditedPatient(patient);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPatient(null);
  };

  const handleSave = async () => {
    if (!editedPatient) return;

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          first_name: editedPatient.first_name,
          last_name: editedPatient.last_name,
          birth_date: editedPatient.birth_date,
          phone: editedPatient.phone,
          email: editedPatient.email,
          address: editedPatient.address,
          medical_history: editedPatient.medical_history,
        })
        .eq("id", patient.id);

      if (error) throw error;

      toast({
        title: "Paciente actualizado",
        description: "Los datos del paciente han sido actualizados exitosamente.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al actualizar los datos del paciente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof Tables<"patients">, value: string) => {
    if (!editedPatient) return;
    setEditedPatient({ ...editedPatient, [field]: value });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Detalles del Paciente</DialogTitle>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </DialogHeader>
          
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium text-gray-500">Nombre Completo</dt>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editedPatient?.first_name || ""}
                          onChange={(e) => handleInputChange("first_name", e.target.value)}
                          placeholder="Nombre"
                        />
                        <Input
                          value={editedPatient?.last_name || ""}
                          onChange={(e) => handleInputChange("last_name", e.target.value)}
                          placeholder="Apellido"
                        />
                      </div>
                    ) : (
                      <dd>{patient.first_name} {patient.last_name}</dd>
                    )}
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-500">Fecha de Nacimiento</dt>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedPatient?.birth_date || ""}
                        onChange={(e) => handleInputChange("birth_date", e.target.value)}
                      />
                    ) : (
                      <dd>
                        {patient.birth_date ? format(new Date(patient.birth_date), 'dd/MM/yyyy') : 'No especificada'}
                      </dd>
                    )}
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-500">Teléfono</dt>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editedPatient?.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Teléfono"
                      />
                    ) : (
                      <dd>{patient.phone || 'No especificado'}</dd>
                    )}
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-500">Email</dt>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedPatient?.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Email"
                      />
                    ) : (
                      <dd>{patient.email || 'No especificado'}</dd>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-500">Dirección</dt>
                    {isEditing ? (
                      <Input
                        value={editedPatient?.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Dirección"
                      />
                    ) : (
                      <dd>{patient.address || 'No especificada'}</dd>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-500">Historia Médica</dt>
                    {isEditing ? (
                      <Textarea
                        value={editedPatient?.medical_history || ""}
                        onChange={(e) => handleInputChange("medical_history", e.target.value)}
                        placeholder="Historia Médica"
                      />
                    ) : (
                      <dd className="whitespace-pre-wrap">
                        {patient.medical_history || 'No especificada'}
                      </dd>
                    )}
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