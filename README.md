# Branch Name Formatter 🌿

*Leer esto en [Español](README-es.md).*

A fast, local-first web tool designed for developers to generate consistent Git branch names instantly.

All processing is done locally in your web browser, ensuring **complete control** of your data (Local-First). Built with **Vue 3 (Composition API)** and **TypeScript**.

## ✨ Key Features
- **Instant Formatting:** Automatically combines Project ID, Ticket ID, and Feature Name into a clean branch name.
- **History Management:** Keeps track of your last 10 generated names for quick access (stored locally).
- **Local Processing:** Everything happens client-side. No server-side storage or processing of your branch data.
- **Interface:** Clean, professional, and responsive design with native dark/light mode support.
- **Multi-language:** Support for English and Spanish.

## 🛠️ Built With
- **Vue.js 3** (Composition API) + **Vite**
- **TypeScript** for robust, typed code.
- **Vue-i18n** for multi-language support.
- **Vanilla CSS** for optimal performance and a professional "native" look.

## 📁 Project Architecture
The project follows a modular architecture separating business logic (`BranchManager`) from the view components. You can check the details in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 🚀 How to Run Locally
```sh
npm install
npm run dev
```

## 📄 License
This project is proprietary and all rights are reserved by Javier Nicolás Pérez Mesa. It is published exclusively for portfolio review, code audit, and personal use. See the `LICENSE` file for details.

---
Made with ❤️ 2026.
