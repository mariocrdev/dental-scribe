import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { PatientFormProps } from "@/types/patient";
import { ScrollArea } from "./ui/scroll-area";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import * as z from "zod";
import { PatientBasicInfo } from "@/components/patientForm/PatientBasicInfo";
import { ClinicalHistory } from "@/components/patientForm/ClinicalHistory";
import { StomatologicalExam } from "@/components/patientForm/StomatologicalExam";
import { VitalSigns } from "@/components/patientForm/VitalSigns";

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
    const [stomatologicalExamValues, setStomatologicalExamValues] = useState<Record<string, string>>({});
    const [vitalSignsValues, setVitalSignsValues] = useState<Record<string, string>>({});

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
            vital_signs: vitalSignsValues,
            stomatological_exam: stomatologicalExamValues
        };

        try {
            patientSchema.parse(patient);

            const { data, error } = await supabase
                .from("patients")
                .insert(patient)
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

                formRef.current.reset();
                setStomatologicalExamValues({});
                setVitalSignsValues({});
                onSuccess?.();
            } else {
                console.error("No data returned from Supabase");
                throw new Error("No se recibió confirmación de la inserción");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
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
            <ScrollArea className="h-[75vh] mt-4 pr-4">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 m-2">
                    <PatientBasicInfo />
                    <ClinicalHistory />

                    <div className="grid grid-cols-2 space-y-4 border rounded-lg p-4">
                        <StomatologicalExam
                            fieldValues={stomatologicalExamValues}
                            onFieldValuesChange={setStomatologicalExamValues}
                        />
                        <VitalSigns
                            fieldValues={vitalSignsValues}
                            onFieldValuesChange={setVitalSignsValues}
                        />
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
