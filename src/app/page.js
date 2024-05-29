import Image from "next/image";
import Link from "next/link"
import "./page.css"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link className="main-page-link" href="/grapher">Buoy Grapher</Link>
      <Link className="main-page-link" href="/weatherapp">Weather Data</Link>
      <Link className="main-page-link" href="/acis">ACIS Grapher</Link>
    </main>
  );
}
