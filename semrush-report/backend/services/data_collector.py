"""Data collection functions for Semrush reports"""
from typing import Dict, List
from datetime import datetime
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from services.semrush_client import SemrushClient
from config import MAX_KEYWORDS, MAX_BACKLINKS, HISTORICAL_MONTHS


class DataCollector:
    """Collects and structures data from Semrush API"""
    
    def __init__(self, api_key: str = None):
        self.client = SemrushClient(api_key)
    
    def _get(self, d: Dict, *keys: str, default: str = ''):
        """Try multiple key variants; main API uses Title Case, analytics API uses lowercase."""
        for k in keys:
            if k in d and d[k] not in (None, '', '-'):
                return d[k]
        return default
    
    def collect_full_report(self, domain: str) -> Dict:
        """Collect all data for a comprehensive report"""
        report_data = {
            'domain': domain,
            'generated_at': datetime.now().isoformat(),
            'sections': {}
        }
        
        # Domain Overview
        print(f"Collecting domain overview for {domain}...")
        report_data['sections']['overview'] = self.collect_overview(domain)
        
        # Organic Keywords
        print(f"Collecting organic keywords for {domain}...")
        report_data['sections']['keywords'] = self.collect_keywords(domain)
        
        # Backlinks
        print(f"Collecting backlinks for {domain}...")
        report_data['sections']['backlinks'] = self.collect_backlinks(domain)
        
        # Competitors
        print(f"Collecting competitors for {domain}...")
        report_data['sections']['competitors'] = self.collect_competitors(domain)
        
        # Traffic History
        print(f"Collecting traffic history for {domain}...")
        report_data['sections']['traffic'] = self.collect_traffic_history(domain)
        
        # Content Pages
        print(f"Collecting top pages for {domain}...")
        report_data['sections']['content'] = self.collect_content_pages(domain)
        
        return report_data
    
    def collect_overview(self, domain: str) -> Dict:
        """Collect domain overview metrics"""
        try:
            overview = self.client.get_domain_overview(domain)
            return {
                'domain': self._get(overview, 'Domain', 'Dn', default=domain),
                'rank': self._parse_int(self._get(overview, 'Rank', 'Rk', default='0')),
                'organic_keywords': self._parse_int(self._get(overview, 'Organic Keywords', 'Or', default='0')),
                'organic_traffic': self._parse_int(self._get(overview, 'Organic Traffic', 'Ot', default='0')),
                'organic_cost': self._parse_float(self._get(overview, 'Organic Cost', 'Oc', default='0')),
                'adwords_keywords': self._parse_int(self._get(overview, 'AdWords Keywords', 'Adwords Keywords', 'Ad', default='0')),
                'adwords_traffic': self._parse_int(self._get(overview, 'AdWords Traffic', 'At', default='0')),
                'adwords_cost': self._parse_float(self._get(overview, 'AdWords Cost', 'Ac', default='0')),
            }
        except Exception as e:
            print(f"Error collecting overview: {e}")
            return {'error': str(e)}
    
    def collect_keywords(self, domain: str) -> Dict:
        """Collect organic keywords data"""
        try:
            keywords = self.client.get_organic_keywords(domain, limit=MAX_KEYWORDS)
            
            # Transform and enrich data
            keyword_list = []
            for kw in keywords[:MAX_KEYWORDS]:
                keyword_list.append({
                    'keyword': self._get(kw, 'Keyword', 'Ph', default=''),
                    'position': self._parse_int(self._get(kw, 'Position', 'Po', default='0')),
                    'previous_position': self._parse_int(self._get(kw, 'Previous Position', 'Pp', default='0')),
                    'search_volume': self._parse_int(self._get(kw, 'Search Volume', 'Nq', default='0')),
                    'cpc': self._parse_float(self._get(kw, 'CPC', 'Cp', default='0')),
                    'competition': self._parse_float(self._get(kw, 'Competition', 'Co', default='0')),
                    'url': self._get(kw, 'Url', 'URL', 'Ur', default=''),
                    'traffic': self._parse_float(self._get(kw, 'Traffic (%)', 'Traffic', 'Tr', default='0')),
                    'traffic_percent': self._parse_float(self._get(kw, 'Traffic (%)', 'Traffic Cost (%)', 'Tc', default='0')),
                })
            
            # Calculate summary stats
            total_keywords = len(keyword_list)
            avg_position = sum(k['position'] for k in keyword_list if k['position'] > 0) / max(total_keywords, 1)
            total_traffic = sum(k['traffic'] for k in keyword_list)
            total_volume = sum(k['search_volume'] for k in keyword_list)
            
            return {
                'total': total_keywords,
                'keywords': keyword_list,
                'summary': {
                    'average_position': round(avg_position, 2),
                    'total_traffic': total_traffic,
                    'total_search_volume': total_volume,
                }
            }
        except Exception as e:
            print(f"Error collecting keywords: {e}")
            return {'error': str(e), 'keywords': [], 'total': 0}
    
    def collect_backlinks(self, domain: str) -> Dict:
        """Collect backlinks data"""
        try:
            overview = self.client.get_backlinks_overview(domain)
            backlinks = self.client.get_backlinks(domain, limit=MAX_BACKLINKS)
            
            # Transform backlinks data
            backlink_list = []
            # Semrush API returns lowercase keys: source_url, target_url, anchor, etc.
            for bl in backlinks[:MAX_BACKLINKS]:
                backlink_list.append({
                    'source_url': bl.get('source_url', ''),
                    'target_url': bl.get('target_url', ''),
                    'anchor': bl.get('anchor', ''),
                    'source_title': bl.get('source_title', ''),
                    'first_seen': bl.get('first_seen', ''),
                    'last_seen': bl.get('last_seen', ''),
                    'nofollow': bl.get('nofollow', '') == '1',
                    'form': bl.get('form', '') == '1',
                    'frame': bl.get('frame', '') == '1',
                    'image': bl.get('image', '') == '1',
                    'sitewide': bl.get('sitewide', '') == '1',
                })
            
            # Extract domain from source URLs for grouping
            referring_domains = {}
            for bl in backlink_list:
                try:
                    from urllib.parse import urlparse
                    domain_name = urlparse(bl['source_url']).netloc
                    if domain_name:
                        referring_domains[domain_name] = referring_domains.get(domain_name, 0) + 1
                except:
                    pass
            
            # Semrush API returns lowercase keys: total, domains_num, urls_num, etc.
            return {
                'overview': {
                    'total': self._parse_int(overview.get('total', '0')),
                    'domains': self._parse_int(overview.get('domains_num', '0')),
                    'urls': self._parse_int(overview.get('urls_num', '0')),
                    'ips': self._parse_int(overview.get('ips_num', '0')),
                    'follows': self._parse_int(overview.get('follows_num', '0')),
                    'nofollows': self._parse_int(overview.get('nofollows_num', '0')),
                },
                'backlinks': backlink_list,
                'referring_domains': [
                    {'domain': domain, 'count': count}
                    for domain, count in sorted(referring_domains.items(), key=lambda x: x[1], reverse=True)[:20]
                ]
            }
        except Exception as e:
            print(f"Error collecting backlinks: {e}")
            return {'error': str(e), 'backlinks': [], 'overview': {}}
    
    def collect_competitors(self, domain: str) -> Dict:
        """Collect competitor data"""
        try:
            competitors = self.client.get_organic_competitors(domain, limit=10)
            
            competitor_list = []
            for comp in competitors:
                competitor_list.append({
                    'domain': self._get(comp, 'Domain', 'Dn', default=''),
                    'rank': self._parse_int(self._get(comp, 'Rank', 'Rk', 'Competitor Relevance', 'Cr', default='0')),
                    'organic_keywords': self._parse_int(self._get(comp, 'Organic Keywords', 'Or', default='0')),
                    'organic_traffic': self._parse_int(self._get(comp, 'Organic Traffic', 'Ot', default='0')),
                    'organic_cost': self._parse_float(self._get(comp, 'Organic Cost', 'Oc', default='0')),
                })
            
            return {
                'competitors': competitor_list,
                'total': len(competitor_list)
            }
        except Exception as e:
            print(f"Error collecting competitors: {e}")
            return {'error': str(e), 'competitors': [], 'total': 0}
    
    def collect_traffic_history(self, domain: str) -> Dict:
        """Collect historical traffic data"""
        try:
            history = self.client.get_domain_rank_history(domain, months=HISTORICAL_MONTHS)
            
            traffic_data = []
            for entry in history:
                traffic_data.append({
                    'date': self._get(entry, 'Date', 'Dt', 'Db', default=''),
                    'rank': self._parse_int(self._get(entry, 'Rank', 'Rk', default='0')),
                    'organic_keywords': self._parse_int(self._get(entry, 'Organic Keywords', 'Or', default='0')),
                    'organic_traffic': self._parse_int(self._get(entry, 'Organic Traffic', 'Ot', default='0')),
                    'organic_cost': self._parse_float(self._get(entry, 'Organic Cost', 'Oc', default='0')),
                })
            
            return {
                'history': traffic_data,
                'months': len(traffic_data)
            }
        except Exception as e:
            print(f"Error collecting traffic history: {e}")
            return {'error': str(e), 'history': [], 'months': 0}
    
    def collect_content_pages(self, domain: str) -> Dict:
        """Collect top content pages"""
        try:
            pages = self.client.get_domain_pages(domain, limit=20)
            
            page_list = []
            for page in pages:
                page_list.append({
                    'url': self._get(page, 'Url', 'URL', 'Ur', default=''),
                    'traffic': self._parse_int(self._get(page, 'Traffic', 'Tr', 'Tg', default='0')),
                    'traffic_percent': self._parse_float(self._get(page, 'Traffic (%)', 'Tc', default='0')),
                    'keywords': self._parse_int(self._get(page, 'Keywords', 'Number of Keywords', 'Pc', 'Nr', default='0')),
                    'backlinks': self._parse_int(self._get(page, 'Backlinks', default='0')),
                })
            
            return {
                'pages': page_list,
                'total': len(page_list)
            }
        except Exception as e:
            print(f"Error collecting content pages: {e}")
            return {'error': str(e), 'pages': [], 'total': 0}
    
    def _parse_int(self, value: str) -> int:
        """Parse string to integer, handling commas and empty strings"""
        if not value or value == '-':
            return 0
        try:
            return int(str(value).replace(',', '').replace(' ', ''))
        except:
            return 0
    
    def _parse_float(self, value: str) -> float:
        """Parse string to float, handling commas and empty strings"""
        if not value or value == '-':
            return 0.0
        try:
            return float(str(value).replace(',', '').replace(' ', ''))
        except:
            return 0.0
