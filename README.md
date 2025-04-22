# 🏥 Doctor Booking UI Module

> A fully **responsive**, **accessible**, and **AI-assisted** appointment booking UI built with **Next.js**, **TailwindCSS**, and **Redux-toolkit**.

---

## 🚀 Project Overview

This project is a frontend-only implementation of a healthcare appointment booking system. It consists of:

- **Doctor Directory View** with filter options
- **Booking Modal** for selecting time slots
- **Appointments Summary View**

The solution was designed with **clean architecture**, **component modularity**, and **accessibility** in mind, and is optimized for keyboard navigation and responsive layouts across all screen sizes.

---

## 🧰 Tech Stack

- **Framework:** Next.js 14+
- **Styling:** TailwindCSS
- **State Management:** Redux-toolkit
- **Mock Data:** Faker.js
- **AI Tools:** Cursor & GitHub Copilot for scaffolding and accessibility hints

---

## 📦 Getting Started

Follow these steps to get the project up and running locally:

### 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (bundled with Node.js)

### 🔨 Clone & Install

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/doctor-booking-ui.git
   cd doctor-booking-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### 🏗 Build

Run the production build:

```bash
npm run build
```

> **⚠️ Important:** Wait **until the build process finishes completely** before moving on. You should see a success message like `Compiled successfully` or `Build complete`.

### ▶️ Start

Start the production server:

```bash
npm run start
```

### 🌐 Open in your browser

Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## ⚖️ License

This project is licensed under the MIT License.

---

## 🚧 Known Limitations & Next Steps

- **No theming or dark mode**: All styles are hard‑coded to the default light theme. **Next Step:** Implement TailwindCSS theming with a light/dark mode toggle.
- **Mock data only**: Currently uses Faker.js to generate mock doctor and appointment data. **Next Step:** Integrate with a real backend REST/GraphQL API.
- **Lack of automated tests**: No unit, integration, or end‑to‑end tests in place. **Next Step:** Introduce Jest with React Testing Library for unit tests and Cypress for end‑to‑end testing.
