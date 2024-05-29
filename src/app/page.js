import Image from "next/image";
import Link from "next/link"
import "./page.css"
export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-between p-24 h-fit max-h-150 gap-25">
        <Link className="main-page-link" href="/grapher">Buoy Grapher</Link>
        <Link className="main-page-link" href="/weatherapp">Weather Data</Link>
        <Link className="main-page-link" href="/acis">ACIS Grapher</Link>
      </div>
      <p>Buoy data from NDBC. Forecast data by <Link href="https://open-meteo.com">Open Meteo</Link>. Historical data from <Link href="https://rcc-acis.org">RCC ACIS</Link>.</p>
    </main>
  );
}
