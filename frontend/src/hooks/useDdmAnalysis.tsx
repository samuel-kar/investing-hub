import { useQuery } from "@tanstack/react-query";
import { fetchDividendData, fetchQuote } from "../utils/api";

export const useDdmAnalysis = (symbol: string) => {
  return useQuery({
    queryKey: ["ddm-analysis", symbol],
    queryFn: async () => {
      const [dividends, price] = await Promise.all([
        fetchDividendData(symbol),
        fetchQuote(symbol),
      ]);

      const totalDividend = dividends.reduce(
        (sum: number, d: { cash_amount: number | string }) =>
          sum + (Number(d.cash_amount) || 0),
        0 //bara startvärdet för summan
      );

      return {
        symbol,
        totalDividend,
        dividendEvents: dividends.length,
        currentPrice: price,
      };
    },
    enabled: !!symbol, // reminder för mig själv: queryn körs inte om symbol är falsy
  });
};
