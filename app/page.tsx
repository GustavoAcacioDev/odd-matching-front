import { Header } from "@/components/Header";
import ValuableBetsDisplay from "@/components/pages/home/BetsDisplay";

export default function Home() {
  return (

    <div className="min-h-screen bg-background">
      <Header />

      <ValuableBetsDisplay />
    </div>
  );
}
