/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: CLINIC DATABASE & EMAIL AUTOMATION SYSTEM
 * Spreadsheet: versionclinic (ID: 13hZQKf5iGbFuJ1a-U334cYLL9CP3s4quC342-9n66kQ)
 * ==============================================================================
 */

// Your exact Spreadsheet ID from the URL:
var SPREADSHEET_ID = "13hZQKf5iGbFuJ1a-U334cYLL9CP3s4quC342-9n66kQ";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  } catch (e) {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {
      throw new Error("Unable to open Spreadsheet with ID " + SPREADSHEET_ID + ": " + e.toString());
    }
  }
}

/**
 * Handle incoming POST requests from the clinic website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var rawData = e.postData ? e.postData.contents : "";
    var data = {};

    try {
      data = JSON.parse(rawData);
    } catch (parseErr) {
      data = e.parameter || {};
    }

    var ss = getSpreadsheet();
    // Always write to the primary active tab (Sheet1 / first sheet)
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];

    // Ensure headers exist
    ensureHeaders(sheet);

    var action = data.action || "create_appointment";

    if (action === "create_appointment") {
      var result = handleCreateAppointment(sheet, data, ss);
      SpreadsheetApp.flush();
      return result;
    } else if (action === "update_status") {
      var updateResult = handleUpdateStatus(sheet, data, ss);
      SpreadsheetApp.flush();
      return updateResult;
    } else {
      return createJsonResponse({
        status: "error",
        message: "Unknown action: " + action
      });
    }
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle incoming GET requests (health check & debug info)
 */
function doGet(e) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss ? (ss.getSheetByName("Sheet1") || ss.getSheets()[0]) : null;
    return createJsonResponse({
      status: "ok",
      clinic: "Vriksham Dental Care",
      spreadsheet_name: ss ? ss.getName() : "None",
      spreadsheet_url: ss ? ss.getUrl() : "None",
      sheet_name: sheet ? sheet.getName() : "None",
      total_rows: sheet ? sheet.getLastRow() : 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * Ensure table headers exist in Row 1
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp",
      "Appointment ID",
      "Patient Name",
      "Email Address",
      "Mobile Phone",
      "Treatment / Service",
      "Preferred Date",
      "Preferred Time",
      "Status",
      "Patient Notes",
      "Clinic Internal Notes"
    ];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2f8f4e");
    headerRange.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

/**
 * 1. CREATE APPOINTMENT:
 * Appends row to sheet, sends customer success email, and notifies clinic
 */
function handleCreateAppointment(sheet, data, ss) {
  var timestamp = new Date();
  var appointmentId = data.appointment_id || "APP-" + timestamp.getTime();
  var patientName = data.patient_name || "";
  var email = data.email || "";
  var phone = data.phone || "";
  var treatment = data.treatment_name || "General Dental Consultation";
  var preferredDate = data.preferred_date || "";
  var preferredTime = data.preferred_time || "";
  var status = data.status || "new";
  var patientNotes = data.patient_notes || "";
  var internalNotes = data.internal_notes || "";
  var clinicName = data.clinic_name || "Vriksham Dental Care";
  var clinicPhone = data.clinic_phone || "+91 94432 78120";

  // Append new row to Google Sheet
  sheet.appendRow([
    timestamp,
    appointmentId,
    patientName,
    email,
    phone,
    treatment,
    preferredDate,
    preferredTime,
    status,
    patientNotes,
    internalNotes
  ]);

  // Send Customer Success Confirmation Email
  if (email && email.indexOf("@") !== -1) {
    sendCustomerSuccessEmail({
      toEmail: email,
      patientName: patientName,
      treatment: treatment,
      preferredDate: preferredDate,
      preferredTime: preferredTime,
      appointmentId: appointmentId,
      clinicName: clinicName,
      clinicPhone: clinicPhone
    });
  }

  return createJsonResponse({
    status: "success",
    message: "Appointment saved to Google Sheet & confirmation email sent to patient.",
    appointment_id: appointmentId,
    spreadsheet_name: ss ? ss.getName() : "Unknown",
    spreadsheet_url: ss ? ss.getUrl() : "Unknown",
    sheet_name: sheet.getName(),
    row_number: sheet.getLastRow()
  });
}

/**
 * 2. UPDATE STATUS:
 * Updates the appointment status in the sheet and emails the customer their updated status
 */
function handleUpdateStatus(sheet, data) {
  var appointmentId = data.appointment_id || "";
  var email = data.email || "";
  var newStatus = data.status || "confirmed";
  var internalNotes = data.internal_notes || "";
  var patientName = data.patient_name || "Patient";
  var treatment = data.treatment_name || "Dental Treatment";
  var preferredDate = data.preferred_date || "";
  var preferredTime = data.preferred_time || "";
  var clinicName = data.clinic_name || "Vriksham Dental Care";
  var clinicPhone = data.clinic_phone || "+91 94432 78120";

  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;

  for (var i = 1; i < values.length; i++) {
    var rowId = String(values[i][1]);
    var rowEmail = String(values[i][3]);

    if (appointmentId && rowId === String(appointmentId)) {
      rowIndex = i + 1;
      if (!email && rowEmail) email = rowEmail;
      if (!patientName && values[i][2]) patientName = values[i][2];
      break;
    } else if (email && rowEmail.toLowerCase() === email.toLowerCase()) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 9).setValue(newStatus);
    if (internalNotes) {
      sheet.getRange(rowIndex, 11).setValue(internalNotes);
    }
  }

  if (email && email.indexOf("@") !== -1) {
    sendStatusUpdateEmail({
      toEmail: email,
      patientName: patientName,
      status: newStatus,
      treatment: treatment,
      preferredDate: preferredDate,
      preferredTime: preferredTime,
      appointmentId: appointmentId,
      internalNotes: internalNotes,
      clinicName: clinicName,
      clinicPhone: clinicPhone
    });
  }

  return createJsonResponse({
    status: "success",
    message: "Status updated to " + newStatus + " and customer notified via email.",
    row_updated: rowIndex !== -1
  });
}

