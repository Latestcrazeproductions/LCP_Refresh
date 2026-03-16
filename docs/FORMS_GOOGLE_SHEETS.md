# Invoice Request Form → Google Sheets

The Invoice Request Form submits data to your Google Sheet via a Google Apps Script web app.

## Setup

### 1. Open your Google Sheet

Open the sheet that should receive Invoice Request submissions (e.g. `Form_Responses`).

### 2. Add the Apps Script

1. In the sheet: **Extensions** → **Apps Script**
2. Delete any placeholder code and paste this script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Column order must match your sheet headers:
    // Event Name | Leads Event URL | Status | Invoice # | Due Date | Total Amount | Terms |
    // Name of Person(s) to | Email Address(es) of Person(s) to | Additional Notes | Any Special Terms For The Client | Invoicing Method
    const row = [
      data.eventName || '',
      data.lassoEventUrl || '',
      'Invoice Requested',
      '',
      '',
      '',
      '',
      data.nameToSendInvoiceTo || '',
      data.emailToSendInvoiceTo || '',
      data.additionalNotes || '',
      '',
      data.invoicingMethod || '',
    ];

    // If your sheet has a Salesperson or Urgency column, add them
    // and append: data.salesperson, data.urgency

    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Save** (Ctrl/Cmd+S), name the project e.g. "Invoice Request Receiver"

### 3. Deploy the web app

1. Click **Deploy** → **New deployment**
2. Click the gear icon → **Web app**
3. Description: "Invoice Request Form"
4. **Execute as:** Me
5. **Who has access:** Anyone
6. Click **Deploy**
7. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`)

### 4. Add the URL to your app

Add to `.env.local` (or `.env`):

```
GOOGLE_SHEETS_INVOICE_REQUEST_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Restart your dev server so it picks up the new env var.

## Column mapping

| Form field | Sheet column |
|-----------|--------------|
| Event Name | Event Name |
| Lasso Event URL | Leads Event URL |
| Name of Person(s) to Send Invoice To | Name of Person(s) to |
| Email Address(es) of Where To Send Invoice To | Email Address(es) of Person(s) to |
| Invoicing Method (Choose One) | Invoicing Method (Choose One) |
| Additional Notes | Additional Notes |
| *(auto)* | Status → "Invoice Requested" |
| *(empty)* | Invoice #, Due Date, Total Amount, Terms, Any Special Terms |

Salesperson and Urgency are submitted with the request; add columns for them in your sheet and extend the script's `row` array if needed.
