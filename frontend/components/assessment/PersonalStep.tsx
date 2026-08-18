"use client";

interface PersonalStepProps {
  formData: {
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function PersonalStep({
  formData,
  handleChange,
}: PersonalStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Age <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 45"
                min={1}
                max={120}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                years
                </span>
            </div>
        </div>

        <div>
            <label className="block mb-2 font-medium">
                Gender
            </label>

            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
            >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
            </select>
        </div>

       <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Height <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 170"
                min={50}
                max={250}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                cm
                </span>
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weight <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 70"
                min={10}
                max={300}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                kg
                </span>
            </div>
        </div>

      </div>
    </>
  );
}