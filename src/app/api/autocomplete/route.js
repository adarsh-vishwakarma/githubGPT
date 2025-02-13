// pages/api/autocomplete.js
import axios from 'axios';

export default async function handler(req, res) {
  // Check if the method is GET
  if (req.method === 'GET') {
    const { input } = req.query;
    const apiKey = 'YOUR_GOOGLE_API_KEY';  // Replace with your Google Maps API key

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: AlzaSyGPVBrHA5iN9aoxgSWtxlm1y0I4shgJr6N,
          },
        }
      );
      res.status(200).json(response.data);  // Send the response back to the client
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  } else {
    // Handle unsupported methods (like POST, PUT, etc.)
    res.status(405).json({ error: "Method Not Allowed" });
  }
}


// key: AlzaSyGPVBrHA5iN9aoxgSWtxlm1y0I4shgJr6N,