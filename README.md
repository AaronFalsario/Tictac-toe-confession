# The Locked Room

A small, minimalist puzzle game built with React, Vite, Tailwind CSS, and Framer Motion. The first two rooms play as a straightforward combination puzzle and tic-tac-toe game; the final letter appears only after the player wins.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Background music

Add your own licensed copy of **“Take a Chance With Me” by NIKI** at:

```text
public/music/take-a-chance-with-me.mp3
```

The game requests playback only when the envelope is opened. Browsers may block playback or the file may be missing; in either case a **Play music** control is provided. Music loops and can be paused with the top-right music control. The MP3 is intentionally not included.

## How to personalize

- **Name:** Change `Ela` in `src/screens/RevealScreen.jsx` and `src/screens/YesScreen.jsx`.
- **Password/date:** Change `LOCK_DATE` in `src/screens/LockScreen.jsx`. Input is normalized to digits, so the supported slash, dash, and compact formats work.
- **Final letter:** Edit `letterLines` in `src/screens/RevealScreen.jsx`.
- **Music file:** Change `MUSIC_FILE` in `src/hooks/useBackgroundMusic.js` if you use a different public asset path.
- **Colors and fonts:** Adjust the Tailwind theme in `tailwind.config.js` and global styles in `src/index.css`.

The early screens intentionally use only a restrained navy, slate, teal, and amber game palette. The personal reveal is kept in the final room.

## Deploy

Opening the envelope plays a short full-screen floral transition into the pink letter page. The letter unfolds, reveals its paragraphs gradually, and includes a reading-progress bar and a skip-animation option. Music can be toggled from the reveal onward; it only starts after the envelope is opened.

This is a static Vite app and can be deployed to Vercel or Netlify. Connect the repository and use:

- Build command: `npm run build`
- Output directory: `dist`

Upload your own licensed MP3 to `public/music/` before deploying if you want the optional background music.
