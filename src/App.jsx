import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
} from "docx";

export default function InfoGeneralInstitucionApp() {
  const [general, setGeneral] = useState({
    nombre: "",
    municipio: "",
  });

  const emptyItem = {
    tiempo: "",
    contexto: "",
    transformaciones: "",
    solidaridad: "",
  };

  const [items, setItems] = useState([ { ...emptyItem } ]);

  const updateItem = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const isReady = () => {
    return general.nombre.trim().length > 0 && general.municipio.trim().length > 0;
  };

  const downloadExcel = () => {
    // Sheet 1: Información general
    const generalData = [
      ["Información general de la Institución"],
      ["Nombre de la Institución", general.nombre],
      ["Municipio", general.municipio],
      [],
      ["Línea de tiempo"],
      [
        "Tiempo / época",
        "Contexto local: problemáticas confrontadas",
        "Hechos de transformaciones positivas",
        "Personas / organizaciones destacadas por su solidaridad",
      ],
      ...items.map((it) => [it.tiempo, it.contexto, it.transformaciones, it.solidaridad]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(generalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    XLSX.writeFile(wb, `Info_Institucion_${sanitize(general.nombre)}.xlsx`);
  };

  const downloadWord = async () => {
    const title = new Paragraph({
      text: "Información general de la Institución",
      heading: HeadingLevel.TITLE,
    });

    const h1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1 });

    const p = (label, value) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${label}: `, bold: true }),
          new TextRun({ text: value ?? "" }),
        ],
      });

    // Tabla principal (línea de tiempo)
    const tableHeader = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Tiempo / época")], width: { size: 25, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph("Contexto local: problemáticas confrontadas")], width: { size: 25, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph("Hechos de transformaciones positivas")], width: { size: 25, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph("Personas / organizaciones destacadas por su solidaridad")], width: { size: 25, type: WidthType.PERCENTAGE } }),
      ],
    });

    const tableRows = items.map((it) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(it.tiempo || "")] }),
          new TableCell({ children: [new Paragraph(it.contexto || "")] }),
          new TableCell({ children: [new Paragraph(it.transformaciones || "")] }),
          new TableCell({ children: [new Paragraph(it.solidaridad || "")] }),
        ],
      })
    );

    const tabla = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tableHeader, ...tableRows],
    });

    const doc = new DocxDocument({
      sections: [
        {
          children: [
            title,
            h1("Información general"),
            p("Nombre de la Institución", general.nombre),
            p("Municipio", general.municipio),
            h1("Línea de tiempo – Escuela / Territorio"),
            tabla,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `Info_Institucion_${sanitize(general.nombre)}.docx`);
  };

  const triggerDownload = (href, filename) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  const sanitize = (s) => (s || "").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Formulario – Información general de la Institución</h1>
          <span className="text-sm text-gray-600">Módulo Educación y paz</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Sección: Instrucciones */}
        <section className="bg-white shadow-sm rounded-2xl p-5 border">
          <h2 className="text-lg font-semibold mb-2">Instrucciones</h2>
          <ul className="list-disc pl-5 text-sm leading-6 text-gray-700">
            <li>Complete la <strong>Información general</strong> y luego agregue los eventos de la <strong>línea de tiempo</strong>.</li>
            <li>Al finalizar, use los botones de <strong>Descargar</strong> para obtener un archivo Excel o Word.</li>
            <li>Este formulario está pensado para directivos, docentes, familias, estudiantes y comunidad.</li>
          </ul>
        </section>

        {/* Sección: Información general */}
        <section className="bg-white shadow-sm rounded-2xl p-5 border">
          <h2 className="text-lg font-semibold mb-4">Información general de la Institución</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Institución</label>
              <input
                type="text"
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej. IE Rural El Porvenir"
                value={general.nombre}
                onChange={(e) => setGeneral({ ...general, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Municipio donde está ubicada</label>
              <input
                type="text"
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej. Anapoima, Cundinamarca"
                value={general.municipio}
                onChange={(e) => setGeneral({ ...general, municipio: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Sección: Línea de tiempo */}
        <section className="bg-white shadow-sm rounded-2xl p-5 border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Línea de tiempo – Escuela / Territorio</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            >
              + Agregar evento
            </button>
          </div>

          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="rounded-2xl border p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Evento #{idx + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tiempo / época</label>
                    <input
                      type="text"
                      placeholder="Ej. 1999–2002"
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={it.tiempo}
                      onChange={(e) => updateItem(idx, "tiempo", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contexto local: problemáticas confrontadas</label>
                    <textarea
                      rows={3}
                      placeholder="Hechos específicos en el municipio / departamento (DDHH / DIH, afectaciones a la escuela, etc.)"
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={it.contexto}
                      onChange={(e) => updateItem(idx, "contexto", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hechos de transformaciones positivas</label>
                    <textarea
                      rows={3}
                      placeholder="Aciertos de la institución: cuándo, dónde, quiénes se beneficiaron"
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={it.transformaciones}
                      onChange={(e) => updateItem(idx, "transformaciones", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Personas / funcionarios / organizaciones destacadas por su solidaridad</label>
                    <textarea
                      rows={3}
                      placeholder="Quiénes participaron, acciones, estrategias, entidades acudidas"
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={it.solidaridad}
                      onChange={(e) => updateItem(idx, "solidaridad", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Vista previa */}
        <section className="bg-white shadow-sm rounded-2xl p-5 border overflow-x-auto">
          <h2 className="text-lg font-semibold mb-3">Vista previa (tabla final)</h2>
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nombre de la Institución</th>
                <th className="border p-2 text-left">Municipio</th>
                <th className="border p-2 text-left">Tiempo / época</th>
                <th className="border p-2 text-left">Contexto local</th>
                <th className="border p-2 text-left">Transformaciones positivas</th>
                <th className="border p-2 text-left">Solidaridad destacada</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td className="border p-2 align-top">{general.nombre || "—"}</td>
                  <td className="border p-2 align-top">{general.municipio || "—"}</td>
                  <td className="border p-2 align-top">{it.tiempo || "—"}</td>
                  <td className="border p-2 align-top">{it.contexto || "—"}</td>
                  <td className="border p-2 align-top">{it.transformaciones || "—"}</td>
                  <td className="border p-2 align-top">{it.solidaridad || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Sección: Acciones */}
        <section className="bg-white shadow-sm rounded-2xl p-5 border flex flex-wrap gap-3 items-center justify-between">
          <div className="text-sm text-gray-600">Asegúrese de completar Nombre y Municipio para habilitar las descargas.</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={downloadExcel}
              disabled={!isReady()}
              className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                isReady() ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Descargar Excel
            </button>
            <button
              type="button"
              onClick={downloadWord}
              disabled={!isReady()}
              className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                isReady() ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Descargar Word
            </button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-gray-500">
        <p>
          Esta interfaz refleja los campos de la "Información general de la Institución" y la tabla final de la actividad
          de línea de tiempo del Módulo Educación y paz.
        </p>
        <p>
          Copyright ©2025
          Derechos reservados 2025.
          Autor: ANGEL CUSTODIO PUENTES PEREZ
        </p>
      </footer>
    </div>
  );
}
