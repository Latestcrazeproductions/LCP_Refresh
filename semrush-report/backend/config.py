"""Configuration for Semrush Report Generator"""
import os
from dotenv import load_dotenv

load_dotenv()

# Semrush API Configuration
SEMRUSH_API_KEY = os.getenv('SEMRUSH_API_KEY', '')
SEMRUSH_API_BASE_URL = 'https://api.semrush.com'

# Default Domain
DEFAULT_DOMAIN = 'latestcrazeproductions.com'

# Report Configuration
REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'reports')
MAX_KEYWORDS = 100
MAX_BACKLINKS = 1000
HISTORICAL_MONTHS = 12

# API Rate Limiting
API_RATE_LIMIT_DELAY = 1  # seconds between API calls
MAX_RETRIES = 3

# Server Configuration
# Port 5001: 6000 blocked by fetch spec (X11); 5001 avoids AirPlay on 5000
BACKEND_PORT = int(os.getenv('PORT', os.getenv('BACKEND_PORT', '5001')))

# CORS Configuration
# In development (no FRONTEND_URL): allow all origins so any access URL works
# In production: only allow explicit FRONTEND_URL
FRONTEND_URL = os.getenv('FRONTEND_URL', '')
CORS_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
]
if FRONTEND_URL:
    CORS_ORIGINS.append(FRONTEND_URL)
# Development: allow all origins (covers http://172.16.x.x:3000, etc.)
CORS_ALLOW_ALL = not bool(FRONTEND_URL)
