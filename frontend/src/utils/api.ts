/*import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";*/

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const FINNHUB_API_URL = "https://finnhub.io/api/v1/";

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const POLYGON_API_URL = "https://api.polygon.io/v3/reference/dividends";
const POLYGON_SPLITS_API_URL = "https://api.polygon.io/v3/reference/splits";

const getOneYearAgoDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split("T")[0];
};

// Note: If needed in future, reintroduce getDateYearsAgo

const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
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

export const fetchDividendHistoryForChowder = async (symbol: string) => {
  // Use full calendar years from Jan 1 of (lastCompleteYear - 5)
  const currentYearNum = new Date().getFullYear();
  const lastCompleteYear = currentYearNum - 1;
  const fromDate = `${lastCompleteYear - 5}-01-01`;

  const dividendsUrl = `${POLYGON_API_URL}?ticker=${symbol}&ex_dividend_date.gte=${fromDate}&apiKey=${POLYGON_API_KEY}&limit=1000`;

  const divRes = await fetch(dividendsUrl);

  if (!divRes.ok) {
    throw new Error("Failed to fetch dividend history from Polygon API");
  }
  const divData = await divRes.json();
  const dividends: DividendData[] = divData.results || [];

  // Fetch splits to adjust historical dividends to a consistent share basis
  const splitsRes = await fetch(
    `${POLYGON_SPLITS_API_URL}?ticker=${symbol}&execution_date.gte=${fromDate}&apiKey=${POLYGON_API_KEY}&limit=100`
  );
  if (!splitsRes.ok) {
    throw new Error("Failed to fetch splits data from Polygon API");
  }
  const splitsData = await splitsRes.json();
  const splits: SplitData[] = splitsData.results || [];

  return adjustDividendsForSplits(dividends, splits);
};

type DividendData = {
  cash_amount: number;
  ex_dividend_date: string;
};

type SplitData = {
  execution_date: string; // ISO date string
  split_to: number; // e.g. 4 in a 4-for-1
  split_from: number; // e.g. 1 in a 4-for-1
};

// Adjust each dividend to post-split basis by dividing any dividend occurring BEFORE a split
// by that split ratio (split_to / split_from). Applies cumulative adjustments for multiple splits.
const adjustDividendsForSplits = (
  dividends: DividendData[],
  splits: SplitData[]
): DividendData[] => {
  if (!splits || splits.length === 0) return dividends;
  const sortedSplits = [...splits].sort((a, b) =>
    a.execution_date.localeCompare(b.execution_date)
  );

  return dividends.map((d) => {
    let factor = 1;
    for (const s of sortedSplits) {
      // If the split happened AFTER the dividend ex-date, we need to adjust that past dividend
      if (s.execution_date > d.ex_dividend_date) {
        const to = Number(s.split_to) || 0;
        const from = Number(s.split_from) || 0;
        if (to > 0 && from > 0) {
          factor *= to / from;
        }
      }
    }
    if (factor === 1) return d;
    return { ...d, cash_amount: d.cash_amount / factor };
  });
};

export const calculateChowderRule = (
  dividends: DividendData[],
  currentPrice: number
): {
  chowderScore: number | null;
  dividendYield: number | null;
  dividendCAGR: number | null;
  yearsOfData: number;
  isValid: boolean;
  message: string;
} => {
  if (!dividends || dividends.length === 0 || !currentPrice) {
    return {
      chowderScore: null,
      dividendYield: null,
      dividendCAGR: null,
      yearsOfData: 0,
      isValid: false,
      message: "No dividend data available",
    };
  }

  // Group dividends by calendar year
  let dividendsByYear: { [year: string]: number } = {};

  dividends.forEach((dividend) => {
    const year = dividend.ex_dividend_date.substring(0, 4);
    const amount = Number((dividend as any).cash_amount) || 0;
    dividendsByYear[year] = (dividendsByYear[year] || 0) + amount;
  });

  const years = Object.keys(dividendsByYear).sort();
  const yearsOfData = years.length;

  if (yearsOfData < 2) {
    return {
      chowderScore: null,
      dividendYield: null,
      dividendCAGR: null,
      yearsOfData,
      isValid: false,
      message: "Insufficient dividend history (need at least 2 years)",
    };
  }

  // Calculate TTM dividend yield (sum of dividends over last 365 days)
  const oneYearAgoIso = getDateDaysAgo(365);
  const ttmDividends = dividends
    .filter((d) => d.ex_dividend_date >= oneYearAgoIso)
    .reduce((sum, d) => sum + (Number(d.cash_amount) || 0), 0);
  const dividendYield = (ttmDividends / currentPrice) * 100;

  // Calculate dividend CAGR
  let dividendCAGR: number | null = null;
  let cagrYears = 0;

  // For proper CAGR calculation, we need complete years of data
  // Try 5-year CAGR first, fall back to shorter periods if needed
  const currentYearNum = new Date().getFullYear();
  const lastCompleteYear = currentYearNum - 1; // Use last complete year as end point

  // Try 5-year CAGR (from 5 years ago to last complete year)
  const fiveYearsAgo = (lastCompleteYear - 5).toString(); // 5 full years back
  const threeYearsAgo = (lastCompleteYear - 3).toString(); // 3 full years back
  const lastCompleteYearStr = lastCompleteYear.toString();

  if (dividendsByYear[fiveYearsAgo] && dividendsByYear[lastCompleteYearStr]) {
    const startDividend = dividendsByYear[fiveYearsAgo];
    const endDividend = dividendsByYear[lastCompleteYearStr];

    if (startDividend > 0 && endDividend > 0) {
      cagrYears = 5;
      dividendCAGR = (Math.pow(endDividend / startDividend, 1 / 5) - 1) * 100;
    }
  }

  // Fall back to 3-year CAGR if 5-year isn't available
  if (dividendCAGR === null) {
    if (
      dividendsByYear[threeYearsAgo] &&
      dividendsByYear[lastCompleteYearStr]
    ) {
      const startDividend = dividendsByYear[threeYearsAgo];
      const endDividend = dividendsByYear[lastCompleteYearStr];

      if (startDividend > 0 && endDividend > 0) {
        cagrYears = 3;
        dividendCAGR = (Math.pow(endDividend / startDividend, 1 / 3) - 1) * 100;
      }
    }
  }

  if (dividendCAGR === null) {
    return {
      chowderScore: null,
      dividendYield,
      dividendCAGR: null,
      yearsOfData,
      isValid: false,
      message: "Unable to calculate dividend CAGR",
    };
  }

  const chowderScore = dividendYield + dividendCAGR;

  return {
    chowderScore,
    dividendYield,
    dividendCAGR,
    yearsOfData,
    isValid: true,
    message: `Chowder Rule calculated using ${cagrYears}-year dividend CAGR (${cagrYears === 5 ? fiveYearsAgo : threeYearsAgo}-${lastCompleteYearStr})`,
  };
};

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
