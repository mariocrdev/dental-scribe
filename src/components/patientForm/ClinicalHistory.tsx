import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ClinicalHistory() {
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <DialogHeader>
        <DialogTitle>Historia Clinica</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="consultation_reason">Motivo de Consulta</Label>
          <Textarea
            id="consultation_reason"
            name="consultation_reason"
            placeholder="Anotar la causa del problema en la versión del informante"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current_illness">Enfermedad o Problema Actual</Label>
          <Textarea
            id="current_illness"
            name="current_illness"
            placeholder="Registrar síntomas: cronología, localización, características, intensidad, causa aparente, síntomas asociados, evolución, estado actual"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="personal_family_history">Antecedentes Personales y Familiares</Label>
          <Textarea id="personal_family_history" name="personal_family_history" required />
        </div>
      </div>
    </div>
  );
}

