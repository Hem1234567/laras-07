# LARAS Web Scraping System

This project contains the web scraping infrastructure for the Land Acquisition Risk Awareness System (LARAS).

## Project Structure

- `scrapers/`: Python scripts for extracting data.
  - `scrape_nhai.py`: Extracts project data from NHAI website.
  - `scrape_gazette.py`: Searches and extracts land acquisition notifications from e-Gazette.
- `supabase/functions/`: Supabase Edge Functions.
  - `daily-scrape/`: TypeScript function to trigger/orchestrate scraping and store data.
- `requirements.txt`: Python dependencies.

## Setup & Running via Python

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run NHAI Scraper**
   ```bash
   python scrapers/scrape_nhai.py
   ```
   This will generate a `data/nhai_projects.csv` file.

3. **Run e-Gazette Scraper**
   ```bash
   python scrapers/scrape_gazette.py
   ```
   This will generate a `data/gazette_notifications.csv` file.

## Supabase Edge Function

The edge function is located in `supabase/functions/daily-scrape`.

To deploy (requires Supabase CLI):
```bash
supabase functions deploy daily-scrape
```

To run locally (requires Deno):
```bash
deno run --allow-net --allow-env supabase/functions/daily-scrape/index.ts
```
