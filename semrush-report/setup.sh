#!/bin/bash
# Setup script for Semrush Report Generator

echo "Setting up Semrush Report Generator..."

# Backend setup
echo "Setting up Python backend..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
echo "Setting up Next.js frontend..."
cd frontend
npm install
cd ..

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env and add your Semrush API key"
fi

echo ""
echo "Setup complete!"
echo ""
echo "To run:"
echo "1. Backend: source venv/bin/activate && python run_backend.py"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Don't forget to add your Semrush API key to .env file!"
