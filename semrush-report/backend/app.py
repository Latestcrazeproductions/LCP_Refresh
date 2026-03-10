"""Flask backend server for Semrush Report Generator"""
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
from pathlib import Path
import sys

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from config import REPORTS_DIR, CORS_ORIGINS, CORS_ALLOW_ALL, BACKEND_PORT
from services.data_collector import DataCollector
from services.semrush_client import SemrushAPIError

app = Flask(__name__)
CORS(app, origins='*' if CORS_ALLOW_ALL else CORS_ORIGINS)

# Ensure reports directory exists
Path(REPORTS_DIR).mkdir(parents=True, exist_ok=True)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint for load balancers, Railway, and monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'semrush-report-api',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
    }), 200


@app.route('/api/status', methods=['GET'])
def status():
    """Check API status"""
    return jsonify({
        'status': 'ok',
        'message': 'Semrush Report API is running'
    })


@app.route('/api/test', methods=['POST'])
def test_api():
    """Test Semrush API connection"""
    try:
        data = request.json
        api_key = data.get('api_key', '')
        
        if not api_key:
            return jsonify({'error': 'API key required'}), 400
        
        collector = DataCollector(api_key)
        test_result = collector.client.test_connection()
        
        return jsonify({
            'success': test_result,
            'message': 'API connection successful' if test_result else 'API connection failed'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reports/generate', methods=['POST'])
def generate_report():
    """Generate a new Semrush report"""
    try:
        data = request.json
        domain = data.get('domain', 'latestcrazeproductions.com')
        api_key = data.get('api_key', '')
        
        if not api_key:
            return jsonify({'error': 'API key required'}), 400
        
        # Collect data
        collector = DataCollector(api_key)
        report_data = collector.collect_full_report(domain)
        
        # Save report
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        filename = f"{domain.replace('.', '_')}_{timestamp}.json"
        filepath = os.path.join(REPORTS_DIR, filename)
        
        with open(filepath, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        # Return report ID (filename without extension)
        report_id = filename.replace('.json', '')
        
        return jsonify({
            'success': True,
            'report_id': report_id,
            'filename': filename,
            'generated_at': report_data['generated_at']
        })
    except SemrushAPIError as e:
        return jsonify({'error': f'Semrush API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reports', methods=['GET'])
def list_reports():
    """List all generated reports"""
    try:
        reports = []
        for filename in os.listdir(REPORTS_DIR):
            if filename.endswith('.json'):
                filepath = os.path.join(REPORTS_DIR, filename)
                stat = os.stat(filepath)
                
                # Load report metadata
                try:
                    with open(filepath, 'r') as f:
                        report_data = json.load(f)
                    
                    reports.append({
                        'id': filename.replace('.json', ''),
                        'filename': filename,
                        'domain': report_data.get('domain', ''),
                        'generated_at': report_data.get('generated_at', ''),
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
                except:
                    pass
        
        # Sort by generated_at descending
        reports.sort(key=lambda x: x.get('generated_at', ''), reverse=True)
        
        return jsonify({'reports': reports})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get a specific report by ID"""
    try:
        filename = f"{report_id}.json"
        filepath = os.path.join(REPORTS_DIR, filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'Report not found'}), 404
        
        with open(filepath, 'r') as f:
            report_data = json.load(f)
        
        return jsonify(report_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reports/<report_id>/export', methods=['GET'])
def export_report(report_id):
    """Export report as JSON file"""
    try:
        filename = f"{report_id}.json"
        filepath = os.path.join(REPORTS_DIR, filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'Report not found'}), 404
        
        return send_file(filepath, as_attachment=True, download_name=filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """Delete a report"""
    try:
        filename = f"{report_id}.json"
        filepath = os.path.join(REPORTS_DIR, filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'Report not found'}), 404
        
        os.remove(filepath)
        return jsonify({'success': True, 'message': 'Report deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/metrics/latest', methods=['GET'])
def get_latest_metrics():
    """Get quick stats from the most recent report"""
    try:
        # Get most recent report
        reports_response = list_reports()
        reports_data = json.loads(reports_response.get_data(as_text=True))
        
        if not reports_data.get('reports'):
            return jsonify({'error': 'No reports found'}), 404
        
        latest_report_id = reports_data['reports'][0]['id']
        
        # Load report data
        report_response = get_report(latest_report_id)
        report_data = json.loads(report_response.get_data(as_text=True))
        
        overview = report_data.get('sections', {}).get('overview', {})
        
        return jsonify({
            'domain_authority': overview.get('rank', 0),  # Using rank as proxy
            'rank': overview.get('rank', 0),
            'traffic': overview.get('organic_traffic', 0),
            'backlinks': report_data.get('sections', {}).get('backlinks', {}).get('overview', {}).get('total', 0),
            'keywords': overview.get('organic_keywords', 0),
            'generated_at': report_data.get('generated_at', '')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Railway provides PORT env var, use it if available
    port = int(os.getenv('PORT', BACKEND_PORT))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
