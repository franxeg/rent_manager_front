// @ts-nocheck



"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [inquilinos, setInquilinos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  type Resumen = {total_contratos: number; vencidos: number; por_vencer: number;};
  const [resumen, setResumen] = useState<Resumen>({
  total_contratos: 0,
  vencidos: 0,
  por_vencer: 0,
  });

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [contratos, setContratos] = useState<any[]>([]);

  const [fechaInicio, setFechaInicio] = useState("");
  const [duracion, setDuracion] = useState("");
  const [monto, setMonto] = useState("");
  const [inquilinoId, setInquilinoId] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTelefono, setEditTelefono] = useState("");

  // 🔄 Cargar datos
  const cargarDatos = async () => {
    try {
      const resInq = await fetch("https://rent-manager-6vrc.onrender.com/inquilinos/");
      const dataInq = await resInq.json();
      setInquilinos(Array.isArray(dataInq) ? dataInq : []);
    } catch (e) {
      console.error("Error inquilinos", e);
      setInquilinos([]);
    }

    try {
      const resAlertas = await fetch("https://rent-manager-6vrc.onrender.com/alertas/");
      const dataAlertas = await resAlertas.json();
      setAlertas(Array.isArray(dataAlertas) ? dataAlertas : []);
    } catch (e) {
      console.error("Error alertas", e);
      setAlertas([]);
    }

    try {
      const resResumen = await fetch("https://rent-manager-6vrc.onrender.com/alertas/resumen");
      const dataResumen = await resResumen.json();
      setResumen(dataResumen);
    } catch (e) {
      console.error("Error resumen", e);
    }

    try {
      const resContratos = await fetch("https://rent-manager-6vrc.onrender.com/contratos/");
      const dataContratos = await resContratos.json();
      setContratos(Array.isArray(dataContratos) ? dataContratos : []);
    } catch (e) {
      console.error("Error contratos", e);
      setContratos([]);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearContrato = async () => {
    if (!fechaInicio || !duracion || !monto || !inquilinoId) {
      alert("Completá todos los campos");
      return;
    }

    await fetch("https://rent-manager-6vrc.onrender.com/contratos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha_inicio: fechaInicio,
        duracion_meses: Number(duracion),
        monto: Number(monto),
        inquilino_id: Number(inquilinoId),
      }),
    });

    setFechaInicio("");
    setDuracion("");
    setMonto("");
    setInquilinoId("");

    cargarDatos();
  };

  const eliminarContrato = async (id: number) => {
    await fetch(`https://rent-manager-6vrc.onrender.com/contratos/${id}`, {
      method: "DELETE",
    });

    cargarDatos();
  };

  // ➕ Crear
  const crearInquilino = async () => {
    if (!nombre || !email || !telefono) {
      alert("Completá todos los campos");
      return;
    }

    await fetch("https://rent-manager-6vrc.onrender.com/inquilinos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, telefono }),
    });

    setNombre("");
    setEmail("");
    setTelefono("");

    cargarDatos();
  };

  // ❌ Eliminar
  const eliminarInquilino = async (id: number) => {
    await fetch(`https://rent-manager-6vrc.onrender.com/inquilinos/${id}`, {
      method: "DELETE",
    });

    cargarDatos();
  };

  // ✏️ Editar
  const empezarEdicion = (inq: any) => {
    setEditandoId(inq.id);
    setEditNombre(inq.nombre);
    setEditEmail(inq.email);
    setEditTelefono(inq.telefono);
  };

  const guardarEdicion = async () => {
    if (!editNombre || !editEmail || !editTelefono) {
      alert("Completá todos los campos");
      return;
    }

    await fetch(`https://rent-manager-6vrc.onrender.com/inquilinos/${editandoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: editNombre,
        email: editEmail,
        telefono: editTelefono,
      }),
    });

    setEditandoId(null);
    cargarDatos();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "28px" }}>Dashboard</h1>

      {/* 📊 RESUMEN */}
      <h2>Resumen</h2>
      <p>Total contratos: {resumen.total_contratos}</p>
      <p>Vencidos: {resumen.vencidos}</p>
      <p>Por vencer: {resumen.por_vencer}</p>

      {/* 🚨 ALERTAS */}
      <h2>Alertas</h2>
      {alertas.length === 0 ? (
        <p>No hay alertas</p>
      ) : (
        <ul>
          {alertas.map((alerta, index) => (
            <li key={index}>
              {alerta.tipo === "vencido" && (
                <span>
                  🔴 {alerta.inquilino} - vencido hace {alerta.dias_vencido} días
                </span>
              )}
              {alerta.tipo === "por_vencer" && (
                <span>
                  🟡 {alerta.inquilino} - vence en {alerta.faltan_dias} días
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ➕ CREAR */}
      <h2>Crear Inquilino</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <br />

      <button onClick={crearInquilino}>Crear</button>

      {/* 📄 LISTA */}
      <h2>Inquilinos</h2>

      {inquilinos?.map((inq) => (
        <div
          key={inq.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {editandoId === inq.id ? (
            <>
              <input
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
              />
              <br />
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <br />
              <input
                value={editTelefono}
                onChange={(e) => setEditTelefono(e.target.value)}
              />
              <br />
              <button onClick={guardarEdicion}>Guardar</button>
            </>
          ) : (
            <>
              <strong>{inq.nombre}</strong>
              <br />
              {inq.email}
              <br />

              <button onClick={() => empezarEdicion(inq)}>Editar</button>
              <button onClick={() => eliminarInquilino(inq.id)}>
                Eliminar
              </button>
            </>
          )}
          
        </div>
      ))}
      {/* ================= CONTRATOS ================= */}

      <h2>Contratos</h2>

      {/* ➕ Crear contrato */}
      <input
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />
      <br />

      <input
        placeholder="Duración (meses)"
        value={duracion}
        onChange={(e) => setDuracion(e.target.value)}
      />
      <br />

      <input
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <br />

      <select
        value={inquilinoId}
        onChange={(e) => setInquilinoId(e.target.value)}
      >
        <option value="">Seleccionar inquilino</option>
        {inquilinos.map((inq) => (
          <option key={inq.id} value={inq.id}>
            {inq.nombre}
          </option>
        ))}
      </select>
      <br />

      <button onClick={crearContrato}>Crear contrato</button>

      {/* 📄 Lista contratos */}
      {contratos?.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <strong>{c.inquilino?.nombre || "Sin inquilino"}</strong>
          <br />
          Inicio: {c.fecha_inicio}
          <br />
          Duración: {c.duracion_meses} meses
          <br />
          Monto: ${c.monto}
          <br />

          <button onClick={() => eliminarContrato(c.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}