# Semrush Domain Analytics Report Generator

A web dashboard for generating comprehensive Semrush analytics reports for any domain using the Semrush API.

## Features

- **Web Dashboard**: Modern, interactive UI built with Next.js
- **Comprehensive Reports**: Collects data from all major Semrush dashboard sections
- **Real-time Generation**: Watch progress as reports are generated
- **Interactive Viewing**: Explore reports with charts, tables, and filters
- **Export Options**: Download reports as JSON

## Prerequisites

- Python 3.8+
- Node.js 18+
- Semrush API key (get from Semrush → Subscription Info → API Key)

## Local Development Setup

> **Note:** The Semrush dashboard is **integrated into LCP_Refresh** at `/cms/semrush`. For normal use, run the main LCP_Refresh app (`npm run dev` from project root) and the backend below. The standalone `frontend` app (port 3001) is optional for isolated testing.

### 1. Backend Setup

```bash
cd semrush-report
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure API Key

Create a `.env` file in the `semrush-report` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Semrush API key:

```
SEMRUSH_API_KEY=your-api-key-here
BACKEND_PORT=5001
```

### 3. Run the Application

**Terminal 1 - LCP_Refresh (main app with landing page + CMS + Semrush):**
```bash
cd LCP_Refresh
npm run dev
```

App runs on `http://localhost:3000`. Log in at `/cms/login`, then choose **SemRush Reports** from the dashboard.

**Terminal 2 - Backend:**
```bash
cd semrush-report
source venv/bin/activate
python run_backend.py
```

Backend runs on `http://localhost:5001` (6000 blocked by fetch spec)

## Usage

1. Open `http://localhost:3000` in your browser (LCP_Refresh landing page)
2. Click **Log in** → sign in at `/cms/login`
3. On the dashboard, choose **SemRush Reports**
4. Go to **Settings** and enter your Semrush API key; click **Test** to verify
5. Return to Semrush dashboard
6. Enter domain (default: `latestcrazeproductions.com`)
7. Click **Generate New Report**
8. Wait for report generation (30-60 seconds)
9. View the report in the interactive viewer

## Report Sections

Each report includes:

- **Overview**: Domain authority, rank, traffic estimates
- **Keywords**: Top organic keywords with positions and volumes
- **Backlinks**: Backlink analysis and referring domains
- **Competitors**: Competitor comparison
- **Traffic**: Historical traffic trends (12 months)
- **Content**: Top pages by traffic

## Deployment

### Backend Deployment (Railway)

1. **Create Railway Account** at [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or upload code)
   - Select this repository

3. **Configure Environment Variables**:
   - `SEMRUSH_API_KEY` = your Semrush API key
   - `FRONTEND_URL` = your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `PORT` = Railway sets this automatically (don't set manually)

4. **Set Root Directory** (if deploying from monorepo):
   - In Railway project settings, set root directory to `semrush-report`

5. **Deploy**:
   - Railway will automatically detect Python
   - Install dependencies from `requirements.txt`
   - Run `python run_backend.py`
   - Service will be available at `https://your-app.railway.app`

6. **Get Backend URL**:
   - Copy the Railway-provided public URL
   - Use this for frontend `NEXT_PUBLIC_API_URL`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd semrush-report/frontend
   vercel
   ```
   
   Or connect GitHub repo to Vercel dashboard

3. **Configure Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = your Railway backend URL (e.g., `https://your-app.railway.app`)

4. **Deploy**:
   - Vercel will build and deploy automatically
   - Frontend will be available at `https://your-app.vercel.app`

5. **Update Railway CORS**:
   - Go back to Railway project
   - Update `FRONTEND_URL` environment variable to your Vercel URL
   - Redeploy backend

## Project Structure

```
semrush-report/
├── backend/
│   ├── app.py                 # Flask server
│   ├── config.py              # Configuration
│   └── services/
│       ├── semrush_client.py  # Semrush API client
│       └── data_collector.py  # Data collection
├── frontend/
│   ├── pages/                 # Next.js pages
│   ├── components/            # React components
│   └── lib/                   # API client
├── reports/                   # Generated reports (JSON)
├── requirements.txt           # Python dependencies
├── Procfile                   # Railway process file
└── railway.json               # Railway configuration
```

## API Endpoints

- `GET /api/status` - Check API status
- `POST /api/test` - Test Semrush API connection
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/export` - Export report as JSON
- `DELETE /api/reports/:id` - Delete report
- `GET /api/metrics/latest` - Get quick stats from latest report

## Notes

- Reports are stored as JSON files in the `reports/` directory
- API rate limits: Semrush API has rate limits; the script includes delays between calls
- Data freshness: API data may have 1-7 day delays
- Historical data: Collects last 12 months where available
- Port 5001: Default port changed from 5000 to avoid macOS AirPlay Receiver conflict

## Troubleshooting

**Backend won't start:**
- Check Python version: `python3 --version` (need 3.8+)
- Verify dependencies: `pip install -r requirements.txt`
- Check API key is set in `.env`
- If port 5000 is in use, ensure `.env` has `BACKEND_PORT=5001`

**Frontend won't start:**
- Check Node version: `node --version` (need 18+)
- Install dependencies: `npm install`
- Check port 3000 is available

**API errors:**
- Verify API key is correct in Settings
- Check Semrush account has API access enabled
- Ensure domain is valid (no http:// or https://)

**Railway deployment issues:**
- Ensure `Procfile` exists in root directory
- Check environment variables are set correctly
- Verify `FRONTEND_URL` matches your Vercel URL for CORS
- Check Railway logs for error messages

**Vercel deployment issues:**
- Ensure `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
- Check build logs for compilation errors
- Verify API URL is accessible (test in browser)

## License

MIT
