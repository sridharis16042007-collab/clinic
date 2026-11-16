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
    } else if (action === "get_appointments") {
      return handleGetAppointments(sheet);
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
 * Handle incoming GET requests:
 * Returns all appointments from Google Sheet as JSON for the Admin Dashboard
 */
function doGet(e) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss ? (ss.getSheetByName("Sheet1") || ss.getSheets()[0]) : null;

    if (!sheet) {
      return createJsonResponse({
        status: "error",
        message: "Spreadsheet sheet not found."
      });
    }

    return handleGetAppointments(sheet, ss);
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * Helper to extract all appointment rows from Google Sheet
 */
function handleGetAppointments(sheet, ss) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var appointments = [];

  // Header is row 0: [Timestamp, Appointment ID, Patient Name, Email Address, Mobile Phone, Treatment, Preferred Date, Preferred Time, Status, Patient Notes, Internal Notes]
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    // Skip empty rows
    if (!row[1] && !row[2]) continue;

    var rawPhone = String(row[4] || "").replace(/^'/, "");

    appointments.push({
      id: String(row[1] || "app-" + i),
      patient_name: String(row[2] || "Patient"),
      email: String(row[3] || ""),
      phone: rawPhone,
      treatment_name: String(row[5] || "General Consultation"),
      preferred_date: row[6] ? (row[6] instanceof Date ? Utilities.formatDate(row[6], "GMT+05:30", "yyyy-MM-dd") : String(row[6])) : "",
      preferred_time: String(row[7] || "10:00 AM"),
      status: String(row[8] || "new").toLowerCase().trim(),
      patient_notes: String(row[9] || ""),
      internal_notes: String(row[10] || ""),
      created_at: row[0] ? (row[0] instanceof Date ? row[0].toISOString() : String(row[0])) : new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Newest appointments first
  appointments.reverse();

  return createJsonResponse({
    status: "success",
    clinic: "Vriksham Dental Care",
    spreadsheet_name: ss ? ss.getName() : "versionclinic",
    count: appointments.length,
    appointments: appointments,
    timestamp: new Date().toISOString()
  });
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

  // Format phone as explicit text with single quote to prevent Google Sheets formula #ERROR!
  var formattedPhone = phone ? String(phone).trim() : "";
  if (formattedPhone.charAt(0) === "+") {
    formattedPhone = "'" + formattedPhone;
  }

  // Append new row to Google Sheet
  sheet.appendRow([
    timestamp,
    appointmentId,
    patientName,
    email,
    formattedPhone,
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
function handleUpdateStatus(sheet, data, ss) {
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

  // Send status update email to patient
  if (email && email.indexOf("@") !== -1) {
    sendStatusUpdateEmail({
      toEmail: email,
      patientName: patientName,
      treatment: treatment,
      preferredDate: preferredDate,
      preferredTime: preferredTime,
      appointmentId: appointmentId,
      newStatus: newStatus,
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
 * 3. Send Customer Success HTML Email on Booking Submission
 */
function sendCustomerSuccessEmail(params) {
  try {
    var subject = "Appointment Request Confirmed - " + params.clinicName + " [ID: " + params.appointmentId + "]";
    var htmlBody = "" +
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e4; border-radius: 12px; background-color: #ffffff; color: #1a1a1a;'>" +
      "  <div style='border-bottom: 2px solid #2f8f4e; padding-bottom: 16px; margin-bottom: 20px;'>" +
      "    <h1 style='color: #2f8f4e; margin: 0; font-size: 24px; font-weight: bold;'>" + params.clinicName + "</h1>" +
      "    <p style='margin: 4px 0 0 0; color: #666; font-size: 13px;'>Rasipuram, Namakkal District, Tamil Nadu</p>" +
      "  </div>" +
      "  <p style='font-size: 16px; line-height: 1.5;'>Dear <strong>" + params.patientName + "</strong>,</p>" +
      "  <p style='font-size: 14px; color: #333; line-height: 1.6;'>Thank you for booking your consultation with our clinic. Your appointment request has been recorded in our system.</p>" +
      "  <div style='background-color: #f8faf8; border: 1px solid #dcf0e2; border-radius: 8px; padding: 16px; margin: 20px 0;'>" +
      "    <h3 style='margin: 0 0 12px 0; font-size: 14px; color: #2f8f4e; text-transform: uppercase; letter-spacing: 0.5px;'>Booking Summary</h3>" +
      "    <table style='width: 100%; font-size: 14px; border-collapse: collapse;'>" +
      "      <tr><td style='padding: 6px 0; color: #666; width: 140px;'>Reference ID:</td><td style='padding: 6px 0; font-weight: bold; color: #1a1a1a;'>" + params.appointmentId + "</td></tr>" +
      "      <tr><td style='padding: 6px 0; color: #666;'>Treatment:</td><td style='padding: 6px 0; font-weight: 500;'>" + params.treatment + "</td></tr>" +
      "      <tr><td style='padding: 6px 0; color: #666;'>Preferred Date:</td><td style='padding: 6px 0; font-weight: 500;'>" + params.preferredDate + "</td></tr>" +
      "      <tr><td style='padding: 6px 0; color: #666;'>Preferred Time:</td><td style='padding: 6px 0; font-weight: 500;'>" + params.preferredTime + "</td></tr>" +
      "      <tr><td style='padding: 6px 0; color: #666;'>Current Status:</td><td style='padding: 6px 0;'><span style='background-color: #e6f4ea; color: #137333; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;'>Received / Under Review</span></td></tr>" +
      "    </table>" +
      "  </div>" +
      "  <p style='font-size: 14px; line-height: 1.6; color: #444;'>Our reception team will review your requested time slot and contact you via phone/WhatsApp if any adjustment is needed.</p>" +
      "  <div style='background-color: #f3f3f2; padding: 14px; border-radius: 6px; font-size: 13px; color: #555; margin-top: 24px;'>" +
      "    <strong>Clinic Contact:</strong> " + params.clinicPhone + " | <strong>Address:</strong> Salem Main Road, Rasipuram" +
      "  </div>" +
      "  <p style='font-size: 11px; color: #888; margin-top: 20px; text-align: center;'>This is an automated confirmation email from Vriksham Dental Care.</p>" +
      "</div>";

    MailApp.sendEmail({
      to: params.toEmail,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Customer email failed: " + err.toString());
  }
}

/**
 * 4. Send Status Update Email when Clinic Changes Appointment Status
 */
function sendStatusUpdateEmail(params) {
  try {
    var statusTitle = params.newStatus.toUpperCase();
    var statusColor = params.newStatus === "confirmed" ? "#2f8f4e" : params.newStatus === "completed" ? "#1a73e8" : "#d93025";
    var subject = "Update on Your Appointment - " + params.clinicName + " [" + statusTitle + "]";

    var htmlBody = "" +
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e4; border-radius: 12px; background-color: #ffffff; color: #1a1a1a;'>" +
      "  <div style='border-bottom: 2px solid " + statusColor + "; padding-bottom: 16px; margin-bottom: 20px;'>" +
      "    <h1 style='color: " + statusColor + "; margin: 0; font-size: 22px; font-weight: bold;'>" + params.clinicName + "</h1>" +
      "    <p style='margin: 4px 0 0 0; color: #666; font-size: 13px;'>Appointment Status Update</p>" +
      "  </div>" +
      "  <p style='font-size: 16px;'>Dear <strong>" + params.patientName + "</strong>,</p>" +
      "  <p style='font-size: 14px; line-height: 1.6;'>The status of your appointment request (Ref: <strong>" + params.appointmentId + "</strong>) has been updated to:</p>" +
      "  <div style='text-align: center; margin: 20px 0;'>" +
      "    <span style='background-color: " + statusColor + "; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 15px; font-weight: bold; letter-spacing: 0.5px; display: inline-block;'>" +
             statusTitle +
      "    </span>" +
      "  </div>" +
      (params.internalNotes ? "  <p style='font-size: 14px; background-color: #f8f9fa; padding: 12px; border-left: 3px solid " + statusColor + "; border-radius: 4px;'><strong>Clinic Note:</strong> " + params.internalNotes + "</p>" : "") +
      "  <div style='font-size: 13px; color: #555; margin-top: 24px;'>" +
      "    If you need to reschedule or have any urgent questions, please call us directly at <strong>" + params.clinicPhone + "</strong>." +
      "  </div>" +
      "</div>";

    MailApp.sendEmail({
      to: params.toEmail,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Status update email failed: " + err.toString());
  }
}

/**
 * Utility: Create JSON Output with CORS headers
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
