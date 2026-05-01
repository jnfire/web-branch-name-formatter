# Project Architecture

The **Branch Name Formatter** is built with a focus on simplicity, maintainability, and privacy.

## 🏗️ Core Structure

### 1. Logic Layer (Core)
- **`Branch.ts`**: The entity representing a branch name. It handles the formatting logic (joining parts with dashes, etc.).
- **`BranchManager.ts`**: A singleton class that manages the list of branches, handles storage in `localStorage`, and limits the history to 10 records.

### 2. UI Layer (Vue Components)
- **`App.vue`**: The main container, orchestrating the state and the layout.
- **`BranchForm.vue`**: Handles user input and emits the data to be processed.
- **`BranchList.vue` / `BranchItem.vue`**: Display the historical records.
- **`Footer.vue`**: Static information about the project and license.

### 3. Localization
- **`i18n/`**: Contains the JSON translation files and the configuration for `vue-i18n`.

## 🔒 Privacy & Data
No data ever leaves the user's browser. We do not use any external APIs or tracking services. Everything is stored in the browser's `localStorage`.
