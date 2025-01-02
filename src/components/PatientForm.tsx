import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  medical_history: z.string().optional(),
  sex: z.string().optional(),
  age: z.number().int().positive().optional(),
  medical_record_number: z.string().optional(),
  age_group: z.string().optional(),
  consultation_reason: z.string().optional(),
  current_illness: z.string().optional(),
  personal_family_history: z.string().optional(),
  blood_pressure: z.string().optional(),
  heart_rate: z.number().int().positive().optional(),
  temperature: z.number().positive().optional(),
  respiratory_rate: z.number().int().positive().optional(),
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

export default function PatientForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      birth_date: "",
      address: "",
      medical_history: "",
      sex: "",
      age: undefined,
      medical_record_number: "",
      age_group: "",
      consultation_reason: "",
      current_illness: "",
      personal_family_history: "",
      blood_pressure: "",
      heart_rate: undefined,
      temperature: undefined,
      respiratory_rate: undefined,
      stomatological_exam: {
        lips: "",
        cheeks: "",
        upper_maxilla: "",
        lower_maxilla: "",
        tongue: "",
        palate: "",
        floor: "",
        lateral_cheeks: "",
        salivary_glands: "",
        oropharynx: "",
        atm: "",
        lymph_nodes: ""
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("patients").insert([values]);
      
      if (error) throw error;

      toast({
        title: "Paciente agregado",
        description: "El paciente ha sido agregado exitosamente.",
      });

      queryClient.invalidateQueries({ queryKey: ["patients"] });
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al agregar el paciente.",
      });
    }
  }

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="h-[60vh] mt-4 pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <FormControl>
                      <Input placeholder="Sexo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Edad"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo de Edad</FormLabel>
                    <FormControl>
                      <Input placeholder="Grupo de Edad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="medical_record_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Historia Médica</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de Historia Médica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consultation_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de Consulta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Motivo de Consulta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_illness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Padecimiento Actual</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Padecimiento Actual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medical_history"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antecedentes Médicos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Antecedentes Médicos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal_family_history"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antecedentes Personales y Familiares</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Antecedentes Personales y Familiares" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="blood_pressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión Arterial</FormLabel>
                    <FormControl>
                      <Input placeholder="Presión Arterial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heart_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia Cardíaca</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Frecuencia Cardíaca"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Temperatura"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="respiratory_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia Respiratoria</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Frecuencia Respiratoria"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold">Examen del Sistema Estomatognático</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stomatological_exam.lips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. Labios</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de labios" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stomatological_exam.cheeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Mejillas</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de mejillas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stomatological_exam.upper_maxilla"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>3. Maxilar Superior</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del maxilar superior" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stomatological_exam.lower_maxilla"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4. Maxilar Inferior</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del maxilar inferior" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stomatological_exam.tongue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>5. Lengua</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de la lengua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stomatological_exam.palate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>6. Paladar</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del paladar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stomatological_exam.floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>7. Piso</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del piso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stomatological_exam.lateral_cheeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>8. Carrillos</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de los carrillos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stomatological_exam.salivary_glands"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>9. Glándulas Salivales</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de las glándulas salivales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stomatological_exam.oropharynx"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>10. Oro Faringe</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de la oro faringe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stomatological_exam.atm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>11. A.T.M.</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de la A.T.M." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stomatological_exam.lymph_nodes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>12. Ganglios</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción de los ganglios" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 space-x-2 flex justify-end">
              <Button type="submit">Guardar Paciente</Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}

