import { useState } from "react";
import axios from "axios";

function App() {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://157.245.104.62:8000/generate_report/",
        {
          company_website: company,
          company_domain: industry,
        },
        { responseType: "blob" } // Ensure response is treated as a file
      );

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Competitor_Analysis_${company}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Competitor Analysis
        </h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Enter Company Website"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Industry"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default App;
