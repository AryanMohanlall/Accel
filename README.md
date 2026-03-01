# Accel

**Accel** is a modern sales workflow and automation platform built with **Next.js**.
It helps teams manage opportunities, create proposals, track contracts, and monitor activity in a single streamlined dashboard. The system is designed to reduce repetitive work and give sales teams more time to focus on closing deals.

## Live Demo

Access the deployed application here:
[https://accel-nu.vercel.app/](https://accel-nu.vercel.app/)

## Figma Design

Project design and UI mockups:
[https://www.figma.com/design/nLVeaPiTqG1MuwlkckH8FG/Frontend-Project](https://www.figma.com/design/nLVeaPiTqG1MuwlkckH8FG/Frontend-Project)

## Overview

Accel acts as a sales management layer that organizes the full lifecycle of a deal. From discovering opportunities to finalizing contracts, the platform provides a clear and structured workflow.

The application focuses on:

* Improving visibility across the sales pipeline
* Reducing manual tracking
* Centralizing deal-related information
* Providing quick access to activities and updates

## Features

### Opportunities

* Track potential deals
* View opportunity details
* Monitor deal progress

### Proposals

* Create and manage proposals
* Associate proposals with opportunities
* Keep proposal information organized

### Contracts

* Manage finalized agreements
* Link contracts to deals and proposals
* Maintain a clear record of commitments

### Dashboard

* High-level overview of the sales pipeline
* Key metrics and summaries
* Quick navigation to important sections

### Activities

* Track updates and actions taken
* Maintain a history of interactions
* Improve collaboration and transparency

### AI Assistant

* Ask the system for intelligent suggestions or summaries
* Powered by Gemini generative model via Google AI Studio
* Accessible under the "AI Assistant" section in the app

### Chat

* Real‑time messaging between users and support
* Built with Stream Chat; requires API key and secret
* Integrated into the home dashboard for efficient communication

## Tech Stack

* **Framework:** Next.js
* **Frontend:** React
* **Deployment:** Vercel
* **Design:** Figma

## Project Structure

```
accel/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   └── register/
│   │       ├── page.tsx
│   │       └── style.ts
│   ├── (home)/
│   │   ├── layout.tsx
│   │   ├── style.ts
│   │   ├── activities/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   ├── ai-assistant/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   ├── clientscontacts/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   ├── contracts/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   ├── opportunities/
│   │   │   ├── page.tsx
│   │   │   └── style.ts
│   │   └── proposals/
│   │       ├── page.tsx
│   │       └── style.ts
│   ├── api/
│   │   └── gemini/
│   │       └── messages/
│   ├── components/
│   │   ├── ClientCard.tsx
│   │   ├── ContactRow.tsx
│   │   ├── ShareTenantButton.tsx
│   │   └── contracts/
│   │       └── contracts.tsx
│   ├── hoc/
│   │   └── withAuth.tsx
│   ├── providers/
│   │   ├── activitiesProvider/
│   │   │   ├── actions.ts
│   │   │   ├── context.ts
│   │   │   ├── index.tsx
│   │   │   └── reducers.ts
│   │   ├── clientsProvider/
│   │   ├── contactsProvider/
│   │   ├── contractsProvider/
│   │   ├── opportunitiesProvider/
│   │   ├── proposalsProvider/
│   │   └── userProvider/
│   └── utils/
│       └── axiosInstance.ts
├── public/
├── .env
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Installation

Clone the repository

```bash
git clone https://github.com/AryanMohanlall/Accel.git
```

Navigate to the project

```bash
cd accel
```

Install dependencies

```bash
npm install
```

### Environment Variables

Before running the application, set up your environment variables:

**Create a `.env` file in the root directory and add:**

```
NEXT_API_URL=your_api_url_here
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_STREAM_API_KEY=your_stream_public_key_here
STREAM_API_SECRET=your_stream_api_secret_here
```

* `GEMINI_API_KEY` is used by the AI Assistant feature (models from Google AI Studio). You can obtain it from [Google AI Studio](https://aistudio.google.com/app/apikey).
* `NEXT_PUBLIC_STREAM_API_KEY` and `STREAM_API_SECRET` are required for the Chat functionality powered by Stream. Obtain these from your Stream dashboard.

Run the development server

```bash
npm run dev
```


## Deployment

The project is deployed using **Vercel**:

[https://accel-nu.vercel.app/](https://accel-nu.vercel.app/)


---
