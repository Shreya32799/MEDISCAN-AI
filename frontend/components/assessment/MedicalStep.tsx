"use client";

interface MedicalStepProps {
  formData: {
    diabetes: string;
    hypertension: string;
    heartDisease: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function MedicalStep({
  formData,
  handleChange,
}: MedicalStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Medical History
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            Family History of Diabetes
          </label>

          <select
            name="diabetes"
            value={formData.diabetes}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Hypertension
          </label>

          <select
            name="hypertension"
            value={formData.hypertension}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Family History of Heart Disease
          </label>

          <select
            name="heartDisease"
            value={formData.heartDisease}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
      </div>
    </>
  );
}