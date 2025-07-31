import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDdmAnalysis } from "../hooks/useDdmAnalysis";
import { useApi } from "../lib/useApi";
import { toast } from "react-toastify";

export const StockDDMCalculator = () => {
  const [inputSymbol, setInputSymbol] = useState("PG");
  const [activeSymbol, setActiveSymbol] = useState("PG");

  const { data, isLoading, error } = useDdmAnalysis(activeSymbol);

  const [growthRate, setGrowthRate] = useState(5);
  const [discountRate, setDiscountRate] = useState(8);
  const [expectedDividend, setExpectedDividend] = useState<number | null>(null);

  useEffect(() => {
    if (data && expectedDividend === null) {
      setExpectedDividend(data.totalDividend);
    }
  }, [data, expectedDividend]);

  const handleAnalyze = () => {
    setExpectedDividend(null);
    setActiveSymbol(inputSymbol.toUpperCase());
  };

  const g = growthRate / 100;
  const r = discountRate / 100;
  const valid = r > g;
  const intrinsicValue =
    expectedDividend !== null && valid
      ? (expectedDividend * (1 + g)) / (r - g)
      : 0;

  const undervalued =
    data && data.currentPrice && intrinsicValue > data.currentPrice;

  const api = useApi();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!data || expectedDividend === null || !valid) {
        throw new Error("Invalid input data.");
      }

      const payload = {
        symbol: activeSymbol,
        expectedDividend,
        growthRate: g,
        discountRate: r,
        totalDividend: data.totalDividend,
        currentPrice: data.currentPrice,
        intrinsicValue,
        undervalued: Boolean(undervalued),
      };

      const res = await api("http://localhost:8080/api/ddm", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return res.json();
    },
    onSuccess: () => {
      toast.success("Analysis saved!");
    },
    onError: () => {
      toast.error("Failed to save analysis.");
    },
  });

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">DDM Calculator</h2>

      <div className="flex gap-2 items-end">
        <label className="flex-1 text-sm">
          Ticker
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            className="mt-1 w-full border px-2 py-1"
          />
        </label>
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
        >
          Fetch stock
        </button>
      </div>

      <div className="text-sm border p-2">
        <p className="font-medium">DDM formula: V = D × (1 + g) / (r − g)</p>
        <p>D = the estimated value of next year's dividend</p>
        <p>r = the company's cost of capital equity (required return)</p>
        <p>g = the constant growth rate for dividends, in perpetuity</p>
      </div>

      {isLoading && <p>Loading data ...</p>}

      {!isLoading && (error || !data) && (
        <p className="text-red-600">Could not get data for {activeSymbol}.</p>
      )}

      {!isLoading && data && expectedDividend !== null && (
        <>
          <div className="text-sm space-y-1">
            <p>Dividend last year: ${data.totalDividend.toFixed(2)}</p>
            <p>Number of dividend payouts: {data.dividendEvents}</p>
            <p>Current stock price: ${data.currentPrice.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <label>
              Dividend growth (g %)
              <input
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="mt-1 w-full border px-2 py-1"
              />
            </label>

            <label>
              Required return (r %)
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="mt-1 w-full border px-2 py-1"
              />
            </label>

            <label className="col-span-2">
              Dividend next year (D)
              <input
                type="number"
                min="0"
                value={expectedDividend}
                onChange={(e) => setExpectedDividend(Number(e.target.value))}
                className="mt-1 w-full border px-2 py-1"
              />
            </label>
          </div>

          {valid ? (
            <p>
              Value according to DDM:{" "}
              {intrinsicValue === 0 ? (
                <span className="text-gray-500">
                  Cannot evaluate (possibly zero dividend)
                </span>
              ) : (
                <>
                  <span
                    className={undervalued ? "text-green-600" : "text-red-600"}
                  >
                    ${intrinsicValue.toFixed(2)}
                  </span>{" "}
                  ({undervalued ? "Undervalued" : "Overvalued"})
                </>
              )}
            </p>
          ) : (
            <p className="text-orange-600">
              Required return (r %) must be greater than dividend growth (g %).
            </p>
          )}

          <button
            onClick={() => saveMutation.mutate()}
            disabled={!valid || intrinsicValue === 0 || saveMutation.isPending}
            className={`px-4 py-1 rounded ${
              !valid || intrinsicValue === 0 || saveMutation.isPending
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white cursor-pointer"
            }`}
          >
            {saveMutation.isPending ? "Saving..." : "Save analysis"}
          </button>
        </>
      )}
    </div>
  );
};
