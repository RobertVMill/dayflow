import FitnessChart from './FitnessChart';

export default function FitnessMetrics() {
  return (
    <div className="w-full grid gap-6 sm:gap-8 -mx-2 sm:mx-0">
      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Heart Health</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FitnessChart
            title="Resting Heart Rate"
            metricType="heart_rate"
            yAxisLabel="BPM"
          />
          <FitnessChart
            title="Heart Rate Variability"
            metricType="hrv"
            yAxisLabel="ms"
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Cardio</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FitnessChart
            title="Running Pace"
            metricType="running_pace"
            yAxisLabel="KM/H"
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Strength</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FitnessChart
            title="Bench Press (3RM)"
            metricType="bench_press"
            yAxisLabel="lbs"
          />
          <FitnessChart
            title="Power Clean (3RM)"
            metricType="power_clean"
            yAxisLabel="lbs"
          />
        </div>
      </div>
    </div>
  );
} 