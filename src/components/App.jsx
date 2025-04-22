import { useState } from "react";
import axios from "axios";
import ThreeScene from "./ThreeScene";
import { supabase } from "../lib/supabaseClient";

function App() {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPdfUrl("");

    try {
      // 🔐 Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("❌ Please log in to generate reports.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://157.245.104.62:8000/generate_report/`,
        {
          company_website: company,
          company_domain: industry,
          user_id: user.id,
        }
      );

      setPdfUrl(response.data.pdf_url || response.data.download_url);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <ThreeScene />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-8 z-10">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            ✨ Competitor Analysis
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Company Website (e.g. nike.com)"
              className="w-full bg-white/10 text-white placeholder-white/60 p-3 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Industry (e.g. fashion)"
              className="w-full bg-white/10 text-white placeholder-white/60 p-3 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-200 transition-all shadow-md"
              disabled={loading}
            >
              {loading ? "⏳ Generating..." : "🚀 Generate Report"}
            </button>
          </form>

          {error && <p className="text-red-400 mt-4">{error}</p>}

          {pdfUrl && (
            <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20 text-center">
              <p className="text-green-300 mb-2">✅ Report is ready!</p>
              <a
                href={pdfUrl}
                className="text-yellow-300 underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 Click here to download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
