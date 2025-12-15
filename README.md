# Forms & Reports

A schema-driven inspection and audit platform that allows users to select standardized inspection forms, complete them through an interactive UI, and generate professionally formatted PDF reports.

---

## 1. Tech Stack

### Frontend & Framework
- **Next.js (App Router)** – Server components for data fetching, client components for interactivity  
- **React 18** – Component-based UI with hooks  
- **TypeScript** – End-to-end type safety across UI, schema, and reports  

### Styling & UI
- **Tailwind CSS (v4)** – Utility-first styling following Refactoring UI principles  
- **Custom design tokens** – Centralized color system 

### State & Data Handling
- **Client-side caching & autosave** – Persistent draft state to prevent data loss  
- **Local storage–backed drafts** – Enables form recovery and edit-after-download  
- **Schema-driven rendering** – Forms rendered entirely from JSON schema  

### Reporting
- **pdf-lib** – Client-side PDF generation with tables, and structured layouts  

### Deployment
- **AWS Amplify** – CI/CD, hosting, and environment configuration  
- **GitHub** – Source control

---

## 2. Architecture

### High-Level Overview

```
User
 └── Selects Form
      └── Form Metadata API (/api/forms-meta)
            └── Form Cards UI
                  └── Form Wizard (Schema-driven)
                        ├── Section Navigation
                        ├── Field Rendering
                        ├── Autosave Drafts
                        └── Validation
                              └── PDF Generation
```

### Key Architectural Principles

#### Schema-Driven Forms
- All forms, sections, fields, and constraints are defined in JSON  
- No form logic is hardcoded in UI components  
- Enables easy extension and maintainability  

#### Separation of Concerns
- **Schema**: `/lib/forms/schema`  
- **Form State & Drafts**: `/lib/forms/hooks`, `/lib/forms/draft`  
- **Rendering**: `/components/forms`  
- **PDF Generation**: `/lib/reports/pdf.ts`  
- **UI Components**: `/components/ui`  

#### Client–Server Boundary
- Server components handle:
  - Form metadata loading
  - Initial page rendering  
- Client components handle:
  - User input
  - Autosave
  - Validation
  - PDF generation and download  

---

## 3. Dependencies

### Core
- `next` – React framework and routing  
- `react`, `react-dom` – UI rendering  
- `typescript` – Static typing  

### Styling
- `tailwindcss` – Utility-first CSS framework  

### Data & State
- `swr` – Client-side data fetching and caching (forms metadata)  
- Browser `localStorage` – Draft persistence  

### PDF Generation
- `pdf-lib` – Programmatic PDF creation (text, tables, pagination)  

### Tooling
- `eslint` – Code quality  
- `postcss` – Tailwind processing  

---

## 4. Features

### Form Selection
- Grid of available inspection forms  
- Metadata-driven cards (title and description)  
- Cached API responses for fast reloads  

### Dynamic Form Filling
- Multi-section form wizard with horizontal navigation  
- Field types supported:
  - Text, Date, Phone  
  - Boolean, Yes/No, Tri-State  
  - Textarea  
  - Multi-text lists  
  - Structured objects  
  - Tabular inputs  
  - Audit findings with evidence  
- Mandatory fields clearly marked with red asterisks  
- Section-level validation gates navigation  

### Autosave & Draft Recovery
- Answers saved immediately on input  
- Drafts persist across refreshes and navigation  
- Edit after report generation without data loss  

### Intelligent Navigation
- Previous / Next buttons reflect availability and validation state  
- Generate Report only enabled on final section  
- Clear resets answers and returns to first section  

### PDF Report Generation
- Question-and-answer formatted reports  
- Sequential numbering  
- Sentence-case labels (human-readable)  
- Real tables for tabular inputs  
- Multi-line object rendering  
- Automatic pagination without broken blocks  

### Post-Generation Actions
- Download generated report  
- Re-download last report  
- Edit current form  
- Clear and start over  
- Start a new form  

### Production-Ready UX
- Consistent color system
- Refactoring UI layout principles  
- Predictable interactions and visual hierarchy  
- No misleading disabled states  

---

## Summary

Forms & Reports is a scalable, schema-driven inspection platform designed for professional audits and operational workflows. The architecture emphasizes maintainability, type safety, and user experience, while producing clean, auditor-ready PDF outputs.
