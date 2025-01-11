import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { stomatologicalExamTranslations } from "@/utils/translations";

interface StomatologicalExamProps {
  fieldValues: Record<string, string>;
  onFieldValuesChange: (values: Record<string, string>) => void;
}

export function StomatologicalExam({ fieldValues, onFieldValuesChange }: StomatologicalExamProps) {
  const [selectedField, setSelectedField] = useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(event.target.value);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newFieldValues = { ...fieldValues, [name]: value };
    onFieldValuesChange(newFieldValues);
  };

  return (


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
              value={fieldValues[selectedField] || ""}
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

  );
}