/**
 * Sends a patient confirmation email (Customer Success)
 */
function sendCustomerSuccessEmail(params) {
  var subject = "Appointment Request Received - " + params.clinicName;

  var htmlBody = ""
    + "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e0; border-radius: 16px; overflow: hidden;'>"
    + "  <div style='background-color: #2f8f4e; padding: 28px; text-align: center; color: #ffffff;'>"
    + "    <h1 style='margin: 0; font-size: 24px; font-weight: 700;'>" + params.clinicName + "</h1>"
    + "    <p style='margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;'>Salem Main Road, Rasipuram, Namakkal District</p>"
    + "  </div>"
    + "  <div style='padding: 32px 28px; color: #141413;'>"
    + "    <h2 style='font-size: 20px; font-weight: 600; margin-top: 0; color: #141413;'>Appointment Request Received</h2>"
    + "    <p style='font-size: 14px; line-height: 1.6; color: #555550;'>Dear <strong>" + params.patientName + "</strong>,</p>"
    + "    <p style='font-size: 14px; line-height: 1.6; color: #555550;'>Thank you for scheduling your consultation with us. We have received your booking details and saved them in our clinic scheduling calendar.</p>"
    + "    <div style='background-color: #f6f6f4; border: 1px solid #e4e4df; border-radius: 12px; padding: 20px; margin: 24px 0;'>"
    + "      <table style='width: 100%; font-size: 13px; line-height: 1.8;'>"
    + "        <tr><td style='color: #777770; width: 40%;'>Appointment ID:</td><td style='font-weight: 600; font-family: monospace;'>" + params.appointmentId + "</td></tr>"
    + "        <tr><td style='color: #777770;'>Treatment / Reason:</td><td style='font-weight: 600; color: #2f8f4e;'>" + params.treatment + "</td></tr>"
    + "        <tr><td style='color: #777770;'>Preferred Date:</td><td style='font-weight: 600;'>" + params.preferredDate + "</td></tr>"
    + "        <tr><td style='color: #777770;'>Preferred Time:</td><td style='font-weight: 600;'>" + params.preferredTime + "</td></tr>"
    + "        <tr><td style='color: #777770;'>Current Status:</td><td style='font-weight: 600;'><span style='background: #e6f4ea; color: #137333; padding: 2px 8px; border-radius: 99px; font-size: 11px;'>Received / Pending Confirmation</span></td></tr>"
    + "      </table>"
    + "    </div>"
    + "    <p style='font-size: 14px; line-height: 1.6; color: #555550;'>Our reception desk will contact you via WhatsApp or phone call to confirm your final slot with our doctor.</p>"
    + "    <div style='margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e2e2dd;'>"
    + "      <p style='margin: 0; font-size: 13px; color: #777770;'>Need urgent assistance or have acute pain?</p>"
    + "      <p style='margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #2f8f4e;'>Direct Reception Hotline: " + params.clinicPhone + "</p>"
    + "    </div>"
    + "  </div>"
    + "  <div style='background-color: #f6f6f4; padding: 18px 28px; text-align: center; font-size: 11px; color: #888880; border-top: 1px solid #e5e5e0;'>"
    + "    <p style='margin: 0;'>© " + new Date().getFullYear() + " " + params.clinicName + ", Rasipuram, Tamil Nadu.</p>"
    + "    <p style='margin: 4px 0 0 0;'>This is an automated confirmation email for your appointment request.</p>"
    + "  </div>"
    + "</div>";

  try {
    MailApp.sendEmail({
      to: params.toEmail,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Failed to send customer success email: " + err);
  }
}

/**
 * Sends a status update email to the patient when admin changes status
 */
function sendStatusUpdateEmail(params) {
  var statusTitles = {
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    new: "Under Review"
  };

  var niceStatus = statusTitles[params.status] || params.status;
  var subject = "Appointment " + niceStatus + " - " + params.clinicName;

  var statusColor = "#2f8f4e";
  var statusMessage = "Your appointment has been confirmed by our clinical desk. Please arrive 10 minutes prior to your slot.";

  if (params.status === "completed") {
    statusColor = "#1a73e8";
    statusMessage = "Thank you for visiting " + params.clinicName + ". We hope your visit was gentle and comfortable. Please follow any post-treatment care instructions given by the doctor.";
  } else if (params.status === "cancelled") {
    statusColor = "#d93025";
    statusMessage = "Your appointment has been cancelled. If you would like to reschedule for another day or have questions, please call our clinic desk.";
  }

  var htmlBody = ""
    + "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e0; border-radius: 16px; overflow: hidden;'>"
    + "  <div style='background-color: " + statusColor + "; padding: 24px; text-align: center; color: #ffffff;'>"
    + "    <h1 style='margin: 0; font-size: 22px; font-weight: 700;'>" + params.clinicName + "</h1>"
    + "    <p style='margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;'>Status Update Notification</p>"
    + "  </div>"
    + "  <div style='padding: 32px 28px; color: #141413;'>"
    + "    <p style='font-size: 14px; line-height: 1.6; color: #555550;'>Dear <strong>" + params.patientName + "</strong>,</p>"
    + "    <div style='margin: 20px 0; padding: 16px 20px; border-radius: 12px; background-color: #fbfbfa; border-left: 4px solid " + statusColor + ";'>"
    + "      <div style='font-size: 12px; text-transform: uppercase; font-weight: 700; color: " + statusColor + ";'>Appointment Status: " + niceStatus.toUpperCase() + "</div>"
    + "      <p style='font-size: 14px; color: #333330; margin: 8px 0 0 0; line-height: 1.5;'>" + statusMessage + "</p>"
    + "    </div>"
    + "    <div style='background-color: #f6f6f4; border: 1px solid #e4e4df; border-radius: 12px; padding: 18px; margin: 24px 0; font-size: 13px; line-height: 1.8;'>"
    + "      <div><strong>Treatment:</strong> " + params.treatment + "</div>"
    + (params.preferredDate ? "<div><strong>Date:</strong> " + params.preferredDate + "</div>" : "")
    + (params.preferredTime ? "<div><strong>Time Slot:</strong> " + params.preferredTime + "</div>" : "")
    + (params.internalNotes ? "<div style='margin-top: 8px; color: #444440; font-style: italic;'><strong>Note from Doctor:</strong> " + params.internalNotes + "</div>" : "")
    + "    </div>"
    + "    <p style='font-size: 13px; line-height: 1.6; color: #666660;'>Location: No. 42/B, Salem Main Road, Near Old Bus Stand, Rasipuram, Namakkal.<br>Direct Phone: <strong>" + params.clinicPhone + "</strong></p>"
    + "  </div>"
    + "  <div style='background-color: #f6f6f4; padding: 16px; text-align: center; font-size: 11px; color: #888880; border-top: 1px solid #e5e5e0;'>"
    + "    © " + new Date().getFullYear() + " " + params.clinicName + ". All rights reserved."
    + "  </div>"
    + "</div>";

  try {
    MailApp.sendEmail({
      to: params.toEmail,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Failed to send status update email: " + err);
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
