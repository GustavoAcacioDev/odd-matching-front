import ValuableBetsDisplay from "@/components/pages/home/BetsDisplay";
import evs from "@/utils/ev";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ValuableBetsDisplay bets={evs} />
    </div>
  );
}
