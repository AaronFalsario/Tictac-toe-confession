# The Locked Room

A small, minimalist puzzle game built with React, Vite, Tailwind CSS, and Framer Motion. After the combination lock, players work through five games: tic-tac-toe, memory matching, a four-round word scramble with rising difficulty, a symbol-sequence game, and a sliding picture puzzle. Completing the envelope picture unlocks the envelope and final letter.

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

The envelope click starts playback immediately (and is the only event that starts the song). Browsers may block playback; if playback fails, an **Add song to play** fallback and music toggle are provided. Music loops and can be paused with the reveal-page music control. Ensure you have permission to use and distribute the audio file before publishing.

## How to personalize

- **Name:** Change `Ela` in `src/screens/RevealScreen.jsx` and `src/screens/YesScreen.jsx`.
- **Password/date:** Change `LOCK_DATE` in `src/screens/LockScreen.jsx`. Input is normalized to digits, so the supported slash, dash, and compact formats work.
- **Final letter:** Edit `letterParagraphs` in `src/screens/RevealScreen.jsx`. The reveal types it out automatically; the reader can skip the animation.
- **Music file:** Change `MUSIC_FILE` in `src/hooks/useBackgroundMusic.js` if you use a different public asset path.
- **Colors and fonts:** Adjust the Tailwind theme in `tailwind.config.js` and global styles in `src/index.css`. The reveal letter uses Cormorant Garamond.

The early screens intentionally use only a restrained navy, slate, teal, and amber game palette. The personal reveal is kept in the final room.

## Deploy to Vercel

The project is configured for Vercel in `vercel.json`. Vercel will run the Vite production build, publish `dist`, and route app paths to the React entry point.

### Deploy with the Vercel dashboard

1. Push the project to a GitHub, GitLab, or Bitbucket repository. Include `package.json`, `package-lock.json`, `vercel.json`, `src/`, `public/`, and `index.html`. Do not commit `node_modules/` or `dist/`; `.gitignore` excludes them.
2. In Vercel, select **Add New → Project** and import the repository.
3. Keep the detected Vite settings, or verify:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Select **Deploy**. No environment variables are required.

### Deploy with the Vercel CLI

From the project directory, run:

```bash
npm install
npm run build
npx vercel
```

For a production deployment, run `npx vercel --prod`.

The optional music asset is expected at `public/music/song.mp3` and is copied to `/music/song.mp3` in the build.

Netlify is also supported as a static Vite site with build command `npm run build` and publish directory `dist`.
