# Información general de la Institución – Educación y paz

Formulario web (React + Vite + Tailwind) para capturar la **Información general de la Institución** y la **línea de tiempo**.
Permite descargar los datos a **Excel (.xlsx)** y **Word (.docx)** directamente en el navegador.

## Requisitos
- Node.js 18+ y npm 9+

## Instalación
```bash
npm i
```

## Desarrollo local
```bash
npm run dev
```

## Build de producción
```bash
npm run build
npm run preview
```

## Despliegue en Vercel (pasos rápidos)
1. Sube este proyecto a un repositorio en GitHub.
2. Ve a https://vercel.com → **New Project** → **Import** → selecciona tu repo.
3. Framework: **Vite**. Build: `npm run build` – Output: `dist`.
4. Deploy. Obtendrás una URL pública HTTPS.

> La app **no envía** datos a ningún servidor; todo se guarda en tu equipo al descargar Excel/Word.
