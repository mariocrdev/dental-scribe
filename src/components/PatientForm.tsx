import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PatientForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const patient = {
      first_name: String(formData.get("first_name")),
      last_name: String(formData.get("last_name")),
      birth_date: formData.get("birth_date") ? String(formData.get("birth_date")) : null,
      sex: String(formData.get("sex")),
      age: formData.get("age") ? Number(formData.get("age")) : null,
      medical_record_number: String(formData.get("medical_record_number")),
      age_group: String(formData.get("age_group")),
      consultation_reason: String(formData.get("consultation_reason")),
      current_illness: String(formData.get("current_illness")),
      personal_family_history: String(formData.get("personal_family_history")),
      blood_pressure: String(formData.get("blood_pressure")),
      heart_rate: formData.get("heart_rate") ? Number(formData.get("heart_rate")) : null,
      temperature: formData.get("temperature") ? Number(formData.get("temperature")) : null,
      respiratory_rate: formData.get("respiratory_rate") ? Number(formData.get("respiratory_rate")) : null,
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      address: formData.get("address") ? String(formData.get("address")) : null,
      medical_history: formData.get("medical_history") ? String(formData.get("medical_history")) : null,
    };

    try {
      const { error } = await supabase.from("patients").insert([patient]);
      if (error) throw error;

      toast({
        title: "Paciente registrado",
        description: "El paciente ha sido registrado exitosamente.",
      });
      
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al registrar el paciente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre</Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido</Label>
          <Input id="last_name" name="last_name" required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sex">Sexo</Label>
          <Select name="sex" required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Edad</Label>
          <Input id="age" name="age" type="number" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medical_record_number">Nº Historia Clínica</Label>
          <Input id="medical_record_number" name="medical_record_number" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="age_group">Grupo de Edad</Label>
        <Select name="age_group" required>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="blood_pressure">Presión Arterial</Label>
          <Input id="blood_pressure" name="blood_pressure" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heart_rate">Frecuencia Cardíaca (min)</Label>
          <Input id="heart_rate" name="heart_rate" type="number" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperatura (°C)</Label>
          <Input id="temperature" name="temperature" type="number" step="0.1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="respiratory_rate">Frecuencia Respiratoria (min)</Label>
          <Input id="respiratory_rate" name="respiratory_rate" type="number" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medical_history">Historia Médica</Label>
        <Textarea id="medical_history" name="medical_history" />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar Paciente"
        )}
      </Button>
    </form>
  );
};

export default PatientForm;

