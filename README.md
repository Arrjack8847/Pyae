# Pyae — Interactive Romantic Web Experience

A personalised interactive web experience created as a digital surprise gift. The project guides the visitor through a sequence of playful choices, animated scenes, music, a love letter, and a final flower reveal.

## Overview

This project is a small storytelling website built around interaction and emotion rather than a traditional page layout.

The experience begins with a choice-based opening screen and continues through several animated stages:

* Love gate
* Question gate
* Romantic sky scene
* Love letter
* Flower reveal

Each stage uses smooth transitions, visual effects, and audio to create a memorable digital gift experience.

## Features

* Multi-step interactive storytelling flow
* Animated transitions between sections
* Playful “Yes / No” interaction
* Dynamic button movement and scaling
* Animated GIF reactions
* Background music playback
* Romantic sky visual scene
* Digital love letter section
* Final flower reveal
* Responsive layout for desktop and mobile

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React
* ESLint

## Project Structure

```text
src/
  components/
    FlowerReveal.tsx
    LoveGate.tsx
    LoveLetter.tsx
    QuestionGate.tsx
    RomanticSky.tsx
  App.tsx
  main.tsx

public/
  gifs/
  music.mp3
  images/
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/Arrjack8847/Pyae.git
cd Pyae
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local site in your browser:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## What I Learned

* Building a multi-step interaction flow with React state
* Creating animated page transitions with Framer Motion
* Managing interactive buttons and dynamic UI feedback
* Adding sound effects and background audio in a React application
* Designing emotional digital storytelling through frontend development
* Structuring reusable components for different stages of an experience

## Author

**Soe Min Khant**

* GitHub: https://github.com/Arrjack8847
* Portfolio: https://jack-nex-studio.vercel.app

---

This is a personal creative project created for interactive storytelling and frontend experimentation.
