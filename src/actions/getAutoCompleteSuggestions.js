"use server";

import axios from "axios";

// const GOOGLE_API_KEY = "AlzaSyGPVBrHA5iN9aoxgSWtxlm1y0I4shgJr6N"; // Make sure to keep this secret and not expose it in the frontend

// Server-side function to fetch autocomplete suggestions from Google Places API
export async function getAutocompleteSuggestions(query) {
  if (!query) {
    return { suggestions: [] };
  }

  try {
    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${query}&key=AlzaSyGPVBrHA5iN9aoxgSWtxlm1y0I4shgJr6N`
    );
    // console.log(response)
    return { suggestions: response.data.predictions };
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return { suggestions: [], error: "Error fetching suggestions" };
  }
}
