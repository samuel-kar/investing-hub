import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDividendHistoryForChowder,
  fetchQuote,
  calculateChowderRule,
} from "../utils/api";

export const ChowderRuleCalculator = () => {
  const [inputSymbol, setInputSymbol] = useState("PG");
  const [activeSymbol, setActiveSymbol] = useState("PG");

  const {
    data: dividendData,
    isLoading: dividendsLoading,
    error: dividendError,
  } = useQuery({
    queryKey: ["chowder-dividends", activeSymbol],
    queryFn: () => fetchDividendHistoryForChowder(activeSymbol),
    enabled: !!activeSymbol,
  });

  const {
    data: currentPrice,
    isLoading: priceLoading,
    error: priceError,
  } = useQuery({
    queryKey: ["chowder-price", activeSymbol],
    queryFn: () => fetchQuote(activeSymbol),
    enabled: !!activeSymbol,
  });

  const handleAnalyze = () => {
    setActiveSymbol(inputSymbol.toUpperCase());
  };

  const isLoading = dividendsLoading || priceLoading;
  const hasError = dividendError || priceError;

  const chowderResult =
    dividendData && currentPrice
      ? calculateChowderRule(dividendData, currentPrice)
      : null;

  const getChowderInterpretation = (score: number | null) => {
    if (score === null) return null;

    if (score >= 15) {
      return {
        level: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Strong dividend growth potential with good current yield",
      };
    } else if (score >= 12) {
      return {
        level: "Good",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description: "Solid combination of yield and growth",
      };
    } else if (score >= 8) {
      return {
        level: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "Moderate dividend attractiveness",
      };
    } else {
      return {
        level: "Poor",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Low dividend yield and/or poor dividend growth",
      };
    }
  };

  const interpretation = getChowderInterpretation(
    chowderResult?.chowderScore || null
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Chowder Rule Calculator
        </h2>
        <p className="text-gray-600 mb-6">
          The Chowder Rule combines current dividend yield with dividend growth
          rate (CAGR) to evaluate dividend stocks. A score of 12+ is generally
          considered attractive for dividend investors.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Stock Analysis
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Symbol
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputSymbol}
                  onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  placeholder="e.g., PG, KO, JNJ"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !inputSymbol.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">
                Chowder Rule Formula:
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>
                  Chowder Score = Dividend Yield (%) + Dividend CAGR (%)
                </strong>
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Dividend Yield = TTM Dividends / Current Price</p>
                <p>
                  • Dividend CAGR = 5-year compound annual growth rate of
                  dividends
                </p>
                <p>• Falls back to 3-year CAGR if insufficient 5-year data</p>
              </div>
            </div>

            {/* Interpretation Guide */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Score Interpretation:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • <strong>15+:</strong> Excellent dividend stock
                </li>
                <li>
                  • <strong>12-14:</strong> Good dividend opportunity
                </li>
                <li>
                  • <strong>8-11:</strong> Fair dividend potential
                </li>
                <li>
                  • <strong>&lt;8:</strong> Poor dividend characteristics
                </li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Analysis Results for {activeSymbol}
            </h3>

            {hasError && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700 text-sm">
                  Error loading data for {activeSymbol}. Please check the symbol
                  and try again.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-center">
                  Loading data for {activeSymbol}...
                </p>
              </div>
            )}

            {chowderResult && !isLoading && (
              <>
                {/* Main Chowder Score */}
                {chowderResult.isValid ? (
                  <div
                    className={`p-4 rounded-lg ${interpretation?.bgColor || "bg-gray-50"}`}
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Chowder Score
                      </h4>
                      <div
                        className={`text-4xl font-bold ${interpretation?.color || "text-gray-600"} mb-2`}
                      >
                        {chowderResult.chowderScore?.toFixed(1)}
                      </div>
                      <div
                        className={`text-lg font-semibold ${interpretation?.color || "text-gray-600"} mb-1`}
                      >
                        {interpretation?.level}
                      </div>
                      <p className="text-sm text-gray-600">
                        {interpretation?.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm text-center">
                      {chowderResult.message}
                    </p>
                  </div>
                )}

                {/* Detailed Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Breakdown:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="font-semibold text-gray-800">
                        ${currentPrice?.toFixed(2) || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dividend Yield:</span>
                      <span className="font-semibold text-gray-800">
                        {chowderResult.dividendYield?.toFixed(2) || "N/A"}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dividend CAGR:</span>
                      <span className="font-semibold text-gray-800">
                        {chowderResult.dividendCAGR?.toFixed(2) || "N/A"}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Years of Data:</span>
                      <span className="font-semibold text-gray-800">
                        {chowderResult.yearsOfData}
                      </span>
                    </div>

                    <hr className="border-gray-300" />

                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-800 font-semibold">
                        Chowder Score:
                      </span>
                      <span
                        className={`font-bold ${interpretation?.color || "text-gray-600"}`}
                      >
                        {chowderResult.chowderScore?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">
                    {chowderResult.message}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

