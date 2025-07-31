package backend.dividend.investing.dto;

public class DdmAnalysisRequestDto {

    private String userId;
    private String symbol;
    private double expectedDividend;
    private double growthRate;
    private double discountRate;
    private double totalDividend;
    private double currentPrice;
    private double intrinsicValue;
    private boolean isUndervalued;

    public DdmAnalysisRequestDto() {
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public double getExpectedDividend() {
        return expectedDividend;
    }

    public void setExpectedDividend(double expectedDividend) {
        this.expectedDividend = expectedDividend;
    }

    public double getGrowthRate() {
        return growthRate;
    }

    public void setGrowthRate(double growthRate) {
        this.growthRate = growthRate;
    }

    public double getDiscountRate() {
        return discountRate;
    }

    public void setDiscountRate(double discountRate) {
        this.discountRate = discountRate;
    }

    public double getTotalDividend() {
        return totalDividend;
    }

    public void setTotalDividend(double totalDividend) {
        this.totalDividend = totalDividend;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public double getIntrinsicValue() {
        return intrinsicValue;
    }

    public void setIntrinsicValue(double intrinsicValue) {
        this.intrinsicValue = intrinsicValue;
    }

    public boolean isUndervalued() {
        return isUndervalued;
    }

    public void setUndervalued(boolean undervalued) {
        isUndervalued = undervalued;
    }
}
