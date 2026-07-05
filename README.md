# esp32basicprojects

Simple ESP32 workshop project pages collected in a lightweight static site.

## Project files

- `index.html` is the main static site entrypoint for local hosting and deployment.
- `website` is the original source copy kept in the repo.

## Run locally

Start a simple local web server from the project folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Notes

- No build step is required.
- The site is fully static and can be hosted by any basic web server or platform such as Vercel.
- Deploy the repository as a plain static site with `index.html` at the root.

## Next.js Showcase

A complete Next.js App Router version of the community projects feature now lives in `nextjs-community-projects-showcase/`.

Run it locally with:

```powershell
Set-Location .\nextjs-community-projects-showcase
npm install
npm run dev
```

The showcase is already wired to the provided Google Sheets CSV and Google Apps Script Web App URLs.
