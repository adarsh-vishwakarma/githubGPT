"use client";
import React from "react";
import { useState, useCallback } from "react";
import { MapPin, Upload, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import GomapaAutocomplete from "./GomapAutoComplete";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSession } from "next-auth/react";
import { createReport } from "@/actions/dbActions";
import toast from "react-hot-toast";
const UploadWasteReport = ({session}) => {


  const geminiApiKey = "AIzaSyAgONkQEHh7ifH0HOVnoyOJEX8jrcuQJ9s";

  const [newReport, setNewReport] = useState({
    location: "",
    type: "",
    amount: "",
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [reports, setReports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    console.log("Selected Place:", place);

    // Update the newReport state with the selected place's description
    setNewReport((prevReport) => ({
      ...prevReport,
      location: place.description, // Assuming 'description' is the field you want to store
    }));
  };
  const onLoad = useCallback((ref) => {
    setSearchBox(ref);
  }, []);

  const handleVerify = async () => {
    if (!file) return;

    setVerificationStatus("verifying");

    let retries = 3; // Number of retry attempts
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    while (retries > 0) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = await readFileAsBase64(file);
        const imageParts = [
          {
            inlineData: {
              data: base64Data.split(",")[1],
              mimeType: file.type,
            },
          },
        ];

        const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
1. The type of waste detected (e.g., plastic, paper, glass, metal, organic).
2. An estimate of the quantity or amount in a concise format, using only "kg" for solid waste and "liters" for liquid waste (e.g., "approximately 100 kg" or "approximately 50 liters").
3. Your confidence level in this assessment as a percentage (between 0 and 1).

Ensure the estimated quantity is always expressed in either "kg" or "liters".

Respond in JSON format like this:
{
  "wasteType": "type of waste",
  "quantity": "estimated quantity with unit (kg or liters only)",
  "confidence": confidence level as a number between 0 and 1
}`;

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = await response.text();

        try {
          const cleanedText = text
            .replace(/^```json/g, "")
            .replace(/```\s*$/g, "")
            .trim();
          console.log(cleanedText);
   
          console.log("parsedResult :", cleanedText);
          const parsedResult = JSON.parse(cleanedText);

          if (
            parsedResult.wasteType &&
            parsedResult.quantity &&
            parsedResult.confidence
          ) {
            setVerificationResult(parsedResult);
            setVerificationStatus("success");
            setNewReport({
              ...newReport,
              type: parsedResult.wasteType,
              amount: parsedResult.quantity,
            });
          } else {
            console.error("Invalid verification result:", parsedResult);
            setVerificationStatus("failure");
          }
        } catch (error) {
          console.error("Failed to parse JSON response:", text);
          setVerificationStatus("failure");
        }

        return; // Exit the loop if successful
      } catch (error) {
        console.error("Error verifying waste:", error);
        retries--;

        if (retries > 0) {
          console.log(`Retrying... (${3 - retries} attempts left)`);
          await delay(2000); // Wait for 2 seconds before retrying
        } else {
          setVerificationStatus("failure");
        }
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (verificationStatus !== "success" || !session) {
      toast.error("Please verify the waste before submitting or log in.");
      return;
    }

    setIsSubmitting(true);
    // const userId = await user.id
    console.log(newReport);
    // setIsSubmitting(false)
    // return
    try {
      const report = await createReport(
        session.user.id,
        newReport.location,
        newReport.type,
        newReport.amount,
        preview || undefined,
        verificationResult ? JSON.stringify(verificationResult) : undefined
      );
      console.log(report);
      const formattedReport = {
        id: report.id,
        location: report.location,
        wasteType: report.wasteType,
        amount: report.amount,
        createdAt: report.createdAt.toISOString().split("T")[0],
      };

      setReports([formattedReport, ...reports]);
      setNewReport({ location: "", type: "", amount: "" });
      setFile(null);
      setPreview(null);
      setVerificationStatus("idle");
      setVerificationResult(null);

      toast.success(
        `Report submitted successfully! You've earned points for reporting waste.`
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg mb-12"
    >
      <div className="mb-8">
        <label
          htmlFor="waste-image"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Upload Waste Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="waste-image"
                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
              >
                <span>Upload a file</span>
                <input
                  id="waste-image"
                  name="waste-image"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
      {preview && (
        <div className="mt-4 mb-8">
          <img
            src={preview}
            alt="Waste preview"
            className="max-w-full h-auto rounded-xl shadow-md"
          />
        </div>
      )}
      <Button
        type="button"
        onClick={handleVerify}
        className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
        disabled={!file || verificationStatus === "verifying"}
      >
        {verificationStatus === "verifying" ? (
          <>
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Verifying...
          </>
        ) : (
          "Verify Waste"
        )}
      </Button>
      {verificationStatus === "success" && verificationResult && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">
                Verification Successful
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Waste Type: {verificationResult.wasteType}</p>
                <p>Quantity: {verificationResult.quantity}</p>
                <p>
                  Confidence: {(verificationResult.confidence * 100).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>

          <GomapaAutocomplete onPlaceSelected={handlePlaceSelected} />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Waste Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={newReport.type}
            // onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
            placeholder="Verified waste type"
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Estimated Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={newReport.amount}
            // onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
            placeholder="Verified amount"
            readOnly
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Submitting...
          </>
        ) : (
          "Submit Report"
        )}
      </Button>
    </form>
  );
};

export default UploadWasteReport;
