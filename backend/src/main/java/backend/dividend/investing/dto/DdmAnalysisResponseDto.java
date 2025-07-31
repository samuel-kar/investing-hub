package backend.dividend.investing.dto;

import java.time.LocalDateTime;

public class DdmAnalysisResponseDto {

    private Long id;
    private String symbol;
    private double expectedDividend;
    private double growthRate;
    private double discountRate;
    private double totalDividend;
    private double currentPrice;
    private double intrinsicValue;
    private boolean isUndervalued;
    private LocalDateTime createdAt;

    public DdmAnalysisResponseDto() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
