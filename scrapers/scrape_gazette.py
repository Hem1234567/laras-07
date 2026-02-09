import requests
from bs4 import BeautifulSoup
import pdfplumber
import re
import os
import io
from datetime import datetime, timedelta

class GazetteScraper:
    def __init__(self):
        self.base_url = "https://egazette.gov.in/Search.aspx"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def search_land_acquisition(self, date_from=None, date_to=None):
        if not date_from:
            date_from = (datetime.now() - timedelta(days=30)).strftime("%d/%m/%Y")
        if not date_to:
            date_to = datetime.now().strftime("%d/%m/%Y")

        print(f"Searching Gazette from {date_from} to {date_to}...")

        params = {
            'query': 'land acquisition section 3A',
            'datefrom': date_from,
            'dateto': date_to,
            'type': 'all'
        }
        
        try:
            response = self.session.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error searching Gazette: {e}")
            return []

        soup = BeautifulSoup(response.content, 'html.parser')
        
        notifications = []
        # Note: The actual class names on egazette.gov.in might differ. 
        # This assumes a generic 'result-item' or similar structure as per the prompt's example.
        # In a real scrape, we'd need to inspect the live DOM.
        results = soup.find_all('div', class_='result-item')
        
        if not results:
            # Fallback/Debug: print if no results found to checking selectors
            # print("No results found with class 'result-item'. Dumping simplified HTML structure...")
            # print(soup.prettify()[:1000]) 
            pass

        for result in results:
            notification = self.extract_notification_details(result)
            if notification:
                notifications.append(notification)
        
        return notifications
    
    def extract_notification_details(self, result_div):
        # Extract details from search result
        title_tag = result_div.find('h3')
        title = title_tag.text.strip() if title_tag else 'Unknown Title'
        
        link_tag = result_div.find('a', href=True)
        pdf_link = link_tag['href'] if link_tag else ''
        if pdf_link and not pdf_link.startswith('http'):
            # Handle relative URLs if necessary
            pdf_link = "https://egazette.gov.in/" + pdf_link.lstrip('/')

        # Download and parse PDF if needed
        # Note: careful with rate limits and large downloads in a demo
        return {
            'title': title,
            'pdf_url': pdf_link,
            # 'location': location, # Requires PDF parsing
            # 'section': section,   # Requires PDF parsing
            'scraped_at': datetime.now().isoformat()
        }

    def extract_text_from_pdf(self, pdf_url):
        try:
            response = self.session.get(pdf_url, timeout=30)
            with pdfplumber.open(io.BytesIO(response.content)) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text
        except Exception as e:
            print(f"Error extracting PDF text from {pdf_url}: {e}")
            return ""

if __name__ == "__main__":
    scraper = GazetteScraper()
    notifications = scraper.search_land_acquisition()
    
    output_dir = "data"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    import pandas as pd
    df = pd.DataFrame(notifications)
    output_file = os.path.join(output_dir, 'gazette_notifications.csv')
    df.to_csv(output_file, index=False)
    print(f"Found {len(notifications)} notifications. Saved to {output_file}")
