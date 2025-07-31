import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useApi } from "../lib/useApi";

type DdmAnalysis = {
  id: number;
  symbol: string;
  expectedDividend: number;
  growthRate: number;
  discountRate: number;
  totalDividend: number;
  currentPrice: number;
  intrinsicValue: number;
  undervalued: boolean;
  createdAt: string;
};

type Props = {
  analysis: DdmAnalysis;
  onSave: (updated: DdmAnalysis) => void;
  onCancel: () => void;
};

export function EditDdmAnalysisForm({ analysis, onSave, onCancel }: Props) {
  const api = useApi();

  const [expectedDividend, setExpectedDividend] = useState(
    analysis.expectedDividend
  );
  const [growthRate, setGrowthRate] = useState(analysis.growthRate * 100);
  const [discountRate, setDiscountRate] = useState(analysis.discountRate * 100);

  const g = growthRate / 100;
  const r = discountRate / 100;
  const valid = r > g;

  const intrinsicValue = valid ? (expectedDividend * (1 + g)) / (r - g) : 0;
  const undervalued = intrinsicValue > analysis.currentPrice;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        symbol: analysis.symbol,
        expectedDividend,
        growthRate: g,
        discountRate: r,
        totalDividend: analysis.totalDividend,
        currentPrice: analysis.currentPrice,
        intrinsicValue,
        undervalued,
      };

      const res = await api(`http://localhost:8080/api/ddm/${analysis.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return res.json();
    },
    onSuccess: (updated) => {
      onSave(updated);
      toast.success("Analysis updated.");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update analysis.");
    },
  });

  return (
    <div className="space-y-3 border p-4 rounded bg-gray-50">
      <p>
        <strong>{analysis.symbol}</strong>
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <label>
          Expected dividend (D)
          <input
            type="number"
            value={expectedDividend}
            onChange={(e) => setExpectedDividend(Number(e.target.value))}
            className="mt-1 w-full border px-2 py-1"
          />
        </label>

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
          Discount (r %)
          <input
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
            className="mt-1 w-full border px-2 py-1"
          />
        </label>

        <div className="flex flex-col justify-end">
          <p className="text-sm">
            Value according to DDM:{" "}
            {intrinsicValue === 0 ? (
              <span className="text-gray-500">Cannot evaluate</span>
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
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => mutation.mutate()}
          disabled={!valid || intrinsicValue === 0 || mutation.isPending}
          className={`px-4 py-1 rounded ${
            !valid || intrinsicValue === 0 || mutation.isPending
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white cursor-pointer"
          }`}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
        <button onClick={onCancel} className="text-gray-600 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
