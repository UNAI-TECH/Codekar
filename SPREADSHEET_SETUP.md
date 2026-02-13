# How to Connect the Registration Form to Your Google Sheet

Currently, your application is ready to send registration data, but it needs a **Google Apps Script** to receive that data and save it into your spreadsheet.

Follow these exact steps to make it work:

### Step 1: Open Your Google Sheet
1. Go to your Google Sheet: [https://docs.google.com/spreadsheets/d/1FcovU6NBLez4mKKxT0_LCxISIHs94EFVsCa0Ccu20k0/edit](https://docs.google.com/spreadsheets/d/1FcovU6NBLez4mKKxT0_LCxISIHs94EFVsCa0Ccu20k0/edit?usp=sharing)
2. In the menu bar, click on **Extensions** > **Apps Script**.

### Step 2: Paste the Script Code
1. In the Apps Script editor that opens (usually in a new tab), you will see a file named `Code.gs`.
2. Delete any existing code in that file.
3. Paste the following code exactly:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var timestamp = new Date();

    // 1. Determine which Sheet (Tab) to use
    var isIndividual = (data.registrationType === 'individual');
    var sheetName = isIndividual ? "Individual_Registrations" : "Team_Registrations";
    var sheet = ss.getSheetByName(sheetName);

    // 2. Check for duplicate Transaction ID (MANDATORY VALIDATION)
    if (data.transactionId) {
      var sheets = ss.getSheets();
      for (var i = 0; i < sheets.length; i++) {
        var checkSheet = sheets[i];
        var sheetData = checkSheet.getDataRange().getValues();
        
        if (sheetData.length > 1) { // Has headers + data
          var headers = sheetData[0];
          var txnColIndex = headers.indexOf("Transaction ID");
          
          if (txnColIndex !== -1) {
            // Check each row for duplicate transaction ID
            for (var j = 1; j < sheetData.length; j++) {
              if (sheetData[j][txnColIndex] === data.transactionId) {
                // DUPLICATE FOUND - REJECT REGISTRATION
                return ContentService.createTextOutput(
                  JSON.stringify({ 
                    "result": "error", 
                    "error": "DUPLICATE_TRANSACTION",
                    "message": "This transaction ID has already been used for registration. If this is an error, please contact support."
                  })
                ).setMimeType(ContentService.MimeType.JSON);
              }
            }
          }
        }
      }
    }

    // 3. Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (isIndividual) {
        // Headers for Individual WITH PAYMENT FIELDS
        sheet.appendRow([
          "Timestamp", 
          "Full Name", 
          "Email", 
          "Project Track", 
          "Project Idea",
          "Amount",
          "Transaction ID",
          "UPI ID"
        ]);
      } else {
        // Headers for Team WITH PAYMENT FIELDS
        sheet.appendRow([
          "Timestamp", 
          "Team Name", 
          "Project Track", 
          "Project Idea", 
          "Leader Name", "Leader Email", "Leader Link",
          "Member 2 Name", "Member 2 Email",
          "Member 3 Name", "Member 3 Email",
          "Member 4 Name", "Member 4 Email",
          "Amount",
          "Transaction ID",
          "UPI ID"
        ]);
      }
    }

    // 4. Prepare the data row
    var row = [];
    if (isIndividual) {
      // --- INDIVIDUAL DATA WITH PAYMENT ---
      var person = (data.members && data.members[0]) ? data.members[0] : {};
      row = [
        timestamp,
        person.name || "",
        person.email || "",
        data.projectTrack || "",
        data.projectIdea || "",
        data.amount || "",
        data.transactionId || "",
        data.upiId || ""
      ];
    } else {
      // --- TEAM DATA WITH PAYMENT ---
      function getMember(index, field) {
        return (data.members && data.members[index]) ? data.members[index][field] : "";
      }
      row = [
        timestamp,
        data.teamName || "",
        data.projectTrack || "",
        data.projectIdea || "",
        // Leader
        getMember(0, "name"),
        getMember(0, "email"),
        getMember(0, "github"),
        // Member 2
        getMember(1, "name"),
        getMember(1, "email"),
        // Member 3
        getMember(2, "name"),
        getMember(2, "email"),
        // Member 4
        getMember(3, "name"),
        getMember(3, "email"),
        data.amount || "",
        data.transactionId || "",
        data.upiId || ""
      ];
    }

    // 5. Save to sheet
    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ 
        "result": "success",
        "transactionId": data.transactionId
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        "result": "error", 
        "error": e.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Step 3: Deploy as Web App
1. Click the **Deploy** button (blue button top right) > **New deployment**.
2. Click the specific **Select type** gear icon next to "Select type" and choose **Web App**.
3. Fill in the details:
   - **Description**: "Hackathon Form" (or anything you like)
   - **Execute as**: **Me** (your email address)
   - **Who has access**: **Anyone** (This is critical so your website can send data without login)
4. Click **Deploy**.
5. You might be asked to **Authorize access**. Click "Review permissions", choose your account, and if you see a warning "Google hasn't verified this app", click "Advanced" > "Go to ... (unsafe)" (it is safe, it's your own script).
6. Copy the **Web App URL** provided at the end (it starts with `https://script.google.com/macros/s/...`).

### Step 4: Update Your Website Code
1. Open the file `src/components/hackathon/RegistrationForm.tsx` in your code editor.
2. Find line 29: `const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE";`
3. Replace the placeholder URL with the **Web App URL** you just copied.

### Step 5: Test It!
1. Go to your local website.
2. Click "Apply Now".
3. Fill out the form as a test user.
4. Click "Confirm Registration".
5. Check your Google Sheet - the data should appear!
