import FitnessChart from './FitnessChart';

export default function FitnessMetrics() {
  return (
    <div className="w-full space-y-8">
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
      <FitnessChart
        title="Running Pace"
        metricType="running_pace"
        yAxisLabel="KM/H"
      />
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
  );
} 