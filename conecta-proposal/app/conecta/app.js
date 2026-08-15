// Lógica de la aplicación, portada del prototipo (conecta-proposal.html).
// Sigue el mismo patrón del prototipo: un solo estado en memoria (S) que se
// vuelve a dibujar completo en cada cambio. Lo único que cambió de verdad es
// de dónde vienen los datos: antes era window.storage y una llamada directa
// a la IA desde el navegador, ahora son las rutas /api/* de este servidor.

import { SERVICIOS, LIB, DEF_SET, REF, SEC } from "@/lib/catalog";

let iniciado = false;

export function initApp() {
  if (iniciado) return;
  iniciado = true;

  /* ============================ Estado ============================ */
  let S = { view: "home", props: [], set: { ...DEF_SET, lib: LIB }, cur: null, step: 0, busy: false, editing: null };

  const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const lines = s => String(s ?? "").split("\n").map(x => x.trim()).filter(Boolean);
  const nf = n => (Number(n) || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function blank() {
    return {
      id: uid(), estado: "Borrador", n: "", ver: 1, creada: new Date().toISOString(), tocada: new Date().toISOString(),
      cli: { razon: "", comercial: "", ruc: "", sector: "", contacto: "", cargo: "", email: "", decisor: "", preocupacion: "" },
      pro: { proyecto: "", notas: "", problema: "", sintomas: "", impacto: "", objetivo: "" },
      ser: { tipo: "", incluye: "", excluye: "", entregables: "", supuestos: "" },
      fas: [], cro: { inicio: "" }, eq: [{ rol: "Directora del proyecto", nom: "Kathy Román Luna" }],
      eco: {
        moneda: "PEN", igv: 18, vigencia: "30 días calendario", cond: "",
        hitos: [{ d: "Al inicio, contra kick off", pct: 50 }, { d: "Contra entrega del informe final", pct: 50 }]
      },
      sec: Object.fromEntries(SEC.map(x => [x.k, ""]))
    };
  }

  /* ============================ Persistencia ============================ */
  async function load() {
    try {
      const r = await fetch("/api/propuestas");
      const d = await r.json();
      S.props = d.props || [];
    } catch (e) { toast("No se pudieron cargar tus propuestas."); }
    try {
      const r = await fetch("/api/ajustes");
      const d = await r.json();
      S.set = { ...DEF_SET, ...(d.set || {}) };
    } catch (e) { /* usa DEF_SET */ }
    if (!S.set.lib || !Object.keys(S.set.lib).length) S.set.lib = LIB;
    S.props.forEach(p => {
      if (!p.eco.hitos) p.eco.hitos = [{ d: "Al inicio, contra kick off", pct: 50 }, { d: "Contra entrega del informe final", pct: 50 }];
      SEC.forEach(x => { if (p.sec[x.k] === undefined) p.sec[x.k] = ""; });
    });
  }
  async function saveProps() {
    try {
      await fetch("/api/propuestas", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ props: S.props }) });
    } catch (e) { toast("No se pudo guardar. Revisa tu conexión."); }
  }
  async function saveSet() {
    try {
      await fetch("/api/ajustes", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ set: S.set }) });
    } catch (e) { toast("No se pudieron guardar los ajustes."); }
  }

  function touch() {
    if (!S.cur) return;
    S.cur.tocada = new Date().toISOString();
    const i = S.props.findIndex(p => p.id === S.cur.id);
    if (i >= 0) S.props[i] = S.cur; else S.props.unshift(S.cur);
    saveProps();
  }

  /* ============================ IA ============================ */
  async function ia(key) {
    const p = S.cur;
    const r = await fetch("/api/generar", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seccion: key, propuesta: p, firma: S.set.firma })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "No se pudo redactar la sección.");
    return d.texto || "";
  }

  async function genAll() {
    S.busy = true; render();
    for (const s of SEC) {
      const el = document.getElementById("genstat");
      if (el) el.textContent = "Redactando: " + s.t;
      try { S.cur.sec[s.k] = await ia(s.k); } catch (e) { S.cur.sec[s.k] = ""; toast(e.message || "Falló la redacción de una sección."); }
    }
    S.busy = false; touch(); S.view = "prev"; render(); toast("Propuesta redactada. Revísala antes de exportar.");
  }
  async function regen(k) {
    const b = document.getElementById("rg_" + k);
    if (b) { b.disabled = true; b.innerHTML = '<span class="spin"></span>Redactando'; }
    try { S.cur.sec[k] = await ia(k); touch(); } catch (e) { toast(e.message || "No se pudo regenerar la sección."); }
    render();
  }

  /* ============================ Utilidades UI ============================ */
  function toast(m) {
    const d = document.createElement("div"); d.className = "toast"; d.textContent = m;
    document.body.appendChild(d); setTimeout(() => d.remove(), 3200);
  }
  const F = (l, id, v, ph, t = "text") => `<div><label for="${id}">${l}</label><input id="${id}" type="${t}" value="${esc(v)}" placeholder="${ph || ""}"></div>`;
  const A = (l, id, v, ph, h) => `<div><label for="${id}">${l}</label><textarea id="${id}" placeholder="${ph || ""}">${esc(v)}</textarea>${h ? `<div class="hint">${h}</div>` : ""}</div>`;
  const val = id => (document.getElementById(id) || {}).value || "";

  function pct(p) { return (p.eco.hitos || []).reduce((a, h) => a + (Number(h.pct) || 0), 0); }
  function totals(p) {
    const hon = p.fas.reduce((a, f) => a + (Number(f.h) || 0), 0);
    const igv = hon * (Number(p.eco.igv) || 0) / 100;
    return { hon, igv, tot: hon + igv, sem: p.fas.reduce((a, f) => a + (Number(f.s) || 0), 0), sim: p.eco.moneda === "USD" ? "US$" : "S/" };
  }

  /* ============================ Vistas ============================ */
  function render() {
    const navHome = document.getElementById("navHome"), navSet = document.getElementById("navSet");
    if (navHome) navHome.className = S.view === "set" ? "" : "on";
    if (navSet) navSet.className = S.view === "set" ? "on" : "";
    const a = document.getElementById("app");
    if (!a) return;
    if (S.busy) a.innerHTML = `<div class="card" style="padding:60px;text-align:center">
        <div style="font-size:17px;color:var(--navy);font-weight:600"><span class="spin" style="border-color:#cfe3ef;border-top-color:var(--teal)"></span>Generando la propuesta</div>
        <p id="genstat" style="color:var(--muted);margin-top:10px">Preparando</p>
        <p class="hint">Las cifras, plazos y honorarios no pasan por la IA. Se insertan tal como los cargaste.</p></div>`;
    else if (S.view === "home") a.innerHTML = home();
    else if (S.view === "set") a.innerHTML = ajustes();
    else if (S.view === "wiz") a.innerHTML = wizard();
    else if (S.view === "prev") a.innerHTML = preview();
    wire();
  }

  function home() {
    const rows = S.props.length ? S.props.map(p => {
      const t = totals(p);
      return `<div class="prow">
        <div class="t"><b>${esc(p.pro.proyecto || "Propuesta sin nombre")}</b>
          <small>${esc(p.cli.razon || "Cliente por definir")} · ${esc(p.ser.tipo || "Servicio por definir")} · ${t.hon ? t.sim + " " + nf(t.hon) : "sin honorarios"}</small></div>
        <span class="tag ${p.estado === "Enviada" ? "sent" : ""}">${p.estado}</span>
        <button class="btn-ghost" data-open="${p.id}">Abrir</button>
        <button class="btn-quiet" data-dup="${p.id}">Duplicar</button>
        <button class="btn-quiet" data-del="${p.id}">Eliminar</button></div>`;
    }).join("")
      : `<div class="empty"><h3>Todavía no hay propuestas</h3><p>Crea la primera y quedará guardada aquí para reutilizarla.</p></div>`;
    return `<div class="page-head"><div><h1>Propuestas</h1><p>${S.props.length} guardada${S.props.length === 1 ? "" : "s"} en tu base de datos</p></div>
      <div class="sp"><button class="btn-primary" id="new">+ Crear nueva propuesta</button></div></div>
      <div class="card plist">${rows}</div>`;
  }

  const STEPS = ["1. Cliente", "2. Problema y objetivo", "3. Servicio y alcance", "4. Fases y cronograma", "5. Inversión"];

  function wizard() {
    const p = S.cur;
    const nav = STEPS.map((s, i) => `<div class="${i === S.step ? "on" : (i < S.step ? "done" : "")}" data-step="${i}">${s}</div>`).join("");
    let b = "";
    if (S.step === 0) b = `<h2>Datos del cliente</h2><p class="sub">Lo mínimo para la portada y la facturación, más las dos preguntas que cambian el enfoque de la propuesta.</p>
      <div class="grid g2">${F("Razón social", "cli_razon", p.cli.razon)}${F("Nombre comercial", "cli_comercial", p.cli.comercial)}
      ${F("RUC", "cli_ruc", p.cli.ruc)}${F("Sector", "cli_sector", p.cli.sector, "Consumo masivo, industria, retail")}
      ${F("Contacto", "cli_contacto", p.cli.contacto)}${F("Cargo", "cli_cargo", p.cli.cargo)}
      ${F("Correo", "cli_email", p.cli.email, "", "email")}${F("Quién toma la decisión", "cli_decisor", p.cli.decisor, "Gerente General, directorio, accionista")}</div>
      <div style="margin-top:16px">${A("Qué le preocupa a esa persona", "cli_preocupacion", p.cli.preocupacion, "Qué le quita el sueño al que firma", "No sale en el documento. Orienta el tono del cierre comercial.")}</div>`;
    if (S.step === 1) b = `<h2>Problema y objetivo</h2><p class="sub">Pega tus notas tal como salieron de la reunión. De aquí sale la mitad del documento.</p>
      <div class="grid">${F("Nombre del proyecto", "pro_proyecto", p.pro.proyecto, "Transformación de la gestión logística y modelo operativo")}
      ${A("Notas de la reunión", "pro_notas", p.pro.notas, "Escribe o dicta sin ordenar. Yo lo ordeno después.", "Mientras más específico seas aquí, menos vas a editar en la vista previa.")}
      <div class="grid g2">${A("El problema en una frase", "pro_problema", p.pro.problema)}${A("Síntomas observados", "pro_sintomas", p.pro.sintomas, "Uno por línea")}</div>
      <div class="grid g2">${A("Impacto en el negocio", "pro_impacto", p.pro.impacto, "Servicio, costos, inventarios, reprocesos")}${A("Objetivo del proyecto", "pro_objetivo", p.pro.objetivo)}</div></div>`;
    if (S.step === 2) {
      const opts = SERVICIOS.map(s => `<option ${p.ser.tipo === s ? "selected" : ""}>${s}</option>`).join("");
      b = `<h2>Servicio y alcance</h2><p class="sub">Al elegir el tipo de servicio se cargan fases, entregables y metodología de la biblioteca. Todo es editable.</p>
      <div class="grid"><div><label for="ser_tipo">Tipo de servicio</label><select id="ser_tipo"><option value="">Selecciona</option>${opts}</select>
        <div class="hint">${S.set.lib[p.ser.tipo] ? "Biblioteca disponible para este servicio." : "Sin biblioteca cargada. Se redactará solo desde tus notas."}</div></div>
      <div class="grid g2">${A("Procesos incluidos", "ser_incluye", p.ser.incluye, "Uno por línea")}${A("Procesos excluidos", "ser_excluye", p.ser.excluye, "Uno por línea")}</div>
      ${A("Entregables", "ser_entregables", p.ser.entregables, "Uno por línea")}
      ${A("Supuestos y consideraciones", "ser_supuestos", p.ser.supuestos || S.set.supuestos, "Uno por línea")}</div>`;
    }
    if (S.step === 3) {
      const fs = p.fas.map((f, i) => `<div class="fase">
        <div><input id="f_n_${i}" value="${esc(f.n)}" placeholder="Nombre de la fase"></div>
        <div><input id="f_s_${i}" type="number" min="1" value="${f.s || ""}" placeholder="Sem"></div>
        <div><textarea id="f_a_${i}" placeholder="Actividades, una por línea">${esc(f.a)}</textarea></div>
        <div><textarea id="f_e_${i}" placeholder="Entregable de la fase">${esc(f.e)}</textarea></div>
        <div><input id="f_h_${i}" type="number" min="0" value="${f.h || ""}" placeholder="Honorarios"></div>
        <div><button class="del" data-delf="${i}" title="Quitar fase">✕</button></div></div>`).join("");
      const eq = p.eq.map((e, i) => `<div class="grid g2" style="margin-bottom:8px"><input id="e_r_${i}" value="${esc(e.rol)}" placeholder="Rol">
        <div style="display:flex;gap:8px"><input id="e_n_${i}" value="${esc(e.nom)}" placeholder="Nombre"><button class="del" data-dele="${i}">✕</button></div></div>`).join("");
      b = `<h2>Fases, cronograma y equipo</h2><p class="sub">Los honorarios se cargan por fase porque así se factura el avance.</p>
      <div class="fase" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--muted);letter-spacing:.04em">
        <div>Fase</div><div>Semanas</div><div>Actividades</div><div>Entregable</div><div>Honorarios</div><div></div></div>
      ${fs || '<p class="hint" style="margin-bottom:12px">Sin fases todavía.</p>'}
      <button class="btn-ghost" id="addf">+ Agregar fase</button>
      <div class="grid g2" style="margin-top:22px">${F("Fecha estimada de inicio", "cro_inicio", p.cro.inicio, "", "date")}
        <div><label>Duración total</label><input value="${totals(p).sem} semanas" disabled></div></div>
      <h2 style="margin-top:26px;font-size:15px">Equipo consultor</h2>${eq}<button class="btn-ghost" id="adde">+ Agregar integrante</button>`;
    }
    if (S.step === 4) {
      const t = totals(p);
      b = `<h2>Inversión y condiciones</h2><p class="sub">Estos montos se insertan literalmente en el documento. La IA no los toca.</p>
      <div class="grid g3">
        <div><label for="eco_moneda">Moneda</label><select id="eco_moneda"><option value="PEN" ${p.eco.moneda === "PEN" ? "selected" : ""}>Soles (S/)</option><option value="USD" ${p.eco.moneda === "USD" ? "selected" : ""}>Dólares (US$)</option></select></div>
        ${F("IGV %", "eco_igv", p.eco.igv, "18", "number")}
        ${F("Vigencia de la propuesta", "eco_vigencia", p.eco.vigencia)}</div>
      <div class="card" style="padding:16px;margin:18px 0;background:#F8FBFD">
        ${p.fas.map(f => `<div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0"><span>${esc(f.n || "Fase sin nombre")}</span><b>${t.sim} ${nf(f.h)}</b></div>`).join("")}
        <div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);margin-top:8px;padding-top:8px"><span>Subtotal</span><b>${t.sim} ${nf(t.hon)}</b></div>
        <div style="display:flex;justify-content:space-between"><span>IGV</span><b>${t.sim} ${nf(t.igv)}</b></div>
        <div style="display:flex;justify-content:space-between;color:var(--navy);font-size:17px;margin-top:6px"><b>Total</b><b>${t.sim} ${nf(t.tot)}</b></div></div>
      <h2 style="font-size:15px;margin-top:8px">Hitos de pago</h2>
      <p class="sub">El monto de cada hito se calcula sobre los honorarios sin IGV.</p>
      ${p.eco.hitos.map((h, i) => `<div class="grid" style="grid-template-columns:1fr 90px 130px 34px;gap:10px;margin-bottom:8px;align-items:center">
        <input id="h_d_${i}" value="${esc(h.d)}" placeholder="Descripción del hito">
        <input id="h_p_${i}" type="number" min="0" max="100" value="${h.pct || ""}" placeholder="%">
        <div style="text-align:right;color:var(--navy);font-weight:600">${t.sim} ${nf(t.hon * (Number(h.pct) || 0) / 100)}</div>
        <button class="del" data-delh="${i}">✕</button></div>`).join("")}
      <button class="btn-ghost" id="addh">+ Agregar hito</button>
      ${pct(p) !== 100 ? `<div class="banner" style="margin-top:12px">Los hitos suman ${pct(p)}% . Ajusta hasta llegar a 100% antes de enviar.</div>` : ""}
      <div style="margin-top:20px">${A("Condiciones comerciales", "eco_cond", p.eco.cond || S.set.condiciones, "Una por línea")}</div>
      <p class="hint" style="margin-top:14px">${t.sem ? `Esta propuesta equivale a ${t.sim} ${nf(t.sem ? t.hon / t.sem : 0)} por semana. ` : ""}${REF}</p>`;
    }
    const last = S.step === STEPS.length - 1;
    return `<div class="page-head"><div><h1>${esc(p.pro.proyecto || "Nueva propuesta")}</h1><p>${esc(p.cli.razon || "Cliente por definir")}</p></div>
      <div class="sp"><button class="btn-quiet" id="toprev">Ir a vista previa</button><button class="btn-quiet" id="tohome">Guardar y salir</button></div></div>
      <div class="steps">${nav}</div><div class="card block">${b}
      <div class="navbar">${S.step > 0 ? '<button class="btn-ghost" id="back">Atrás</button>' : ""}
        <div class="sp"></div>
        ${last ? '<button class="btn-teal" id="gen">Redactar con IA</button>' : '<button class="btn-primary" id="next">Siguiente</button>'}</div></div>`;
  }

  function md(txt) {
    const out = []; let ul = false;
    lines(txt).forEach(l => {
      if (/^[-•*]\s+/.test(l)) { if (!ul) { out.push("<ul>"); ul = true; } out.push("<li>" + esc(l.replace(/^[-•*]\s+/, "")) + "</li>"); }
      else { if (ul) { out.push("</ul>"); ul = false; } out.push("<p>" + esc(l) + "</p>"); }
    });
    if (ul) out.push("</ul>");
    return out.join("") || '<p style="color:#9aa8b5">Sección vacía. Usa Regenerar o edítala a mano.</p>';
  }
  const ulist = t => lines(t).length ? "<ul>" + lines(t).map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>" : "";

  function preview() {
    const p = S.cur, t = totals(p), st = S.set;
    const fecha = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
    let acc = 0;
    const gantt = p.fas.map(f => {
      const w = Number(f.s) || 0, l = t.sem ? acc / t.sem * 100 : 0, wd = t.sem ? w / t.sem * 100 : 0; acc += w;
      return `<div class="gantt"><div class="nm">${esc(f.n)}</div><div class="track"><div class="bar" style="left:${l}%;width:${wd}%"></div></div><div class="wk">${w} sem</div></div>`;
    }).join("");
    const secs = SEC.map(s => `<div class="sec-tools">
        <button class="btn-quiet" data-edit="${s.k}">Editar</button>
        <button class="btn-quiet" id="rg_${s.k}" data-regen="${s.k}">Regenerar</button></div>
      <section id="s_${s.k}" ${s.quote ? 'class="thesis"' : ""}><h2>${s.t}</h2>${S.editing === s.k
        ? `<div class="editing"><textarea id="ed_${s.k}" style="min-height:200px">${esc(p.sec[s.k])}</textarea>
           <div style="margin-top:8px"><button class="btn-primary" data-save="${s.k}">Guardar cambios</button>
           <button class="btn-quiet" data-cancel="1">Cancelar</button></div></div>`
        : md(p.sec[s.k])}</section>`).join("");

    return `<div class="page-head"><div><h1>Vista previa</h1><p>Revisa, edita y exporta. Todo lo que ves es lo que recibe el cliente.</p></div>
      <div class="sp"><button class="btn-ghost" id="towiz">Volver al formulario</button>
        <button class="btn-quiet" id="mark">${p.estado === "Enviada" ? "Marcar como borrador" : "Marcar como enviada"}</button>
        <button class="btn-teal" id="pdf">Descargar PDF</button></div></div>
    <div class="wrap"><div><div id="doc" class="doc">
      <div class="cover"><div class="kicker">Propuesta de servicios de consultoría</div>
        <h1>${esc(p.pro.proyecto || "Proyecto por definir")}</h1>
        <div class="cli">${esc(p.cli.razon || "Cliente por definir")}</div>
        <div class="meta">${esc(st.firma)} · ${fecha} · Propuesta ${esc(p.id.slice(-4).toUpperCase())} versión ${p.ver}<br>
          ${p.cli.contacto ? "Presentada a: " + esc(p.cli.contacto) + (p.cli.cargo ? ", " + esc(p.cli.cargo) : "") : ""}</div></div>

      <section><h2>Quiénes somos</h2><p>${esc(st.quienes)}</p>
        ${st.clientes ? `<p style="margin-top:8px"><b>Marcas líderes que confían en nuestra metodología:</b> ${esc(st.clientes)}.</p>` : ""}</section>
      ${secs}

      <section><h2>Fases del proyecto</h2>
        <table><tr><th>Fase</th><th>Actividades</th><th>Entregable</th><th>Duración</th></tr>
        ${p.fas.map(f => `<tr><td><b>${esc(f.n)}</b></td><td>${ulist(f.a) || "-"}</td><td>${esc(f.e)}</td><td>${f.s} sem</td></tr>`).join("")}</table></section>

      <section><h2>Cronograma</h2>${gantt || "<p>Sin fases cargadas.</p>"}
        <p style="margin-top:10px;color:#5B6B7C;font-size:13.5px">Duración total estimada: ${t.sem} semanas${p.cro.inicio ? ", con inicio estimado el " + esc(p.cro.inicio) : ""}.</p></section>

      <section><h2>Entregables</h2>${ulist(p.ser.entregables) || "<p>Por definir.</p>"}</section>

      <section><h2>Equipo consultor</h2><table><tr><th>Rol</th><th>Integrante</th></tr>
        ${p.eq.map(e => `<tr><td>${esc(e.rol)}</td><td>${esc(e.nom)}</td></tr>`).join("")}</table></section>

      <section><h2>Inversión</h2>
        <table><tr><th>Fase</th><th style="text-align:right">Honorarios</th></tr>
        ${p.fas.map(f => `<tr><td>${esc(f.n)}</td><td style="text-align:right">${t.sim} ${nf(f.h)}</td></tr>`).join("")}
        <tr><td>Subtotal</td><td style="text-align:right">${t.sim} ${nf(t.hon)}</td></tr>
        <tr><td>IGV (${p.eco.igv}%)</td><td style="text-align:right">${t.sim} ${nf(t.igv)}</td></tr>
        <tr class="tot"><td>Total</td><td style="text-align:right">${t.sim} ${nf(t.tot)}</td></tr></table>
        <table style="margin-top:14px"><tr><th>Hito de pago</th><th style="text-align:right">%</th><th style="text-align:right">Monto</th></tr>
        ${p.eco.hitos.map(h => `<tr><td>${esc(h.d)}</td><td style="text-align:right">${h.pct || 0}%</td>
          <td style="text-align:right">${t.sim} ${nf(t.hon * (Number(h.pct) || 0) / 100)}</td></tr>`).join("")}</table>
        <p style="font-size:13px;color:#5B6B7C">Los montos de los hitos se calculan sobre los honorarios sin IGV.</p></section>

      <section><h2>Supuestos y consideraciones</h2>${ulist(p.ser.supuestos || st.supuestos)}</section>
      <section><h2>Condiciones comerciales</h2>${ulist(p.eco.cond || st.condiciones)}
        <p>La presente propuesta tiene una vigencia de ${esc(p.eco.vigencia)} desde su fecha de emisión.</p>
        ${st.facturacion ? `<p style="margin-top:10px"><b>Datos para facturación y pago</b></p>${ulist(st.facturacion)}` : ""}</section>

      <div class="contact"><b>${esc(st.firma)}</b>${st.tagline ? esc(st.tagline) + "<br>" : ""}
        ${[st.email, st.tel, st.web, st.ruc ? "RUC " + st.ruc : ""].filter(Boolean).map(esc).join(" · ")}</div>
    </div></div>
    <div class="side"><div class="card"><h4>Secciones</h4>
      ${SEC.map(s => `<a href="#s_${s.k}">${s.t}</a>`).join("")}
      <a href="#doc">Fases, cronograma e inversión</a></div>
      <div class="card" style="margin-top:12px"><h4>Control</h4>
        <p class="hint" style="margin:0">Las cifras, plazos y honorarios provienen del formulario. La IA solo redacta las secciones narrativas.</p></div>
    </div></div>`;
  }

  function ajustes() {
    const st = S.set;
    const lib = Object.keys(st.lib).map(k => `<div class="card" style="padding:16px;margin-bottom:12px">
      <b style="color:var(--navy)">${esc(k)}</b>
      <div class="hint">${st.lib[k].fases.length} fases tipo, ${lines(st.lib[k].entregables).length} entregables, metodología cargada</div></div>`).join("");
    return `<div class="page-head"><div><h1>Ajustes</h1><p>Textos fijos de la firma y biblioteca de servicios</p></div>
      <div class="sp"><button class="btn-ghost" id="backup">Exportar respaldo</button><button class="btn-primary" id="saveset">Guardar</button></div></div>
      <div class="banner">Tus propuestas se guardan en tu base de datos. Exporta un respaldo cada cierto tiempo.</div>
      <div class="card block"><h2>Datos de la firma</h2>
        <div class="grid g3">${F("Nombre", "st_firma", st.firma)}${F("RUC", "st_ruc", st.ruc)}${F("Web", "st_web", st.web)}</div>
        <div class="grid g3" style="margin-top:14px">${F("Correo", "st_email", st.email)}${F("Teléfono", "st_tel", st.tel)}${F("Tagline", "st_tagline", st.tagline)}</div>
        <div style="margin-top:16px">${A("Quiénes somos", "st_quienes", st.quienes)}</div>
        <div class="grid g2" style="margin-top:16px">${A("Marcas que confían en Conecta", "st_clientes", st.clientes, "Separadas por comas")}
        ${A("Datos para facturación y pago", "st_facturacion", st.facturacion, "Una línea por dato")}</div>
        <div class="grid g2" style="margin-top:16px">${A("Condiciones comerciales estándar", "st_condiciones", st.condiciones, "Una por línea")}
        ${A("Supuestos estándar", "st_supuestos", st.supuestos, "Una por línea")}</div></div>
      <div class="card block" style="margin-top:18px"><h2>Biblioteca de servicios</h2>
        <p class="sub">Metodología, fases y entregables que se precargan al elegir el tipo de servicio.</p>${lib}</div>`;
  }

  /* ============================ Eventos ============================ */
  function grab() {
    const p = S.cur; if (!p) return;
    const set = (o, k, id) => { const el = document.getElementById(id); if (el) o[k] = el.value; };
    if (S.step === 0) ["razon", "comercial", "ruc", "sector", "contacto", "cargo", "email", "decisor", "preocupacion"].forEach(k => set(p.cli, k, "cli_" + k));
    if (S.step === 1) ["proyecto", "notas", "problema", "sintomas", "impacto", "objetivo"].forEach(k => set(p.pro, k, "pro_" + k));
    if (S.step === 2) ["tipo", "incluye", "excluye", "entregables", "supuestos"].forEach(k => set(p.ser, k, "ser_" + k));
    if (S.step === 3) {
      p.fas.forEach((f, i) => { ["n", "s", "a", "e", "h"].forEach(k => set(f, k, `f_${k}_${i}`)); });
      p.eq.forEach((e, i) => { set(e, "rol", `e_r_${i}`); set(e, "nom", `e_n_${i}`); }); set(p.cro, "inicio", "cro_inicio");
    }
    if (S.step === 4) {
      ["moneda", "igv", "vigencia", "cond"].forEach(k => set(p.eco, k, "eco_" + k));
      p.eco.hitos.forEach((h, i) => { set(h, "d", `h_d_${i}`); set(h, "pct", `h_p_${i}`); });
    }
    touch();
  }

  function applyLib() {
    const p = S.cur, b = S.set.lib[p.ser.tipo]; if (!b) return;
    if (!p.fas.length) p.fas = b.fases.map(f => ({ n: f.n, s: f.s, a: f.a, e: f.e, h: "" }));
    if (!p.ser.entregables) p.ser.entregables = b.entregables;
    if (!p.ser.supuestos) p.ser.supuestos = S.set.supuestos;
  }

  function wire() {
    const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = fn; };
    on("navHome", () => { if (S.view === "wiz") grab(); S.view = "home"; render(); });
    on("navSet", () => { if (S.view === "wiz") grab(); S.view = "set"; render(); });

    on("new", () => { S.cur = blank(); S.step = 0; S.view = "wiz"; S.props.unshift(S.cur); saveProps(); render(); });
    document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => {
      S.cur = S.props.find(x => x.id === b.dataset.open); S.step = 0;
      S.view = Object.values(S.cur.sec).some(Boolean) ? "prev" : "wiz"; render();
    });
    document.querySelectorAll("[data-dup]").forEach(b => b.onclick = () => {
      const o = S.props.find(x => x.id === b.dataset.dup);
      const c = JSON.parse(JSON.stringify(o)); c.id = uid(); c.estado = "Borrador"; c.ver = 1; c.pro.proyecto = o.pro.proyecto + " (copia)";
      S.props.unshift(c); saveProps(); render(); toast("Propuesta duplicada.");
    });
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
      if (!confirm("¿Eliminar esta propuesta?")) return;
      S.props = S.props.filter(x => x.id !== b.dataset.del); saveProps(); render();
    });

    document.querySelectorAll("[data-step]").forEach(d => d.onclick = () => { grab(); S.step = +d.dataset.step; render(); });
    on("next", () => { grab(); if (S.step === 2) applyLib(); S.step = Math.min(S.step + 1, 4); render(); });
    on("back", () => { grab(); S.step = Math.max(S.step - 1, 0); render(); });
    on("tohome", () => { grab(); S.view = "home"; render(); toast("Guardado."); });
    on("toprev", () => { grab(); S.view = "prev"; render(); });
    on("towiz", () => { S.view = "wiz"; render(); });
    on("addf", () => { grab(); S.cur.fas.push({ n: "", s: "", a: "", e: "", h: "" }); render(); });
    on("adde", () => { grab(); S.cur.eq.push({ rol: "", nom: "" }); render(); });
    on("addh", () => { grab(); S.cur.eco.hitos.push({ d: "", pct: "" }); render(); });
    document.querySelectorAll("[data-delh]").forEach(b => b.onclick = () => { grab(); S.cur.eco.hitos.splice(+b.dataset.delh, 1); render(); });
    document.querySelectorAll("[data-delf]").forEach(b => b.onclick = () => { grab(); S.cur.fas.splice(+b.dataset.delf, 1); render(); });
    document.querySelectorAll("[data-dele]").forEach(b => b.onclick = () => { grab(); S.cur.eq.splice(+b.dataset.dele, 1); render(); });
    const sel = document.getElementById("ser_tipo"); if (sel) sel.onchange = () => { grab(); applyLib(); render(); };

    on("gen", () => { grab(); if (!S.cur.pro.notas && !S.cur.pro.problema) { toast("Carga al menos las notas o el problema antes de redactar."); return; } genAll(); });
    document.querySelectorAll("[data-regen]").forEach(b => b.onclick = () => regen(b.dataset.regen));
    document.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => { S.editing = b.dataset.edit; render(); });
    document.querySelectorAll("[data-save]").forEach(b => b.onclick = () => { S.cur.sec[b.dataset.save] = val("ed_" + b.dataset.save); S.editing = null; touch(); render(); });
    document.querySelectorAll("[data-cancel]").forEach(b => b.onclick = () => { S.editing = null; render(); });
    on("mark", () => { S.cur.estado = S.cur.estado === "Enviada" ? "Borrador" : "Enviada"; touch(); render(); });

    on("pdf", async () => {
      const el = document.getElementById("doc");
      const nom = (S.cur.cli.razon || "Cliente").replace(/[^\w\s]/g, "") + " - " + (S.cur.pro.proyecto || "Propuesta").replace(/[^\w\s]/g, "");
      try {
        const mod = await import("html2pdf.js");
        const html2pdf = mod.default || mod;
        html2pdf().set({
          margin: [14, 13, 16, 13], filename: nom + ".pdf", image: { type: "jpeg", quality: .98 },
          html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"], avoid: ["section", ".gantt", "tr"] }
        }).from(el).save();
      } catch (e) { window.print(); }
    });

    on("saveset", () => {
      ["firma", "ruc", "web", "email", "tel", "tagline", "quienes", "clientes", "facturacion", "condiciones", "supuestos"].forEach(k => {
        const e = document.getElementById("st_" + k); if (e) S.set[k] = e.value;
      }); saveSet(); toast("Ajustes guardados.");
    });
    on("backup", () => {
      const b = new Blob([JSON.stringify({ props: S.props, set: S.set }, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "conecta-proposal-respaldo.json"; a.click();
    });
  }

  load().then(render);
}
