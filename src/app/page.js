import Image from "next/image";
import styles from "./page.module.css";
import Orb from "./components/Orb";


export default function Home() {
  return (
    <div className="app">
      <nav>
        <h1>SPHERE AND IMAGES</h1>
      </nav>
      <Orb></Orb>
      <footer>
        <p>ZAKARIA SNIPERCAR</p>
      </footer>
    </div>
  );
}
