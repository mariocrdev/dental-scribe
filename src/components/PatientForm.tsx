import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { PatientFormProps } from "@/types/patient";
import { ScrollArea } from "./ui/scroll-area";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import * as z from "zod";

// Definir esquema de validación con Zod
const patientSchema = z.object({
    first_name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    last_name: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres." }),
    sex: z.enum(["M", "F", "O"]).optional(), // Sexo debe ser M, F u O
    age: z.number().int().positive().optional(),
    age_group: z.string().optional(),
    phone: z.number({ message: "Numero inválido" }).positive().optional(),
    email: z.string().email({ message: "Correo electrónico inválido" }).optional(),
    address: z.string().optional(),
    medical_history: z.string().optional(),
    current_illness: z.string().optional(),
    personal_family_history: z.string().optional(),
    vital_signs: z.object({
        blood_pressure: z.string().optional(),
        heart_rate: z.number().int().positive().optional(),
        temperature: z.number().positive().optional(),
        respiratory_rate: z.number().int().positive().optional()
    }).optional(),
    stomatological_exam: z.object({
        lips: z.string().optional(),
        cheeks: z.string().optional(),
        upper_maxilla: z.string().optional(),
        lower_maxilla: z.string().optional(),
        tongue: z.string().optional(),
        palate: z.string().optional(),
        floor: z.string().optional(),
        lateral_cheeks: z.string().optional(),
        salivary_glands: z.string().optional(),
        oropharynx: z.string().optional(),
        atm: z.string().optional(),
        lymph_nodes: z.string().optional()
    }).optional(),

});

const PatientForm = ({ onSuccess }: PatientFormProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!formRef.current) {
            console.error("Form reference is not available");
            setLoading(false);
            return;
        }

        const formData = new FormData(formRef.current);
        const patient = {
            first_name: String(formData.get("first_name")),
            last_name: String(formData.get("last_name")),
            sex: formData.get("sex") ? String(formData.get("sex")) : undefined,
            age: formData.get("age") ? Number(formData.get("age")) : undefined,
            age_group: formData.get("age_group") ? String(formData.get("age_group")) : undefined,
            phone: formData.get("phone") ? Number(formData.get("phone")) : undefined,
            email: formData.get("email") ? String(formData.get("email")) : undefined,
            address: formData.get("address") ? String(formData.get("address")) : undefined,
            medical_history: formData.get("medical_history") ? String(formData.get("medical_history")) : undefined,
            current_illness: formData.get("current_illness") ? String(formData.get("current_illness")) : undefined,
            personal_family_history: formData.get("personal_family_history") ? String(formData.get("personal_family_history")) : undefined,
            vital_signs: {
                blood_pressure: formData.get("blood_pressure") ? String(formData.get("blood_pressure")) : undefined,
                heart_rate: formData.get("heart_rate") ? Number(formData.get("heart_rate")) : undefined,
                temperature: formData.get("temperature") ? Number(formData.get("temperature")) : undefined,
                respiratory_rate: formData.get("respiratory_rate") ? Number(formData.get("respiratory_rate")) : undefined,
            },
            stomatological_exam: {
                lips: formData.get("lips") ? String(formData.get("lips")) : undefined,
                cheeks: formData.get("cheeks") ? String(formData.get("cheeks")) : undefined,
                upper_maxilla: formData.get("upper_maxilla") ? String(formData.get("upper_maxilla")) : undefined,
                lower_maxilla: formData.get("lower_maxilla") ? String(formData.get("lower_maxilla")) : undefined,
                tongue: formData.get("tongue") ? String(formData.get("tongue")) : undefined,
                palate: formData.get("palate") ? String(formData.get("palate")) : undefined,
                floor: formData.get("floor") ? String(formData.get("floor")) : undefined,
                lateral_cheeks: formData.get("lateral_cheeks") ? String(formData.get("lateral_cheeks")) : undefined,
                salivary_glands: formData.get("salivary_glands") ? String(formData.get("salivary_glands")) : undefined,
                oropharynx: formData.get("oropharynx") ? String(formData.get("oropharynx")) : undefined,
                atm: formData.get("atm") ? String(formData.get("atm")) : undefined,
                lymph_nodes: formData.get("lymph_nodes") ? String(formData.get("lymph_nodes")) : undefined,
            },
        };

        try {
            // Validar datos con Zod
            patientSchema.parse(patient);

            // Enviar datos a Supabase
            const { data, error } = await supabase
                .from("patients")
                .insert([patient])
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

                // Resetear formulario
                formRef.current.reset();

                // Llamar a la función de éxito si se proporciona
                onSuccess?.();
            } else {
                console.error("No data returned from Supabase");
                throw new Error("No se recibió confirmación de la inserción");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Mostrar errores de validación
                error.errors.forEach((err) => {
                    toast({
                        title: "Error de validación",
                        description: err.message,
                        variant: "destructive",
                    });
                });
            } else {
                console.error("Error al guardar el paciente:", error);
                toast({
                    title: "Error",
                    description: "Hubo un error al registrar el paciente. Por favor, intente nuevamente.",
                    variant: "destructive",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <DialogHeader>
                <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] mt-4 pr-4">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 m-2">
                    <div className="border rounded-lg p-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Edad</Label>
                                <Input id="age" name="age"/>
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
            </ScrollArea>
        </div>
    );
};

export default PatientForm;