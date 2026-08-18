"use client";

interface LifestyleStepProps {
  formData: {
    smoking: string;
    alcohol: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function LifestyleStep({
  formData,
  handleChange,
}: LifestyleStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Lifestyle Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Smoking
          </label>

          <select
            name="smoking"
            value={formData.smoking}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Alcohol
          </label>

          <select
            name="alcohol"
            value={formData.alcohol}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
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