#!/usr/bin/env python3
"""
Interbrand Best Global Brands Data Generator

This script automatically generates the interbrand_BestGlobalBrandsXXXX.js file
by scraping data from the Interbrand website.

Steps:
1. Fetch the main page HTML from https://interbrand.com/best-global-brands/
2. Extract TOP 100 brand information (name, rank, link)
3. Visit each brand's individual page to get Growth % and UP/DOWN/NEW status
4. Generate the JavaScript file with all required fields

Usage:
    python generate_interbrand_data.py [year]
    
Example:
    python generate_interbrand_data.py 2024
"""

import requests
import re
import json
import time
import argparse
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Optional, Tuple


class InterbrandScraper:
    def __init__(self, year: int = 2024):
        self.year = year
        self.base_url = "https://interbrand.com"
        self.main_url = "https://interbrand.com/best-global-brands/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
    def fetch_page(self, url: str, retries: int = 3) -> Optional[str]:
        """Fetch HTML content from URL with retry mechanism"""
        for attempt in range(retries):
            try:
                print(f"Fetching: {url} (attempt {attempt + 1})")
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response.text
            except requests.exceptions.RequestException as e:
                print(f"Error fetching {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    print(f"Failed to fetch {url} after {retries} attempts")
                    return None
        return None

    def extract_brands_from_main_page(self) -> List[Dict]:
        """Extract brand information from the main page"""
        html = self.fetch_page(self.main_url)
        if not html:
            raise Exception("Failed to fetch main page")
            
        soup = BeautifulSoup(html, 'html.parser')
        brands = []
        
        # First try to extract directly from the structured HTML elements
        print("Extracting brands from HTML structure...")
        
        # Look for the specific HTML structure with rank and title spans
        brand_blocks = soup.find_all('span', class_='wp-block-interbrand-best-brand-block__position')
        
        for rank_span in brand_blocks:
            try:
                # Get rank from the position span
                rank_text = rank_span.get_text(strip=True)
                rank = int(rank_text)
                
                if 1 <= rank <= 100:
                    # Find the corresponding title span (should be a sibling)
                    title_span = rank_span.find_next_sibling('span', class_='wp-block-interbrand-best-brand-block__title')
                    
                    if title_span:
                        name = title_span.get_text(strip=True)
                        
                        # Find the link - look for the nearest anchor tag
                        link_element = rank_span.find_parent().find('a', href=re.compile(r'/best-global-brands/'))
                        if not link_element:
                            # Try to find it in a broader scope
                            parent = rank_span.find_parent()
                            while parent and not link_element:
                                link_element = parent.find('a', href=re.compile(r'/best-global-brands/'))
                                parent = parent.find_parent()
                        
                        if link_element:
                            href = link_element.get('href')
                            link = urljoin(self.base_url, href)
                            
                            # Try to extract growth from the link text if available
                            link_text = link_element.get_text(strip=True)
                            growth_match = re.search(r'([-+]?\d+%|NEW)', link_text)
                            growth = growth_match.group(1) if growth_match else None
                            
                            brands.append({
                                'name': name,
                                'rank': rank,
                                'link': link,
                                'growth': growth
                            })
                            
                            print(f"Extracted: rank={rank}, name='{name}', growth={growth}")
                        
            except (ValueError, AttributeError) as e:
                continue
                
        if brands:
            print(f"Found {len(brands)} brands from structured HTML")
            brands.sort(key=lambda x: x['rank'])
            return brands[:100]
        
        # Fallback to the existing link-based extraction
        print("Fallback: Looking for brand links...")
        
        # Look for the table or list structure containing brands
        # Try multiple approaches to find the brand data
        
        # Approach 1: Look for table rows with brand data
        brand_rows = soup.find_all('tr')
        for row in brand_rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) >= 2:
                rank_text = cells[0].get_text(strip=True)
                if rank_text.isdigit():
                    rank = int(rank_text)
                    if 1 <= rank <= 100:
                        # Found a valid rank, extract brand info
                        brand_link = row.find('a')
                        if brand_link and '/best-global-brands/' in brand_link.get('href', ''):
                            name = brand_link.get_text(strip=True)
                            link = urljoin(self.base_url, brand_link.get('href'))
                            brands.append({'name': name, 'rank': rank, 'link': link})
        
        if brands:
            print(f"Found {len(brands)} brands from table structure")
            return sorted(brands, key=lambda x: x['rank'])[:100]
        
        # Approach 2: Look for ordered list or numbered items
        print("Trying to find numbered list items...")
        numbered_items = soup.find_all(['li', 'div', 'a'], class_=re.compile(r'rank|item|brand', re.I))
        
        # Also look for all links to brand pages
        all_brand_links = soup.find_all('a', href=re.compile(r'/best-global-brands/[^/]+/?$'))
        numbered_items.extend(all_brand_links)
        
        for item in numbered_items:
            item_text = item.get_text(strip=True)
            
            # Look for rank pattern at the beginning
            # Special handling for cases like "793M" where we need rank 79, not 793
            rank_match = re.match(r'^(\d{1,3})', item_text)  # Allow up to 3 digits for rank 100
            if rank_match:
                potential_rank = int(rank_match.group(1))
                
                # If rank > 100, it might be concatenated with brand name (like 793M = rank 79, brand 3M)
                if potential_rank > 100:
                    # Try to extract the first 1-2 digits as the real rank
                    rank_str = rank_match.group(1)
                    if len(rank_str) >= 3:
                        # Try first 2 digits
                        rank = int(rank_str[:2])
                        if rank > 100:
                            # Try first digit only
                            rank = int(rank_str[:1])
                    else:
                        rank = potential_rank
                else:
                    rank = potential_rank
                    
                if 1 <= rank <= 100:
                    # Check if this is already a link or find a link within
                    if item.name == 'a' and '/best-global-brands/' in item.get('href', ''):
                        brand_link = item
                    else:
                        brand_link = item.find('a', href=re.compile(r'/best-global-brands/'))
                    
                    if brand_link:
                        link_text = brand_link.get_text(strip=True)
                        href = brand_link.get('href')
                        
                        print(f"Processing rank {rank}, link text: '{link_text}'")
                        
                        # Parse format: "01 Apple -3% 488.9 $B" or similar
                        # Try multiple patterns
                        name = None
                        growth = None
                        
                        # Pattern 1: "01 Apple -3% 488.9 $B"
                        match1 = re.match(r'^\d{1,3}\s*(.+?)\s+([-+]?\d+%)', link_text)
                        if match1:
                            name = match1.group(1).strip()
                            growth = match1.group(2)
                        
                        # Pattern 2: Handle "NEW" case like "36NvidiaNEW20.0 $B"
                        if not name:
                            match2 = re.match(r'^\d{1,3}\s*(.+?)NEW', link_text)
                            if match2:
                                name = match2.group(1).strip()
                                growth = "NEW"
                        
                        # Pattern 3: Handle special case like "793M-10%8.9 $B" where brand name starts with number
                        if not name:
                            # Look for pattern where rank+brand name is concatenated like "793M"
                            match3 = re.match(r'^(\d{1,3})([A-Za-z][A-Za-z0-9\s\-&\'\.]*?)\s*([-+]?\d+%|NEW)', link_text)
                            if match3:
                                # Verify the rank matches what we expect
                                extracted_rank = int(match3.group(1))
                                if extracted_rank == rank:
                                    name = match3.group(2).strip()
                                    growth = match3.group(3) if match3.group(3) else None
                        
                        # Pattern 4: Handle case where there's no space between rank and brand name
                        if not name:
                            # Pattern like "79[brand_name][growth]" where brand name can start with letter or number
                            remaining_text = link_text[len(str(rank)):]  # Remove the rank number
                            # Try to extract brand name and growth from remaining text
                            match4 = re.match(r'^([A-Za-z0-9][A-Za-z0-9\s\-&\'\.]*?)\s*([-+]?\d+%|NEW)', remaining_text)
                            if match4:
                                name = match4.group(1).strip()
                                growth = match4.group(2) if match4.group(2) else None
                            # Special case for 3M: check if remaining text starts with "3M"
                            elif remaining_text.startswith('3M'):
                                # Extract 3M specifically
                                match3m = re.match(r'^(3M)\s*([-+]?\d+%|NEW)', remaining_text)
                                if match3m:
                                    name = match3m.group(1).strip()
                                    growth = match3m.group(2) if match3m.group(2) else None
                        
                        # Pattern 5: Just extract everything after the number
                        if not name:
                            match5 = re.match(r'^\d{1,3}\s*(.+)', link_text)
                            if match5:
                                remaining = match5.group(1)
                                # Try to extract brand name before percentage or dollar amount
                                name_match = re.match(r'^(.+?)\s*(?:[-+]?\d+%|NEW|[\d.]+\s*\$)', remaining)
                                if name_match:
                                    name = name_match.group(1).strip()
                                else:
                                    name = remaining.strip()
                        
                        # If still no name, extract from URL
                        if not name:
                            path_parts = href.split('/')
                            brand_slug = path_parts[-2] if path_parts[-1] == '' else path_parts[-1]
                            name = brand_slug.replace('-', ' ').title()
                        
                        # Clean up the name
                        name = re.sub(r'\s*[-+]?\d+%.*$', '', name).strip()
                        name = re.sub(r'\s*NEW.*$', '', name).strip()
                        name = re.sub(r'\s*[\d.]+\s*\$.*$', '', name).strip()
                        
                        link = urljoin(self.base_url, href)
                        
                        # Extract growth if not found yet
                        if not growth:
                            growth_match = re.search(r'([-+]?\d+%)', link_text)
                            growth = growth_match.group(1) if growth_match else None
                        
                        print(f"Extracted: rank={rank}, name='{name}', growth={growth}")
                        
                        brands.append({
                            'name': name,
                            'rank': rank,
                            'link': link,
                            'growth': growth
                        })
        
        if brands:
            print(f"Found {len(brands)} brands from numbered items")
            # Remove duplicates based on rank
            seen_ranks = set()
            unique_brands = []
            for brand in sorted(brands, key=lambda x: x['rank']):
                if brand['rank'] not in seen_ranks:
                    seen_ranks.add(brand['rank'])
                    unique_brands.append(brand)
            return unique_brands[:100]
        
        # Approach 3: Direct text parsing based on observed format
        print("Trying direct text parsing...")
        page_text = soup.get_text()
        
        # Look for the specific pattern we saw: "01 Apple -3% 488.9 $B02 Microsoft +11% 352.5 $B"
        # Also handle cases like "793M-10%8.9 $B" where brand name starts with numbers or is concatenated with rank
        pattern1 = r'(\d{1,3})\s+([A-Za-z][A-Za-z0-9\-&\'\s\.]*?)\s+([-+]?\d+%|NEW)\s+[\d.]+\s*\$?[BMK]?'
        pattern2 = r'(\d{1,3})([A-Za-z0-9][A-Za-z0-9\-&\'\s\.]*?)\s*([-+]?\d+%|NEW)\s+[\d.]+\s*\$?[BMK]?'
        
        # Try both patterns
        for pattern in [pattern1, pattern2]:
            matches = re.findall(pattern, page_text)
            
            for match in matches:
                rank = int(match[0])
                if 1 <= rank <= 100:
                    name = match[1].strip()
                    growth = match[2]
                    
                    # Clean up name (remove any trailing punctuation)
                    name = re.sub(r'[^\w\s\-&\']', '', name).strip()
                    
                    # Check if we already have this rank
                    if not any(b['rank'] == rank for b in brands):
                        # Generate the brand URL
                        brand_slug = name.lower().replace(' ', '-').replace('&', '-').replace("'", '')
                        # Handle special cases
                        if brand_slug == '3m':
                            brand_slug = '3m'
                        elif brand_slug == 'coca-cola':
                            brand_slug = 'coca-cola'
                        elif brand_slug == 'mercedes-benz':
                            brand_slug = 'mercedes-benz'
                        
                        link = f"{self.base_url}/best-global-brands/{brand_slug}/"
                        
                        brands.append({
                            'name': name,
                            'rank': rank,
                            'link': link,
                            'growth': growth
                        })
        
        if brands:
            print(f"Found {len(brands)} brands from direct text parsing")
            return sorted(brands, key=lambda x: x['rank'])[:100]
        
        # Approach 4: Enhanced manual HTML parsing
        print("Trying enhanced manual HTML parsing...")
        return self.parse_html_brands_enhanced(soup)
        
        # Approach 4: Manual HTML parsing with better rank extraction
        print("Trying enhanced manual HTML parsing...")
        return self.parse_html_brands_enhanced(soup)
    
    def parse_json_brands(self, brands_data) -> List[Dict]:
        """Parse brands from JSON data structure"""
        brands = []
        for brand_data in brands_data:
            if isinstance(brand_data, dict):
                name = brand_data.get('name', '')
                # Look for rank in various fields
                rank = brand_data.get('rank') or brand_data.get('position') or brand_data.get('ranking')
                
                # If no direct rank field, try to extract from other fields
                if not rank:
                    for key, value in brand_data.items():
                        if 'rank' in key.lower() and isinstance(value, (int, str)):
                            try:
                                rank = int(value)
                                break
                            except:
                                continue
                
                # Get link
                link = brand_data.get('url') or brand_data.get('link') or brand_data.get('href', '')
                if link and not link.startswith('http'):
                    link = urljoin(self.base_url, link)
                
                if name and rank and 1 <= int(rank) <= 100:
                    brands.append({
                        'name': name,
                        'rank': int(rank),
                        'link': link
                    })
        
        # Sort by rank and return top 100
        brands.sort(key=lambda x: x['rank'])
        return brands[:100]
    
    def parse_html_brands(self, soup) -> List[Dict]:
        """Parse brands from HTML structure - basic version"""
        brands = []
        
        # Try different selectors for brand links
        selectors = [
            'a[href*="/best-global-brands/"]',
            '[class*="brand"] a',
            '[class*="rank"] a',
            'a[href*="brand"]'
        ]
        
        all_links = []
        for selector in selectors:
            links = soup.select(selector)
            for link in links:
                href = link.get('href', '')
                if '/best-global-brands/' in href and href not in [l['link'] for l in all_links]:
                    name = link.get_text(strip=True)
                    if name:  # Only add if we found a name
                        full_link = urljoin(self.base_url, href) if not href.startswith('http') else href
                        all_links.append({'name': name, 'link': full_link})
        
        # Assign ranks based on order found (this is fallback only)
        for i, link_data in enumerate(all_links[:100]):
            brands.append({
                'name': link_data['name'],
                'rank': i + 1,  # This is just ordering, not actual rank
                'link': link_data['link']
            })
            
        return brands
    
    def parse_html_brands_enhanced(self, soup) -> List[Dict]:
        """Enhanced HTML parsing to find actual ranks"""
        brands = []
        
        # Look for the specific pattern from the webpage
        print("Looking for brand links with rank information...")
        
        # Find all links that contain brand URLs
        brand_links = soup.find_all('a', href=re.compile(r'/best-global-brands/[^/]+/?$'))
        
        for link in brand_links:
            href = link.get('href', '')
            link_text = link.get_text(strip=True)
            
            # Parse the link text format: "01 Apple -3% 488.9 $B"
            match = re.match(r'^(\d+)\s+(.+?)\s+([-+]?\d+%)\s+(.+)$', link_text)
            if match:
                rank = int(match.group(1))
                name = match.group(2).strip()
                growth = match.group(3)
                
                # Clean up the name (remove any trailing characters)
                name = re.sub(r'\s*[-+]\d+%.*$', '', name).strip()
                
                full_link = urljoin(self.base_url, href)
                
                brands.append({
                    'name': name,
                    'rank': rank,
                    'link': full_link,
                    'growth': growth  # Store growth info for later use
                })
            else:
                # Try alternative parsing for simpler formats
                rank_match = re.match(r'^(\d+)', link_text)
                if rank_match:
                    rank = int(rank_match.group(1))
                    if 1 <= rank <= 100:
                        # Extract brand name from URL as fallback
                        path_parts = href.split('/')
                        brand_slug = path_parts[-2] if path_parts[-1] == '' else path_parts[-1]
                        name = brand_slug.replace('-', ' ').title()
                        
                        full_link = urljoin(self.base_url, href)
                        brands.append({
                            'name': name,
                            'rank': rank,
                            'link': full_link
                        })
        
        if brands:
            print(f"Found {len(brands)} brands with ranks")
            brands.sort(key=lambda x: x['rank'])
            return brands[:100]
        
        # Fallback: try to extract from page text
        print("Trying text-based extraction...")
        page_text = soup.get_text()
        brand_pattern = r'(\d+)\s+([A-Za-z\-&\s]+)\s+([-+]?\d+%)'
        
        matches = re.findall(brand_pattern, page_text)
        for match in matches:
            rank = int(match[0])
            if 1 <= rank <= 100:
                name = match[1].strip()
                growth = match[2]
                
                # Try to find corresponding link
                brand_slug = name.lower().replace(' ', '-').replace('&', '-')
                link = f"{self.base_url}/best-global-brands/{brand_slug}/"
                
                brands.append({
                    'name': name,
                    'rank': rank,
                    'link': link,
                    'growth': growth
                })
        
        if brands:
            print(f"Found {len(brands)} brands from text extraction")
            brands.sort(key=lambda x: x['rank'])
            return brands[:100]
        
        # Final fallback to basic parsing
        print("Falling back to basic HTML parsing...")
        return self.parse_html_brands(soup)

    def extract_brand_details(self, brand_url: str) -> Tuple[Optional[str], Optional[str]]:
        """Extract growth percentage and rank change from brand page"""
        html = self.fetch_page(brand_url)
        if not html:
            return "unchanged", "+0%"  # Default values if page can't be fetched
            
        soup = BeautifulSoup(html, 'html.parser')
        
        # Look for rank change information
        rank_change = None
        growth = None
        
        # Pattern 1: Look for specific text patterns in the page content
        text_content = soup.get_text()
        
        # Extract rank change - look for common patterns
        rank_patterns = [
            r'UP (\d+) PLACES?',
            r'DOWN (\d+) PLACES?',
            r'RANK UNCHANGED',
            r'UNCHANGED',
            r'—UNCHANGED',
            r'NEW TO THE RANKING',
            r'NEW ENTRY',
            r'NEW'
        ]
        
        for pattern in rank_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                if 'UP' in pattern.upper():
                    places = match.group(1)
                    rank_change = f"up {places} place{'s' if int(places) > 1 else ''}"
                elif 'DOWN' in pattern.upper():
                    places = match.group(1)
                    rank_change = f"down {places} place{'s' if int(places) > 1 else ''}"
                elif 'UNCHANGED' in pattern.upper():
                    rank_change = "unchanged"
                elif 'NEW' in pattern.upper():
                    rank_change = "New"
                break
        
        # If not found, try alternative patterns
        if not rank_change:
            # Look for patterns like "+5", "-3", etc.
            change_pattern = r'([-+]\d+)\s*(?:PLACE|POSITION)'
            match = re.search(change_pattern, text_content, re.IGNORECASE)
            if match:
                change_val = int(match.group(1))
                if change_val > 0:
                    rank_change = f"up {abs(change_val)} place{'s' if abs(change_val) > 1 else ''}"
                elif change_val < 0:
                    rank_change = f"down {abs(change_val)} place{'s' if abs(change_val) > 1 else ''}"
                else:
                    rank_change = "unchanged"
        
        # Extract growth percentage
        growth_patterns = [
            r'([+-]?\d+)%\s*(?:GROWTH|CHANGE)',
            r'GROWTH[:\s]*([+-]?\d+)%',
            r'([+-]?\d+)%.*?(?:BRAND VALUE|VALUE)',
            r'([+-]?\d+)%'
        ]
        
        for pattern in growth_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                # Take the first reasonable growth percentage
                for match in matches:
                    try:
                        # Clean the match
                        clean_match = match.strip()
                        pct = int(clean_match.replace('+', '').replace('%', ''))
                        if -100 <= pct <= 100:  # Reasonable range
                            # Format properly
                            if not clean_match.startswith(('+', '-')):
                                growth = f"+{clean_match}%" if pct >= 0 else f"{clean_match}%"
                            else:
                                growth = f"{clean_match}%"
                            break
                    except:
                        continue
                if growth:
                    break
        
        # Set defaults if not found
        if not rank_change:
            rank_change = "unchanged"
        if not growth:
            growth = "+0%"
        
        return rank_change, growth

    def determine_rank_color(self, rank_change: Optional[str]) -> str:
        """Determine the color based on rank change"""
        if not rank_change:
            return ""
        
        rank_change_lower = rank_change.lower()
        if "up" in rank_change_lower:
            # Determine green shade based on magnitude
            if any(x in rank_change_lower for x in ["up 1 place", "up 2 place"]):
                return "#4caf50"  # Standard green
            elif any(x in rank_change_lower for x in ["up 3 place", "up 4 place", "up 5 place"]):
                return "#4CAF50"  # Bright green
            else:
                return "#00e676"  # Light green for big jumps
        elif "down" in rank_change_lower:
            return "#f44336"  # Red for down
        elif "new" in rank_change_lower:
            return "#ffc107"  # Yellow for new
        else:
            return ""  # No color for unchanged

    def generate_javascript_file(self, brands: List[Dict], output_file: str):
        """Generate the JavaScript file with brand data"""
        js_content = f"export const interbrand_BestGlobalBrands{self.year} = [\n"
        
        for i, brand in enumerate(brands):
            name = brand['name']
            rank = brand['rank']
            link = brand['link']
            rank_change = brand.get('rank_change', '')
            growth = brand.get('growth', '')
            rank_color = brand.get('rank_color', '')
            
            # Format extra_info
            if rank_change and growth:
                if rank_change.lower() == "new":
                    extra_info = f"Rank {rank_change}\\nGrowth {rank_change}"
                else:
                    extra_info = f"Rank {rank_change}\\nGrowth {growth}"
            else:
                extra_info = f"Rank {rank_change or 'unchanged'}\\nGrowth {growth or '+0%'}"
            
            # Start brand object
            js_content += "    {\n"
            js_content += f'        name: "{name}",\n'
            js_content += f'        symbol: "",\n'  # Empty symbol as requested
            js_content += f'        rank: {rank},\n'
            
            # Add rank_color if exists
            if rank_color:
                js_content += f"        rank_color: '{rank_color}',\n"
            
            # Add extra_info
            js_content += "        extra_info:\n"
            js_content += f"`{extra_info}`,\n"
            js_content += f'        link: "{link}",\n'
            js_content += "    }"
            
            # Add comma if not the last item
            if i < len(brands) - 1:
                js_content += ","
            js_content += "\n"
        
        js_content += "]\n"
        
        # Write to file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"Generated {output_file} successfully!")

    def run(self):
        """Main execution function"""
        print(f"Starting Interbrand scraper for year {self.year}")
        
        # Step 1: Get brands from main page
        print("Step 1: Extracting brands from main page...")
        brands = self.extract_brands_from_main_page()
        print(f"Found {len(brands)} brands")
        
        if len(brands) == 0:
            print("No brands found. Please check the website structure.")
            return
        
        # Step 2: Get details for each brand
        print("Step 2: Fetching details for each brand...")
        for i, brand in enumerate(brands):
            print(f"Processing brand {i+1}/{len(brands)}: {brand['name']}")
            
            try:
                rank_change, growth = self.extract_brand_details(brand['link'])
                brand['rank_change'] = rank_change
                brand['growth'] = growth
                brand['rank_color'] = self.determine_rank_color(rank_change)
                
                print(f"  -> Rank change: {rank_change}, Growth: {growth}")
                
                # Add delay to be respectful to the server
                time.sleep(1)
            except Exception as e:
                print(f"  -> Error processing {brand['name']}: {e}")
                # Set default values if extraction fails
                brand['rank_change'] = "unchanged"
                brand['growth'] = "+0%"
                brand['rank_color'] = ""
                continue
        
        # Step 3: Generate JavaScript file
        print("Step 3: Generating JavaScript file...")
        output_file = f"interbrand_BestGlobalBrands{self.year}.js"
        self.generate_javascript_file(brands, output_file)
        
        print("Process completed successfully!")


def main():
    parser = argparse.ArgumentParser(description='Generate Interbrand Best Global Brands data')
    parser.add_argument('year', nargs='?', type=int, default=2024, 
                       help='Year for the data (default: 2024)')
    
    args = parser.parse_args()
    
    scraper = InterbrandScraper(args.year)
    scraper.run()


if __name__ == "__main__":
    main()
