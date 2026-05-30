# esp32basicprojects

Simple ESP32 workshop project pages collected in a lightweight static site.

## Project files

- `website` contains the main HTML page for the workshop content.
- `index.html` acts as the localhost-friendly entrypoint and loads `website`.

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
- The site is fully static and can be hosted by any basic web server.
- `index.html` was added so the page works cleanly at the root URL without renaming the original `website` file.
