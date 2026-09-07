# 🌿 gasti — Control Inteligente de Presupuestos & Finanzas

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-10B981?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**gasti** es una aplicación moderna, fluida y privada para la gestión inteligente de ingresos, gastos y presupuestos mensuales basados en **porcentajes dinámicos**. Diseñada tanto para finanzas personales como para pequeños negocios y proyectos independientes.

---

## ✨ Características Principales

- 📊 **Presupuesto por Porcentajes:** Define tu capital o sueldo y asigna porcentajes a cada categoría. Los límites monetarios se calculan y rebalancean en tiempo real.
- ⏱️ **Barra de Ritmo Mensual Inteligente:** Monitorea el gasto acumulado en contraste con el avance de los días del mes calendario, con cálculo de presupuesto diario seguro y alertas de sobrepaso.
- 💼 **Modo Personal & Modo Negocio:** Cambia fácilmente de perfil con categorías y nomenclaturas adaptadas (Ventas, Clientes, Operaciones vs. Sueldo, Alquiler, Ahorro).
- 💰 **Historial & Corrección de Capital:**
  - Suma ingresos, ventas o aportes adicionales.
  - Botón **"- Corregir / Reducir"** con registro de motivo para enmendar errores de digitación o devoluciones.
  - Historial detallado de todas las transacciones de capital.
- 📱 **Soporte PWA Móvil & Offline:**
  - Instalación en 1 clic en Android, iPhone/iPad (Safari) y computadoras de escritorio.
  - Interfaz fija sin rebotes táctiles molestos ni desplazamientos laterales.
  - 100% privado y local: tus datos se guardan en el navegador sin intermediarios.
- 📥 **Centro de Descargas & Exportación:**
  - Exportación a CSV mensual y acumulado.
  - Respaldo y restauración en formato JSON.
  - Impresión de informes en PDF y resumen rápido para portapapeles.
  - Paquete completo de la aplicación en `.ZIP` para uso autónomo.
- 🌐 **Soporte Multi-idioma:** Español e Inglés con cambio dinámico instantáneo y múltiples monedas (USD, EUR, MXN, COP, ARS, CLP, PEN, GBP, etc.).

---

## 🚀 Inicio Rápido

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- `npm`, `pnpm` o `bun`

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/gasti.git

# 2. Entrar a la carpeta
cd gasti

# 3. Instalar las dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Compilar para Producción

```bash
npm run build
```

Los archivos optimizados para producción se generarán en la carpeta `dist/`.

---

## 🚢 Publicación y Despliegue

### Opción A: Vercel (Recomendado)

1. Conecta tu repositorio de GitHub en [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Haz clic en **Deploy**.

### Opción B: Netlify

1. Ve a [Netlify](https://www.netlify.com/) y selecciona **Import from Git**.
2. Selecciona tu repositorio de GitHub.
3. Build Command: `npm run build`.
4. Publish Directory: `dist`.
5. Haz clic en **Deploy Site**.

### Opción C: GitHub Pages

Instala el paquete `gh-pages`:

```bash
npm install gh-pages --save-dev
```

Agrega los scripts a tu `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Y ejecuta:

```bash
npm run deploy
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Motion (`motion/react`)
- **Íconos:** Lucide React
- **Gráficos:** Recharts
- **Empaquetado Offline:** JSZip
- **Compilador:** Vite

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de utilizarlo, modificarlo y compartirlo.
