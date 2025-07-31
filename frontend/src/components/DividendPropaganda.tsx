export default function DividendInvestingInfo() {
  return (
    <main className="max-w-prose mx-auto px-4 py-6 text-base leading-relaxed">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Dividend Guide</h1>

      <p>
        Dividend investing is a strategy focused on building a portfolio of
        stocks that pay regular cash dividends – typically quarterly. It
        combines stability, consistent income, and the power of compounding.
      </p>

      <h2 className="text-lg font-medium mt-6">
        Stable Businesses and Cash Flow Now
      </h2>
      <p>
        Dividend-paying companies are often large and mature, with reliable cash
        flow. That means you’re getting paid now – not just hoping for future
        growth.
      </p>

      <h2 className="text-lg font-medium mt-6">Compounding and Reinvestment</h2>
      <p>
        Reinvested dividends buy more shares, which generate more dividends.
        Over time, this creates exponential growth through the compounding
        effect.
      </p>

      <h2 className="text-lg font-medium mt-6">
        Why Dividends Matter in Flat or Falling Markets
      </h2>
      <p>
        Even if stock prices aren’t rising, dividends still provide real return
        and stability. They help reduce emotional stress during downturns.
      </p>

      <h2 className="text-lg font-medium mt-6">Watch Out for Dividend Traps</h2>
      <p>
        A high dividend yield might signal danger – such as a falling stock or
        unsustainable payout. Always look beyond the yield.
      </p>

      <h2 className="text-lg font-medium mt-6">
        Growth vs. Yield – Finding a Balance
      </h2>
      <p>
        Some companies offer high growth with low yield. Others offer high yield
        but limited growth. Your goals and time horizon determine what fits
        best.
      </p>

      <h2 className="text-lg font-medium mt-6">
        Understanding the Dividend Discount Model (DDM)
      </h2>
      <p>
        DDM estimates a stock’s fair value based on expected dividends. The
        basic formula is:
      </p>

      <div className="bg-gray-100 border rounded p-3 text-center font-mono text-sm my-3">
        Value = D × (1 + g) / (r − g)
      </div>

      <p>
        <strong>Where:</strong>
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>D</strong> = Dividend expected next year
        </li>
        <li>
          <strong>g</strong> = Growth rate of dividends
        </li>
        <li>
          <strong>r</strong> = Required rate of return
        </li>
      </ul>

      <p>
        If the calculated value is higher than the current price, the stock may
        be undervalued. If lower, it may be overpriced.
      </p>

      <p className="mt-4">
        <strong>Example:</strong> A stock with a $2 dividend, 5% growth, and 8%
        required return:
      </p>

      <div className="bg-gray-50 border rounded p-3 font-mono text-sm my-2">
        Value = 2 × (1 + 0.05) / (0.08 − 0.05) = 2.1 / 0.03 = $70
      </div>

      <p>
        If the stock trades at $60, it may be undervalued. If it's at $90, it
        could be overpriced.
      </p>
    </main>
  );
}
