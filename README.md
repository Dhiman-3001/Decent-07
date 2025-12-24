# Decent Public School Website

A state-of-the-art, responsive web platform for **Decent Public School, Guwahati**, crafted with Next.js 16, React 19, and Tailwind CSS 4. This project represents the school's digital presence, offering a premium user experience with modern aesthetics, smooth animations, and comprehensive information access for parents, students, and staff.

## 🚀 Overview

This repository hosts the official source code for the Decent Public School website. The platform serves as a complete digital ecosystem, providing features ranging from dynamic admission portals to real-time administrative controls for gallery management.

**Key Design Principles:**
- **Visual Excellence:** A "wow" factor with curated color palettes, elegant typography, and glassmorphism effects.
- **Responsiveness:** Fully fluid layouts optimized for mobile, tablet, and desktop devices.
- **Performance:** Optimized for speed, interactivity, and SEO best practices.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Core:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid transitions.
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) primitives.
- **Theme:** Dark/Light mode support via `next-themes`.

## ✨ Key Features

### 1. **Public Information Portal**
- **Leadership Messages:** Dedicated sections for the Principal and Vice Principal with distinct visual themes.
- **Admissions & Academics:** Structured details about admission processes, curriculum, and the "Digital Fruit" app.
- **Infrastructure:** Visual tours of school facilities.
- **Events:** Timely updates on school activities.

### 2. **Admin Dashboard & Gallery Management**
- **Secure Authentication:** Custom admin login with environment-based credentials.
- **Dynamic Gallery System:**
  - **Upload & Crop:** Add new images with a built-in cropper supporting zoom, pan, and drag.
  - **Auto-Serialization:** Automatically names files (e.g., `img-34.jpeg`) to maintain sequential order.
  - **Smart Deletion:** Deleting an item automatically renames subsequent files to fill gaps, keeping the gallery sequence intact.
  - **Video Support:** Management for gallery videos alongside images.

### 3. **Student Services (Planned/In-Progress)**
- **Bus Tracking:** Systems for route management and capacity checking.
- **Live Location:** Real-time driver tracking features (Uber-like map updates).
- **Student Forms:** Digital application forms with validation.

## 📂 Project Structure

```bash
src/
├── app/                  # Application routes (App Router)
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # Server-side API routes (Auth, Upload, Gallery operations)
│   ├── login/            # Admin authentication page
│   ├── gallery/          # Public gallery page
│   └── ...               # Other public pages (About, Contact, etc.)
├── components/           # Reusable UI components
│   ├── admin/            # Admin-specific tools (Image Cropper, etc.)
│   ├── gallery/          # Gallery grid and lightbox components
│   ├── ui/               # Generic UI atoms (Buttons, Inputs, Dialogs)
│   └── ...
├── data/                 # JSON data stores (gallery.json, events.json)
└── lib/                  # Utility functions and shared logic
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/Dhiman-3001/Decent-07.git
cd decent-public-school
npm install
```

### 3. Environment Setup
Create a `.env` or `.env.local` file in the root directory with the following credentials:
```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Accessing Admin Features
Navigate to `/login` to access the admin authentication page. Use the credentials configured in your environment variables.

## 📜 License

This project is proprietary software belonging to **Decent Public School**. All rights reserved.

---
*Built with ❤️ for Decent Public School, Guwahati.*
