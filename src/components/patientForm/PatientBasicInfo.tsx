import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PatientBasicInfo() {
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <DialogHeader>
        <DialogTitle>Datos del paciente</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre</Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido</Label>
          <Input id="last_name" name="last_name" required />
        </div>
        <div className="space-y-2 border rounded-lg p-4">
          <Label htmlFor="sex">Sexo</Label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input type="radio" id="male" name="sex" value="M" className="h-4 w-4" />
              <Label htmlFor="male">Masculino</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" id="female" name="sex" value="F" className="h-4 w-4" />
              <Label htmlFor="female">Femenino</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" id="other" name="sex" value="O" className="h-4 w-4" />
              <Label htmlFor="other">Otro</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Edad</Label>
          <Input id="age" name="age" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" name="address" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age_group">Grupo de Edad</Label>
          <Select id="age_group" name="age_group" required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menor1">Menor de 1 año</SelectItem>
              <SelectItem value="1-4">1 - 4 años</SelectItem>
              <SelectItem value="5-9">5 - 9 años</SelectItem>
              <SelectItem value="10-14">10 - 14 años</SelectItem>
              <SelectItem value="15-19">15 - 19 años</SelectItem>
              <SelectItem value="mayor20">Mayor de 20 años</SelectItem>
              <SelectItem value="embarazada">Embarazada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="medical_history">Historia Médica</Label>
        <Textarea id="medical_history" name="medical_history" />
      </div>
    </div>
  );
}

