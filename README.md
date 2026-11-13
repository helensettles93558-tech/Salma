# A birthday gift for Salma ✦

A single-page, mobile-first birthday experience made with plain HTML, CSS, and JavaScript. There is no build step: open `index.html` in a browser, or host this folder as a static site. The animations use GSAP/ScrollTrigger and canvas-confetti from CDNs, so an internet connection is needed for those libraries and Google Fonts.

## Make it yours

Open `index.html` in a text editor and personalize these spots:

1. **Age:** `.age-number` is set to 20. Change its `data-count` value if you ever need to update it. The displayed number counts up when it scrolls into view.
2. **Your name / sign-off:** edit `#signature` and `#closingSign`. The default is a sisterly sign-off; put your name or nickname there if you like.
3. **Letter:** replace the Arabic and English text in the `data-ar` and `data-en` attributes on `#letterText`. Keep `\n\n` between paragraphs. The Arabic text is what she sees first.
4. **Reasons and memories:** edit the text in the six `.reason-card` blocks and three `.memory-item` blocks in `index.html`. Their `data-ar` and `data-en` values power the language switch.
5. **Your memories:** edit the three story cards and four flip-to-reveal promise cards in `index.html` to add your own inside jokes and favorite moments. The experience is designed to work beautifully without photos.
6. **Music:** add an MP3 named `music.mp3` to `assets/` (so it is `assets/music.mp3`). Playback begins only after she presses the music button. No music file is included, so choose a song you have permission to share.
7. **Name:** the page is written for Salma; search `index.html` for `Salma` / `سلمى` to edit any name references.

The intro, cake, wishes, language toggle, keepsake cards, hidden heart, and replay button need no extra setup. Placeholder text is intentionally easy to personalize.

## Preview locally

Double-click `index.html`. For the smoothest experience use a current version of Chrome, Edge, Firefox, or Safari. External fonts and animation libraries load from the internet.

## Host it free

### GitHub Pages

1. Create a GitHub repository and upload the contents of this folder (keep `index.html` at the repository root).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. GitHub will provide a link under the Pages settings after deployment completes. Send that link to Salma.

### Netlify

1. Create a free Netlify account and choose **Add new site → Deploy manually** (or drag this project folder into Netlify Drop).
2. Netlify publishes the static files and gives you a shareable `*.netlify.app` link.

Keep `index.html`, `css/`, `js/`, and `assets/` together when uploading. The site doesn't need a build command.
