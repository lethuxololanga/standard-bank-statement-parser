# standard-bank-statement-parser
Convert Standard Bank MyMoBiz PDF statements into clean, structured CSV files directly in your browser.

A lightweight, browser-based tool for extracting transaction data from Standard Bank MyMoBiz PDF statements and converting it into a clean, structured CSV format.

Built with React and PDF.js, this tool parses raw PDF text, reconstructs transaction rows, and outputs usable financial data with minimal manual cleanup. Everything runs locally in the browser, ensuring your financial data never leaves your device.

# Key Features

  Extracts transactions from Standard Bank MyMoBiz PDF statements
  Converts data into structured CSV format (Date, Description, Debit, Credit, Balance)
  Automatically detects statement periods and assigns correct years
  Handles multi-line transaction descriptions
  Flags incomplete or unparseable rows for review
  Built-in search and date filtering
  Editable transaction table before export
  Download or copy CSV instantly
  Fully client-side, no data upload required
