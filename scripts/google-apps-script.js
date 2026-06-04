const SHEET_NAME = "Заявки";

function sheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let target = spreadsheet.getSheetByName(SHEET_NAME);
  if (!target) {
    target = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (target.getLastRow() === 0) {
    target.appendRow(["id", "createdAt", "name", "phone", "product", "message"]);
  }

  return target;
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(event) {
  const params = event.parameter || {};
  if (params.action !== "list") {
    return json({ error: "Unknown action" });
  }

  const values = sheet().getDataRange().getValues();
  const headers = values.shift() || [];
  const leads = values
    .filter((row) => row.some(Boolean))
    .map((row) => headers.reduce((acc, header, index) => {
      acc[header] = row[index];
      return acc;
    }, {}))
    .reverse();

  return json({ leads });
}

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || "{}");
  if (payload.action !== "create") {
    return json({ error: "Unknown action" });
  }

  const lead = payload.lead || {};
  sheet().appendRow([
    Utilities.getUuid(),
    new Date().toISOString(),
    lead.name || "",
    lead.phone || "",
    lead.product || "",
    lead.message || ""
  ]);

  return json({ ok: true });
}
