interface Props {
  formData: any;
}

export default function ReviewStep({ formData }: Props) {
  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Review Your Information
        </h2>

        <p className="text-slate-600">
          Please verify all the information before generating your AI health prediction.
        </p>
      </div>

      {/* Personal Information */}

      <div className="rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4">
          👤 Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <Info label="Age" value={formData.age} />

          <Info label="Gender" value={formData.gender} />

          <Info label="Height" value={`${formData.height} cm`} />

          <Info label="Weight" value={`${formData.weight} kg`} />

        </div>
      </div>

      {/* Lifestyle */}

      <div className="rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4">
          🚶 Lifestyle
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <Info label="Smoking" value={formData.smoking} />

          <Info label="Alcohol" value={formData.alcohol} />

          <Info label="Exercise" value={formData.exercise} />

        </div>
      </div>

      {/* Laboratory */}

      <div className="rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4">
          🧪 Laboratory
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <Info label="Glucose" value={`${formData.glucose} mg/dL`} />

          <Info label="Cholesterol" value={`${formData.cholesterol} mg/dL`} />

          <Info label="HbA1c" value={`${formData.hba1c} %`} />

          <Info
            label="Blood Pressure"
            value={`${formData.systolicBP}/${formData.diastolicBP} mmHg`}
          />

        </div>
      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-slate-500">{label}</span>

      <span className="font-semibold text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}