"""Semrush API Client"""
import requests
import time
from typing import Dict, List, Optional
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from config import SEMRUSH_API_KEY, SEMRUSH_API_BASE_URL, API_RATE_LIMIT_DELAY, MAX_RETRIES


class SemrushAPIError(Exception):
    """Custom exception for Semrush API errors"""
    pass


class SemrushClient:
    """Client for interacting with Semrush API"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or SEMRUSH_API_KEY
        if not self.api_key:
            raise ValueError("Semrush API key is required")
        self.base_url = SEMRUSH_API_BASE_URL
        self.last_request_time = 0
    
    def _rate_limit(self):
        """Enforce rate limiting between API calls"""
        elapsed = time.time() - self.last_request_time
        if elapsed < API_RATE_LIMIT_DELAY:
            time.sleep(API_RATE_LIMIT_DELAY - elapsed)
        self.last_request_time = time.time()
    
    def _make_request(self, endpoint: str, params: Dict) -> str:
        """Make API request with retry logic"""
        params['key'] = self.api_key
        
        for attempt in range(MAX_RETRIES):
            try:
                self._rate_limit()
                response = requests.get(f"{self.base_url}/{endpoint}", params=params, timeout=30)
                
                if response.status_code == 200:
                    return response.text
                elif response.status_code == 429:
                    # Rate limited - wait longer
                    wait_time = (attempt + 1) * 5
                    time.sleep(wait_time)
                    continue
                else:
                    raise SemrushAPIError(f"API error {response.status_code}: {response.text}")
            except requests.RequestException as e:
                if attempt == MAX_RETRIES - 1:
                    raise SemrushAPIError(f"Request failed after {MAX_RETRIES} attempts: {str(e)}")
                time.sleep(2 ** attempt)  # Exponential backoff
        
        raise SemrushAPIError("Failed to complete API request")
    
    def _parse_csv_response(self, csv_text: str) -> List[Dict]:
        """Parse Semrush CSV response into list of dictionaries"""
        if not csv_text or csv_text.strip() == '':
            return []
        
        lines = csv_text.strip().split('\n')
        if len(lines) < 2:
            return []
        
        headers = [h.strip() for h in lines[0].split(';')]
        results = []
        
        for line in lines[1:]:
            values = [v.strip() for v in line.split(';')]
            if len(values) == len(headers):
                results.append(dict(zip(headers, values)))
        
        return results
    
    def get_domain_overview(self, domain: str, database: str = 'us') -> Dict:
        """Get domain overview/ranks data"""
        params = {
            'type': 'domain_ranks',
            'domain': domain,
            'database': database,
            'export_columns': 'Dn,Rk,Or,Ot,Oc,Ad,At,Ac,FKn,FKt,FKc,Sh,Sv,Fp,Fpd'
        }
        
        csv_data = self._make_request('', params)
        results = self._parse_csv_response(csv_data)
        
        if results:
            return results[0]
        return {}
    
    def get_organic_keywords(self, domain: str, database: str = 'us', limit: int = 100) -> List[Dict]:
        """Get organic keywords for domain"""
        params = {
            'type': 'domain_organic',
            'domain': domain,
            'database': database,
            'display_limit': min(limit, 10000),
            'export_columns': 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
        }
        
        csv_data = self._make_request('', params)
        return self._parse_csv_response(csv_data)
    
    def get_backlinks_overview(self, domain: str) -> Dict:
        """Get backlinks overview summary"""
        params = {
            'type': 'backlinks_overview',
            'target': domain,
            'target_type': 'root_domain',
            'export_columns': 'ascore,total,domains_num,urls_num,ips_num,follows_num,nofollows_num'
        }
        
        csv_data = self._make_request('analytics/v1/', params)
        results = self._parse_csv_response(csv_data)
        
        if results:
            return results[0]
        return {}
    
    def get_backlinks(self, domain: str, limit: int = 1000) -> List[Dict]:
        """Get detailed backlinks list"""
        params = {
            'type': 'backlinks',
            'target': domain,
            'target_type': 'root_domain',
            'display_limit': min(limit, 10000),
            'export_columns': 'source_url,target_url,anchor,source_title,first_seen,last_seen,nofollow,form,frame,image,sitewide'
        }
        
        csv_data = self._make_request('analytics/v1/', params)
        return self._parse_csv_response(csv_data)
    
    def get_organic_competitors(self, domain: str, database: str = 'us', limit: int = 10) -> List[Dict]:
        """Get organic search competitors. Columns: Dn,Cr,Np,Or,Ot,Oc,Ad"""
        params = {
            'type': 'domain_organic_organic',
            'domain': domain,
            'database': database,
            'display_limit': min(limit, 100),
            'export_columns': 'Dn,Cr,Np,Or,Ot,Oc,Ad'
        }
        
        csv_data = self._make_request('', params)
        return self._parse_csv_response(csv_data)
    
    def get_domain_rank_history(self, domain: str, database: str = 'us', months: int = 12) -> List[Dict]:
        """Get historical rank data. Include Dt (Date) for timeline."""
        params = {
            'type': 'domain_rank_history',
            'domain': domain,
            'database': database,
            'display_limit': months,
            'export_columns': 'Dt,Db,Dn,Rk,Or,Ot,Oc,Ad,At,Ac'
        }
        
        csv_data = self._make_request('', params)
        return self._parse_csv_response(csv_data)
    
    def get_domain_pages(self, domain: str, database: str = 'us', limit: int = 20) -> List[Dict]:
        """Get top pages by traffic. Uses domain_organic_unique (Url, Keywords, Traffic, Traffic %)."""
        params = {
            'type': 'domain_organic_unique',
            'domain': domain,
            'database': database,
            'display_limit': min(limit, 1000),
            'export_columns': 'Ur,Pc,Tg,Tr'
        }
        
        csv_data = self._make_request('', params)
        return self._parse_csv_response(csv_data)
    
    def test_connection(self) -> bool:
        """Test API connection"""
        try:
            result = self.get_domain_overview('example.com')
            return True
        except Exception as e:
            print(f"API connection test failed: {e}")
            return False
