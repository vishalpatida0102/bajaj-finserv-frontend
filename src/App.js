import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const isValidJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!isValidJson(jsonInput)) {
      setError('Invalid JSON format.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://bajaj-finserv-backend1.onrender.com/bfhl',{ input:jsonInput});
      setResponse(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Error in API call.');
      setIsLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const { options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedFields(selectedValues);
  };

  const renderSelectedFields = () => {
    if (!response) return null;
    const fieldsToDisplay = {};

    selectedFields.forEach(field => {
      fieldsToDisplay[field] = response[field];
    });

    return (
      <div>
        {Object.entries(fieldsToDisplay).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Bajaj Finserv Health Dev Challenge</h1>
      <h1>Vishal Patidar , 0827CY221068 , vishalpatidar221184@acropolis.in</h1>

      <textarea
        value={jsonInput}
        onChange={handleJsonChange}
        placeholder="Enter JSON data here"
        rows="10"
        cols="50"
      ></textarea>
      <br></br>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h2>Response:</h2>
          <div>
            <label>
              Select fields to display:
              <select multiple onChange={handleSelectChange}>
                <option value="numbers">Numbers</option>
                <option value="alphabets">Alphabets</option>
                <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
                <option value="is_prime_found">Is Prime Found</option>
                <option value="file_valid">File Valid</option>
                <option value="file_mime_type">File MIME Type</option>
                <option value="file_size_kb">File Size (KB)</option>
              </select>
            </label>

            {renderSelectedFields()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;