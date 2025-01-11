import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { stomatologicalExamTranslations } from "@/utils/translations";

export function StomatologicalExam() {
  const [selectedField, setSelectedField] = useState("");
  const [fieldValues, setFieldValues] = useState({
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
    lymph_nodes: "",
  });

  const handleSelectChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleTextareaChange = (event) => {
    const { name, value } = event.target;
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 border rounded-lg p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stomatological_exam_field">Examen del sistema Estomatognático</Label>
              <select
                id="stomatological_exam_field"
                onChange={handleSelectChange}
                value={selectedField}
                className="border p-2 rounded w-full"
              >
                <option value="">Seleccionar...</option>
                {Object.entries(stomatologicalExamTranslations).map(([key, label], index) => (
                  <option key={key} value={key}>
                    {`${index + 1}. ${label}`}
                  </option>
                ))}
              </select>
            </div>

            {selectedField && (
              <div className="space-y-2">
                <Label htmlFor={selectedField}>
                  {`Descripción de ${stomatologicalExamTranslations[selectedField]}`}
                </Label>
                <Textarea
                  id={selectedField}
                  name={selectedField}
                  placeholder={`Ingrese la descripción de ${stomatologicalExamTranslations[selectedField]}`}
                  value={fieldValues[selectedField]}
                  onChange={handleTextareaChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            )}

            <div className="mt-8 space-y-2">
              <h3 className="text-lg font-semibold">Resumen</h3>
              <ul className="space-y-1">
                {Object.entries(fieldValues).map(([key, value]) => (
                  value && (
                    <li key={key} className="break-words w-full">
                      <strong>{stomatologicalExamTranslations[key]}:</strong> {value}
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

