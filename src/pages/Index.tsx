import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Plus, Stethoscope } from "lucide-react";
import PatientForm from "@/components/PatientForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { OdontogramDialog } from "@/components/OdontogramDialog";
import { PatientDetailsDialog } from "@/components/PatientDetailsDialog";
import { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Tables<"patients"> | null>(null);
  const navigate = useNavigate();

  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients", search],
    queryFn: async () => {
      const query = supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Pacientes</CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <PatientForm />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Buscar pacientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid gap-4">
              {patients?.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedPatientId(patient.id)}
                        >
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Odontograma
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <OdontogramDialog
        patientId={selectedPatientId || ""}
        open={!!selectedPatientId}
        onOpenChange={(open) => !open && setSelectedPatientId(null)}
      />

      <PatientDetailsDialog
        patient={selectedPatient}
        open={!!selectedPatient}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      />
    </div>
  );
};

export default Index;