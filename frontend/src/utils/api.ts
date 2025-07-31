/*import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";*/

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const FINNHUB_API_URL = "https://finnhub.io/api/v1/";

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const POLYGON_API_URL = "https://api.polygon.io/v3/reference/dividends";

const getOneYearAgoDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split("T")[0];
};

export const fetchDividendData = async (symbol: string) => {
  const fromDate = getOneYearAgoDate();

  const url = `${POLYGON_API_URL}?ticker=${symbol}&ex_dividend_date.gte=${fromDate}&apiKey=${POLYGON_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch dividend data from Polygon API");
  }

  const data = await res.json();
  return data.results || [];
};

export const fetchQuote = async (symbol: string) => {
  const result = await fetch(
    `${FINNHUB_API_URL}quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  if (!result.ok) {
    throw new Error("Failed to fetch quote data from Finnhub API");
  }
  const data = await result.json();
  return data.c ?? null; //obs denna är moddad och returnerar bara current price, inte high/low/previous close som förra projektet
};

/* den här är för CI calculator, kanske används senare


export const monthlyCompoundInterestCalculator = (
  startValue: number,
  annualRate: number,
  years: number,
  monthlyInput: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  return (
    startValue * Math.pow(1 + monthlyRate, months) +
    (monthlyInput * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate
  );
};
/*




/* Kanske använder senare


export const useCreateCalculation = () => {
  return useMutation({
    mutationFn: async (input: {
      initialAmount: number;
      interestRate: number;
      years: number;
      monthlyContribution: number;
    }) => {
      const response = await fetch("http://localhost:8080/api/calculations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to save calculation");
      }

      return response.json();
    },
  });
};
*/
