# ThorFlow

ThorFlow is a high-fidelity demo of a thoracic surgery perioperative workflow platform. It shows how a doctor-facing workflow console, a patient-facing mini-app experience, and a lightweight workflow engine can coordinate the journey from hospital check-in to pre-op exams, surgery, pathology, discharge, and follow-up.

> Demo only: ThorFlow does not connect to real hospital systems, WeChat, PACS, EMR, or production AI services. All patient records are anonymized mock data.

## Product Concept

ThorFlow is designed as a clinical workflow OS for thoracic surgery teams:

- **Doctor Console**: web/desktop dashboard for workflow pools, patient queues, surgery status, pathology entry, and follow-up planning.
- **Patient Mini-App Simulation**: mobile-sized interface for check-in, exam upload, task completion, notifications, and follow-up reminders.
- **Workflow Engine**: local TypeScript logic that models status transitions, timeline events, patient notifications, exam task generation, and follow-up plan generation.

## Demo Workflow

The demo is built around one end-to-end perioperative loop:

1. Patient scans code and checks in.
2. Patient completes basic information.
3. Patient uploads pre-op exam order.
4. AI-like recognition extracts required exams.
5. Patient marks exam items as completed.
6. Doctor receives pre-op completion alert.
7. Doctor schedules surgery.
8. Patient receives surgery notification.
9. Doctor marks surgery milestones: entering OR, surgery completed, ICU/monitoring, back to ward.
10. Patient receives status notifications.
11. Doctor records pathology and staging.
12. Workflow engine generates follow-up plan.
13. Patient sees the follow-up timeline.

## Key Features

### Doctor-Side Workflow Console

- Workflow pools for check-in, pre-op exams, review, surgery scheduling, today surgery, ICU/monitoring, pathology, discharge, follow-up, and overdue exceptions.
- Focused pages for:
  - `/dashboard/preop`
  - `/dashboard/surgery`
  - `/dashboard/pathology`
  - `/dashboard/followup`
- Patient detail page with:
  - basic patient information
  - perioperative timeline
  - key clinical actions
  - pathology entry
  - AI-style perioperative analysis
  - CT imaging preview modal

### Patient Mini-App Simulation

- Mobile shell with mini-app style navigation.
- Check-in form for name, phone, inpatient number, ID suffix, history, allergy, smoking history, and family contact.
- Exam upload demo with AI-like recognition animation.
- Task checklist for enhanced CT, pulmonary function, ECG, blood routine, coagulation, liver/kidney function, and anesthesia assessment.
- Notification center for surgery, ICU, pathology, and follow-up events.
- Follow-up plan page with next visit date, required exams, treatment reminders, and doctor notes.

### Workflow Engine

Local workflow utilities in `lib/workflow-engine.ts` support:

- clear perioperative status definitions
- next-status calculation
- timeline event generation
- patient notification generation
- exam task generation from recognized orders
- follow-up plan generation from pathology and staging input

The current implementation uses local mock data and browser storage, while keeping data structures ready for a future Supabase or real backend integration.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript
- **Icons**: lucide-react
- **Motion**: framer-motion
- **State**: client-side provider plus localStorage-backed demo data

## Project Structure

```text
app/
  dashboard/              Doctor-side workflow routes
  patient/[id]/           Doctor-side patient detail page
  patient-mini/           Patient mini-app simulation

components/
  dashboard/              Doctor console modules
  patient/                Patient detail, timeline, actions, pathology
  patient-mini/           Mobile mini-app views and shell
  workflow/               Shared workflow page components
  providers/              Local patient workflow provider
  ui/                     Small reusable UI primitives

lib/
  mock-data.ts            Anonymized demo patient data
  workflow-engine.ts      Workflow status and event logic
  workflow.ts             Dashboard and timeline helpers
  followup-templates.ts   Follow-up plan templates
  notification-templates.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/dashboard
```

The project currently uses Webpack for `dev` and `build` scripts because this local demo has been developed in a OneDrive-synced path where Turbopack can infer the wrong workspace root when multiple lockfiles exist.

## Useful Scripts

```bash
npm run dev      # start local development server
npm run build    # production build
npm run start    # start production server after build
npm run lint     # run ESLint
```

## Recommended Demo Path

Use the following route sequence when presenting the product:

1. `/dashboard`
2. `/patient-mini?patient=PT-1004`
3. `/patient-mini/tasks?patient=PT-1004`
4. `/dashboard/preop`
5. `/patient/PT-1004`
6. `/dashboard/pathology`
7. `/patient-mini/followup?patient=PT-1004`

## Data and Compliance Notes

- All demo patient names use anonymized labels such as `患者A`, `患者B`, and `患者C`.
- Phone numbers and inpatient numbers are mock or masked.
- The app is not a medical device and must not be used for real clinical decision-making.
- The AI copy, imaging preview, notifications, and follow-up plans are simulated for workflow demonstration only.
- No real patient data should be committed to this repository.

## Roadmap Ideas

- Supabase-backed patient, task, notification, and timeline persistence.
- Role-based views for surgeon, nurse, anesthesiology, ICU, and follow-up coordinator.
- Real notification adapter layer for SMS, enterprise WeChat, or hospital mini-app integration.
- Structured pathology templates and configurable follow-up rules.
- Audit log for workflow actions and status transitions.
- Demo seed/reset controls for investor or clinical presentation scenarios.

## Repository

GitHub remote:

```text
https://github.com/DonoghZZZ/thorflow.git
```
