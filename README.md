# Accounts Receivable – Invoice Management Prototype

This is a static front-end prototype (HTML/CSS/JS).

## Quick start

### Option 1 (recommended): Python HTTP server

```bash
cd /workspace/Invoice_Upload_1
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173`

Press `Ctrl + C` to stop the server.

### Option 2: VS Code Live Server

If you use VS Code with the **Live Server** extension:

1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Click **Open with Live Server**.

## What works

- Accounts Receivable main dashboard layout
- Top-right actions: Sync, Create Invoice, Upload Invoices
- Upload modal with drag/drop + click upload (XLS/XLSX)
- File list with per-file remove
- Upload History table with row behavior states
- Mapping and Import Preview step navigation

## Notes

- This is a high-fidelity prototype, not a production backend integration.
- Data shown in the table is mock/demo data from `app.js`.
