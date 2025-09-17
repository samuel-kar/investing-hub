import { useState } from "react";
import { monthlyCompoundInterestCalculator } from "../utils/api";

export const CompoundInterestCalculator = () => {
  const [startValue, setStartValue] = useState<number>(10000);
  const [annualRate, setAnnualRate] = useState<number>(7);
  const [years, setYears] = useState<number>(10);
  const [monthlyInput, setMonthlyInput] = useState<number>(500);

  const finalValue = monthlyCompoundInterestCalculator(
    startValue,
    annualRate,
    years,
    monthlyInput
  );

  const totalContributions = startValue + monthlyInput * years * 12;
  const totalGains = finalValue - totalContributions;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Monthly Compound Interest Calculator
        </h2>
        <p className="text-gray-600 mb-6">
          Calculate how your investment will grow over time with compound
          interest and regular monthly contributions.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Investment Parameters
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Investment ($)
              </label>
              <input
                type="number"
                value={startValue}
                onChange={(e) => setStartValue(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Period (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="50"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                value={monthlyInput}
                onChange={(e) => setMonthlyInput(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="50"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Investment Results
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Initial Investment:</span>
                  <span className="font-semibold text-gray-800">
                    ${startValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Contributions:</span>
                  <span className="font-semibold text-gray-800">
                    ${(monthlyInput * years * 12).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Invested:</span>
                  <span className="font-semibold text-gray-800">
                    ${totalContributions.toLocaleString()}
                  </span>
                </div>

                <hr className="border-gray-300" />

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Investment Gains:</span>
                  <span className="font-semibold text-green-600">
                    ${totalGains.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-800 font-semibold">
                    Final Value:
                  </span>
                  <span className="font-bold text-blue-600">
                    ${finalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Key Insights:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Your money will grow{" "}
                  {((finalValue / totalContributions - 1) * 100).toFixed(1)}%
                  over {years} years
                </li>
                <li>• Monthly compounding accelerates growth</li>
                <li>• Regular contributions significantly boost returns</li>
                <li>• Time in the market is crucial for compound growth</li>
              </ul>
            </div>

            {/* Formula Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">
                Formula Used:
              </h4>
              <p className="text-xs text-gray-600">
                FV = PV × (1 + r)^n + PMT × ((1 + r)^n - 1) / r
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Where: FV = Future Value, PV = Present Value, r = Monthly Rate,
                n = Number of Months, PMT = Monthly Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
