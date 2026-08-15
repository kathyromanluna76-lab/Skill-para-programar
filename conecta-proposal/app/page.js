"use client";
import { useEffect } from "react";
import { initApp } from "./conecta/app";

export default function Home() {
  useEffect(() => { initApp(); }, []);

  return (
    <>
      <header className="top">
        <div className="brand"><b>CONECTA</b><span>Proposal</span></div>
        <nav>
          <button id="navHome">Propuestas</button>
          <button id="navSet">Ajustes</button>
        </nav>
      </header>
      <main id="app"></main>
    </>
  );
}
