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
          "Leader Name", "Leader Email", "Leader GitHub",
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
