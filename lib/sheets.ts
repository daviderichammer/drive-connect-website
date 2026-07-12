import { google } from "googleapis";

const SHEET_ID = "1oObH-tS1VviAdMpB3MHlMh11FnH2jpvo7R7v1QSADHQ";

// The sheet has 2 header rows:
// Row 1: Group headers (Business Information, Vehicle types, Current Rental Platforms)
// Row 2: Column headers:
// [0]  Business Name
// [1]  Owner Name
// [2]  Email Address
// [3]  Phone Number
// [4]  Primary City
// [5]  Additional Cities
// [6]  Number of Vehicles
// [7]  Sedan
// [8]  SUV
// [9]  Luxury
// [10] Convertible
// [11] Electric
// [12] Van
// [13] Truck
// [14] Exotic
// [15] Other (vehicle type)
// [16] Turo
// [17] Private Rentals
// [18] Hertz Local
// [19] Independent Rental Company
// [20] Other (platform)
// [21] Airport Delivery
// [22] Home Delivery
// [23] Commercial Insurance
// [24] Same Day Bookings
// [25] 24/7 Customer Service
// [26] Use Drive Connect CSRs

export async function appendPartnerApplicationToSheet(data: {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  primaryCity: string;
  additionalCities?: string | null;
  numberOfVehicles: number;
  vehicleTypes: string;
  currentPlatforms: string;
  turoProfileUrl?: string | null;
  offersAirportDelivery: boolean;
  offersHomeDelivery: boolean;
  hasCommercialInsurance: boolean;
  supportsSameDayBookings: boolean;
  operates24x7: boolean;
  wouldUseDCSupport: boolean;
}) {
  try {
    const serviceAccountJson = process.env.GCP_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      throw new Error("GCP_SERVICE_ACCOUNT_JSON is not configured");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountJson),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Vehicle types from the form (comma-separated string) -> individual Yes/No columns
    const vehicleTypeList = data.vehicleTypes
      ? data.vehicleTypes.split(",").map((v) => v.trim())
      : [];
    const platformList = data.currentPlatforms
      ? data.currentPlatforms.split(",").map((p) => p.trim())
      : [];

    const yn = (val: boolean) => (val ? "Yes" : "No");
    const hasVehicle = (type: string) =>
      vehicleTypeList.some((v) => v.toLowerCase() === type.toLowerCase()) ? "Yes" : "No";
    const hasPlatform = (platform: string) =>
      platformList.some((p) => p.toLowerCase() === platform.toLowerCase()) ? "Yes" : "No";

    const row = [
      data.businessName,                          // [0] Business Name
      data.ownerName,                             // [1] Owner Name
      data.email,                                 // [2] Email Address
      data.phone,                                 // [3] Phone Number
      data.primaryCity,                           // [4] Primary City
      data.additionalCities || "",               // [5] Additional Cities
      data.numberOfVehicles.toString(),           // [6] Number of Vehicles
      hasVehicle("Sedan"),                        // [7] Sedan
      hasVehicle("SUV"),                          // [8] SUV
      hasVehicle("Luxury"),                       // [9] Luxury
      hasVehicle("Convertible"),                  // [10] Convertible
      hasVehicle("Electric"),                     // [11] Electric
      hasVehicle("Van"),                          // [12] Van
      hasVehicle("Truck"),                        // [13] Truck
      hasVehicle("Exotic"),                       // [14] Exotic
      hasVehicle("Other"),                        // [15] Other (vehicle)
      hasPlatform("Turo"),                        // [16] Turo
      hasPlatform("Private Rentals"),             // [17] Private Rentals
      hasPlatform("Hertz Local Edition"),         // [18] Hertz Local
      hasPlatform("Independent Rental Company"),  // [19] Independent Rental Company
      hasPlatform("Other"),                       // [20] Other (platform)
      yn(data.offersAirportDelivery),             // [21] Airport Delivery
      yn(data.offersHomeDelivery),                // [22] Home Delivery
      yn(data.hasCommercialInsurance),            // [23] Commercial Insurance
      yn(data.supportsSameDayBookings),           // [24] Same Day Bookings
      yn(data.operates24x7),                     // [25] 24/7 Customer Service
      yn(data.wouldUseDCSupport),                // [26] Use Drive Connect CSRs
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:AA",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    console.log("Partner application appended to Google Sheet successfully");
    return true;
  } catch (error) {
    console.error("Failed to append to Google Sheet:", error);
    return false;
  }
}
