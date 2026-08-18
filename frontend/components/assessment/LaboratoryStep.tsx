"use client";

interface LaboratoryStepProps {
  formData: {
    glucose: string;
    cholesterol: string;
    hba1c: string;
    systolicBP: string;
    diastolicBP: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function LaboratoryStep({
  formData,
  handleChange,
}: LaboratoryStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Laboratory Values
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Glucose <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                type="number"
                name="glucose"
                value={formData.glucose}
                onChange={handleChange}
                placeholder="e.g. 95"
                min={40}
                max={600}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                mg/dL
                </span>
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Total Cholesterol <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                type="number"
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
                placeholder="e.g. 180"
                min={50}
                max={500}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                mg/dL
                </span>
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                HbA1c <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                type="number"
                step="0.1"
                name="hba1c"
                value={formData.hba1c}
                onChange={handleChange}
                placeholder="e.g. 5.4"
                min={3}
                max={20}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                %
                </span>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Blood Pressure (mmHg)
          </label>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Systolic Blood Pressure <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                    <input
                    type="number"
                    name="systolicBP"
                    value={formData.systolicBP}
                    onChange={handleChange}
                    placeholder="e.g. 120"
                    min={50}
                    max={300}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    mmHg
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Diastolic Blood Pressure <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                    <input
                    type="number"
                    name="diastolicBP"
                    value={formData.diastolicBP}
                    onChange={handleChange}
                    placeholder="e.g. 80"
                    min={30}
                    max={200}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    mmHg
                    </span>
                </div>
            </div>
        </div>

      </div>
    </>
  );
}