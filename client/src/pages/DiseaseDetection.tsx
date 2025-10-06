import React, { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle, TrendingUp, Droplet } from "lucide-react";

// ---- Types ----
type PredictionResponse = {
  prediction: string;
  confidence: number | string;
  fertilizer?: string;
  treatment?: string;
};

type CircularProgressBarProps = {
  percent: number;
  color?: string;
};

// Prefer .env: VITE_DISEASE_PREDICT_URL=https://your-api.example.com/predict
const PREDICT_URL =
  import.meta.env.VITE_DISEASE_PREDICT_URL ??
  "https://diseasedetectionrend.onrender.com/predict";

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percent, color }) => {
  const displayPercent = Math.max(0, Math.min(100, percent));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercent / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full">
        <circle cx="50%" cy="50%" r={radius} stroke="#e5e5e5" strokeWidth={4} fill="none" />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color || "currentColor"}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700">%</span>
      </div>
    </div>
  );
};

const DiseaseDetection: React.FC = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
    } else {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(PREDICT_URL, { method: "POST", body: formData });
      if (!response.ok) throw new Error(`Failed to fetch prediction (${response.status})`);
      const data = (await response.json()) as PredictionResponse;
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Main Grid Container */}
      <div className="grid grid-cols-2 gap-8 max-w-6xl w-full bg-white rounded-lg shadow-lg">
        {/* Left Side: Centered Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Header with Icon */}
            <div className="flex items-center space-x-3 mb-8">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Disease Detection</h1>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  onChange={handleFileChange}
                />
              </div>

              {previewImage && (
                <div className="mt-4">
                  <img src={previewImage} alt="Uploaded Preview" className="w-full h-auto rounded-lg shadow" />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Predicting…" : "Predict"}
              </button>
            </form>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm mt-4">Error: {error}</div>}
          </div>
        </div>

        {/* Right Side: Prediction Results */}
        <div className="space-y-6 p-8">
          {result ? (
            <>
              <div className="text-center">
                <h2 className="text-lg font-bold text-indigo-600">Disease Detection Result</h2>
              </div>

              <div className="grid gap-4">
                {/* Prediction Box */}
                <div className="flex items-center bg-white rounded-lg p-4 shadow">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Prediction:</p>
                    <p className="text-sm text-gray-700">{result.prediction}</p>
                  </div>
                </div>

                {/* Confidence Box */}
                <div className="flex items-center bg-white rounded-lg p-4 shadow">
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Confidence:</p>
                    <p className="text-sm text-gray-700">
                      {typeof result.confidence === "number" ? result.confidence.toFixed(2) : result.confidence}%
                    </p>
                  </div>
                </div>

                {/* Fertilizer Box */}
                <div className="flex items-center bg-white rounded-lg p-4 shadow">
                  <Droplet className="h-6 w-6 text-purple-600 mr-4" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Fertilizer:</p>
                    <p className="text-sm text-gray-700">{result.fertilizer ?? "—"}</p>
                  </div>
                </div>

                {/* Treatment Box */}
                <div className="flex items-center bg-white rounded-lg p-4 shadow">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Treatment:</p>
                    <p className="text-sm text-gray-700">{result.treatment ?? "—"}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center">Upload an image to see the predictions.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
