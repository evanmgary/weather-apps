import Link from "next/link";

export default function Navbar(){
    return(
        <div className="navbar">
            <Link className="navbar-item" href="/grapher">Buoy Grapher</Link>
            <Link className="navbar-item" href="/weatherapp">Weather Tools</Link>
            <Link className="navbar-item" href="/acis">ACIS</Link>
        </div>
      )
}