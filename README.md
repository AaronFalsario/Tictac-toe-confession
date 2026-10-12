# The Locked Room

A small, minimalist puzzle game built with React, Vite, Tailwind CSS, and Framer Motion. The first two rooms play as a straightforward combination puzzle and tic-tac-toe game; the final letter appears only after the player wins.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Background music

The music file is loaded from:

```text
public/music/song.mp3
```

The envelope click starts playback immediately (and is the only event that starts the song). Browsers may block playback; if playback fails, an **Add song to play** fallback and music toggle are provided. Music loops and can be paused with the reveal-page music control. The MP3 is user-provided and is not included in the source project.

## How to personalize

- **Name:** Change `Ela` in `src/screens/RevealScreen.jsx` and `src/screens/YesScreen.jsx`.
- **Password/date:** Change `LOCK_DATE` in `src/screens/LockScreen.jsx`. Input is normalized to digits, so the supported slash, dash, and compact formats work.
- **Final letter:** Edit `letterParagraphs` in `src/screens/RevealScreen.jsx`. The reveal types it out automatically; the reader can skip the animation.
- **Music file:** Change `MUSIC_FILE` in `src/hooks/useBackgroundMusic.js` if you use a different public asset path.
- **Colors and fonts:** Adjust the Tailwind theme in `tailwind.config.js` and global styles in `src/index.css`. The reveal letter uses Cormorant Garamond.

The early screens intentionally use only a restrained navy, slate, teal, and amber game palette. The personal reveal is kept in the final room.

## Deploy

Opening the envelope starts the optional music and plays a short full-screen floral transition into the pink letter page. The letter types out character by character in Cormorant Garamond, with a reading-progress bar and a skip-animation option. Music can be toggled from the reveal onward; it only starts after the envelope is opened.

This is a static Vite app and can be deployed to Vercel or Netlify. Connect the repository and use:

- Build command: `npm run build`
- Output directory: `dist`

Upload your own licensed MP3 to `public/music/` before deploying if you want the optional background music.
