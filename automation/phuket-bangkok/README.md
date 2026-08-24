# Almullhim Travel – Admin Automation (Prices)

This script updates existing packages in the admin UI by **matching `رمز الباقة`** and filling the **price**.

## What it does

- Opens: `https://almullhimtravel.runasp.net/admin/packages`
- You log in manually (credentials are **not** stored in the script)
- For each row, it opens the edit modal, reads **رمز الباقة**
- If the code is in `prices.json`, it fills **السعر** and asks you to confirm saving (`y/n`)
- Writes a `report.json` at the end

## Setup (Windows)

1. Install Node.js (18+ recommended)
2. In this folder:

```bash
npm install
npm run install:browsers
```

## Run

```bash
npm run update:prices
```

## Notes

- Destination fallback is set to `تايلند` only if destination field is empty.
- Video link is ignored.
- If pagination exists and there is a "التالي" button, the script will try to move through pages.

Edit `prices.json` to add/remove package codes and prices.
