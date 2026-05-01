# Branch Name Formatter 🌿

*Leer esto en [Español](README-es.md).*

A fast, private, and serverless web tool designed for developers to generate consistent Git branch names instantly. 

All processing is done locally in your web browser, ensuring **total privacy** for your data. Built with **Vue 3 (Composition API)** and **TypeScript**.

## ✨ Key Features
- **Instant Formatting:** Automatically combines Project ID, Ticket ID, and Feature Name into a clean branch name.
- **History Management:** Keeps track of your last 10 generated names for quick access (stored locally).
- **Total Privacy:** Everything happens 100% client-side. No trackers, no server processing.
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
This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the `LICENSE` file for more details.

---
Made with ❤️ 2026.
