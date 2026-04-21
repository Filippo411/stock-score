# StockScore — Fundamental + Technical Analysis Dashboard

Tool per analisi rapida di titoli azionari con scoring composito fondamentale (55%) + tecnico (45%).

## Deploy su GitHub Pages

### Setup (una volta sola)

1. Crea un nuovo repository su GitHub chiamato `stock-score`
2. Vai su **Settings → Pages → Source** e seleziona **GitHub Actions**
3. Clona il repo in locale:
   ```bash
   git clone https://github.com/TUOUSERNAME/stock-score.git
   ```
4. Copia tutti questi file nella cartella clonata
5. Push:
   ```bash
   cd stock-score
   git add .
   git commit -m "Initial deploy"
   git push origin main
   ```
6. GitHub Actions builda e deploya automaticamente
7. Il sito sarà live su: `https://TUOUSERNAME.github.io/stock-score/`

### Aggiornamenti

Ogni push su `main` aggiorna automaticamente il sito. Modifica `src/App.jsx` per cambiare la dashboard.

### Sviluppo locale

```bash
npm install
npm run dev
```

Apri `http://localhost:5173/stock-score/` nel browser.

## Struttura

```
stock-score/
├── .github/workflows/deploy.yml  ← GitHub Actions (build + deploy)
├── src/
│   ├── main.jsx                  ← Entry point React
│   └── App.jsx                   ← Dashboard component
├── index.html                    ← HTML template
├── package.json                  ← Dependencies
├── vite.config.js                ← Vite config con base path
└── README.md
```
