import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

const PatientForm = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Capturar los datos del formulario inmediatamente
        const formData = new FormData(e.currentTarget);
        const patientData = {
            first_name: String(formData.get("first_name")),
            last_name: String(formData.get("last_name")),
            birth_date: formData.get("birth_date") ? String(formData.get("birth_date")) : null,
            phone: formData.get("phone") ? String(formData.get("phone")) : null,
            email: formData.get("email") ? String(formData.get("email")) : null,
            address: formData.get("address") ? String(formData.get("address")) : null,
            medical_history: formData.get("medical_history") ? String(formData.get("medical_history")) : null,
            sex: formData.get("sex") ? String(formData.get("sex")) : null
        };

        try {
            const { data, error } = await supabase
                .from("patients")
                .insert([patientData])
                .select();

            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }

            if (data && data.length > 0) {
                console.log("Patient data saved successfully:", data[0]);
                toast({
                    title: "Paciente registrado",
                    description: "El paciente ha sido registrado exitosamente.",
                });

                // Reset form
                e.currentTarget.reset();
            } else {
                console.error("No data returned from Supabase");
                throw new Error("No se recibió confirmación de la inserción");
            }
        } catch (error) {
            console.error("Error al guardar el paciente:", error);
            toast({
                title: "Error",
                description: "Hubo un error al registrar el paciente. Por favor, intente nuevamente.",
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                    <Input id="birth_date" name="birth_date" type="date" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sex">Sexo</Label>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="male"
                                name="sex"
                                value="M"
                                className="h-4 w-4"
                            />
                            <Label htmlFor="male">Masculino</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="female"
                                name="sex"
                                value="F"
                                className="h-4 w-4"
                            />
                            <Label htmlFor="female">Femenino</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="other"
                                name="sex"
                                value="O"
                                className="h-4 w-4"
                            />
                            <Label htmlFor="other">Otro</Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" type="tel" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
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

