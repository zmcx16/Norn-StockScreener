#!/usr/bin/env python3
"""
Script to parse Clarivate Global Innovators TXT file and generate JavaScript file.
Reads from Clarivate_GlobalInnovators{year}.txt and creates Clarivate_GlobalInnovators{year}.js
"""

import os
import re
import argparse

def parse_txt_file(year):
    """
    Parse the TXT file to extract company data
    """
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    txt_file = os.path.join(script_dir, f'Clarivate_GlobalInnovators{year}.txt')
    
    if not os.path.exists(txt_file):
        raise FileNotFoundError(f"TXT file not found: {txt_file}")
    
    print(f"Reading TXT file: {txt_file}")
    
    companies = []
    
    with open(txt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Skip the header line
    i = 1
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            i += 1
            continue
        
        # Parse company line: Company\tCountry\tIndustry\t
        parts = line.split('\t')
        if len(parts) >= 3:
            company_name = parts[0].strip()
            
            # The next line should contain the winner count
            if i + 1 < len(lines):
                winner_line = lines[i + 1].strip()
                
                # Extract winner count from lines like "3 x Winner"
                winner_match = re.search(r'(\d+)\s*x\s*Winner', winner_line, re.I)
                if winner_match:
                    winner_count = int(winner_match.group(1))
                    
                    companies.append({
                        'name': company_name,
                        'winner_count': winner_count
                    })
                    print(f"Found: {company_name} ({winner_count} wins)")
                    
                    # Skip the winner line
                    i += 2
                else:
                    print(f"Could not parse winner count from: {winner_line}")
                    i += 1
            else:
                print(f"Missing winner line for company: {company_name}")
                i += 1
        else:
            i += 1
    
    print(f"Total companies extracted: {len(companies)}")
    return companies

def generate_js_file(companies, year):
    """
    Generate JavaScript file content
    """
    # Sort companies by name (alphabetically)
    companies_sorted = sorted(companies, key=lambda x: x['name'])
    
    # Create rank mapping based on winner count (descending order)
    companies_by_wins = sorted(companies, key=lambda x: x['winner_count'], reverse=True)
    
    rank_map = {}
    current_rank = 1
    for i, company in enumerate(companies_by_wins):
        if i > 0 and company['winner_count'] != companies_by_wins[i-1]['winner_count']:
            current_rank = i + 1
        rank_map[company['name']] = current_rank
    
    # Generate JavaScript content
    js_content = "import { NavZhEnUrl } from '../../common/utils'\n\n"
    js_content += f"export const Clarivate_GlobalInnovators{year} = [\n"
    
    for company in companies_sorted:
        name = company['name']
        winner_count = company['winner_count']
        rank = rank_map[name]
        
        # Escape quotes in company name
        escaped_name = name.replace('"', '\\"')
        
        js_content += "    {\n"
        js_content += f'        name: "{escaped_name}",\n'
        js_content += f'        symbol: "",\n'
        js_content += f'        rank: {rank},\n'
        js_content += f'        link: "",\n'
        js_content += "        extra_info: \n"
        js_content += f"`🌟 {winner_count}x Winner`,\n"
        js_content += "    },\n"
    
    js_content += "]\n"
    
    return js_content

def main():
    """
    Main function to process TXT file and generate JavaScript file
    """
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Generate Clarivate Global Innovators JavaScript file from TXT data')
    parser.add_argument('--year', type=int, default=2025, help='Year of the data (default: 2025)')
    args = parser.parse_args()
    
    year = args.year
    
    try:
        # Parse TXT file
        companies = parse_txt_file(year)
        
        if not companies:
            print("No companies found in TXT file")
            return
        
        # Generate JavaScript content
        js_content = generate_js_file(companies, year)
        
        # Write to output file
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_file = os.path.join(script_dir, '..', '..', 'src', 'ranking', 'data', f'Clarivate_GlobalInnovators{year}.js')
        output_dir = os.path.dirname(output_file)
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"Successfully generated: {output_file}")
        print(f"Total companies: {len(companies)}")
        
        # Print some statistics
        winner_counts = [c['winner_count'] for c in companies]
        print(f"Winner count range: {min(winner_counts)} - {max(winner_counts)} wins")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
