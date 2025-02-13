'use client';

import { getAutocompleteSuggestions } from "@/actions/getAutoCompleteSuggestions";
import React, { useState } from "react";

const GomapaAutocomplete = ({ onPlaceSelected }) => {
  const [inputValue, setInputValue] = useState("");  // State to hold the input value
  const [suggestions, setSuggestions] = useState([]);  // State to hold suggestion list

  // Handle input change
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);  // Update input value as the user types
    
    if (value.length > 2) {
      try {
        // Call the API for autocomplete suggestions if input length is greater than 2
        const { suggestions } = await getAutocompleteSuggestions(value);
        setSuggestions(suggestions);  // Update the suggestions state with the API response
      } catch (error) {
        setSuggestions([]);  // In case of an error, reset the suggestions
      }
    } else {
      setSuggestions([]);  // Reset suggestions if input is too short
    }
  };

  // Handle selection of a suggestion
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);  // Update input field with selected suggestion's description
    setSuggestions([]);  // Clear the suggestions list
    onPlaceSelected(suggestion);  // Pass the selected suggestion to the parent component
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}  // Bind the input value to the state
        onChange={handleInputChange}  // Trigger input change handler on change
        placeholder="Enter waste location"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}  // Handle suggestion click
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion.description}  {/* Adjust this according to your data structure */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GomapaAutocomplete;
