#!/usr/bin/env python3
"""Run the Flask backend server"""
import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_dir))

from app import app
from config import BACKEND_PORT

if __name__ == '__main__':
    # Railway provides PORT env var, use it if available
    port = int(os.getenv('PORT', BACKEND_PORT))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"Starting Semrush Report API server on port {port}")
    print(f"API will be available at http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
