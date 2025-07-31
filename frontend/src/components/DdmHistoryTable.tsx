import { useApi } from "../lib/useApi";
import { useEffect, useState } from "react";
import { EditDdmAnalysisForm } from "./EditDdmAnalysisForm";
import { toast } from "react-toastify";

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

export function DdmHistoryTable() {
  const api = useApi();
  const [analyses, setAnalyses] = useState<DdmAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await api("http://localhost:8080/api/ddm");
        const data = await res.json();
        setAnalyses(data);
      } catch (err) {
        console.error("Could not fetch analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Are you sure that you want to remove this analysis?"
    );
    if (!confirmed) return;

    try {
      await api(`http://localhost:8080/api/ddm/${id}`, { method: "DELETE" });
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analysis successfully deleted.");
    } catch (err) {
      console.error("Error when deleting:", err);
      toast.error("Error occured when deleting.");
    }
  };

  const handleSave = (updated: DdmAnalysis) => {
    setAnalyses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingId(null);
  };

  if (loading) return <p>Loading analyses...</p>;
  if (analyses.length === 0) return <p>No analyses saved yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Saved results</h2>
      <table className="w-full text-sm border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Ticker</th>
            <th className="border px-2 py-1 text-right">Expected Div</th>
            <th className="border px-2 py-1 text-right">Div Growth</th>
            <th className="border px-2 py-1 text-right">Req Return</th>
            <th className="border px-2 py-1 text-right">Intrinsic Value</th>
            <th className="border px-2 py-1 text-right">Current Price</th>
            <th className="border px-2 py-1 text-center">DDM value</th>
            <th className="border px-2 py-1 text-right">Date</th>
            <th className="border px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((a) => (
            <tr key={a.id}>
              <td className="border px-2 py-1">{a.symbol}</td>
              <td className="border px-2 py-1 text-right">
                ${a.expectedDividend.toFixed(2)}
              </td>
              <td className="border px-2 py-1 text-right">
                {(a.growthRate * 100).toFixed(1)}%
              </td>
              <td className="border px-2 py-1 text-right">
                {(a.discountRate * 100).toFixed(1)}%
              </td>
              <td className="border px-2 py-1 text-right">
                ${a.intrinsicValue.toFixed(2)}
              </td>
              <td className="border px-2 py-1 text-right">
                ${a.currentPrice.toFixed(2)}
              </td>
              <td className="border px-2 py-1 text-center">
                {a.undervalued ? "Undervalued" : "Overvalued"}
              </td>
              <td className="border px-2 py-1 text-right">
                {new Date(a.createdAt).toLocaleDateString("sv-SE")}
              </td>
              <td className="border px-2 py-1 text-center space-x-2">
                <button
                  onClick={() => setEditingId(a.id)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-600 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingId !== null && (
        <div className="mt-6">
          <EditDdmAnalysisForm
            analysis={analyses.find((a) => a.id === editingId)!}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}
    </div>
  );
}
