package backend.dividend.investing.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ddm_analysis")
public class DdmAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String symbol;

    private double expectedDividend;
    private double growthRate;
    private double discountRate;

    private double totalDividend;
    private double currentPrice;
    private double intrinsicValue;

    private boolean isUndervalued;

    private LocalDateTime createdAt;

    public DdmAnalysis() {
    }

    public DdmAnalysis(Long id, String userId, String symbol,
                       double expectedDividend, double growthRate, double discountRate,
                       double totalDividend, double currentPrice, double intrinsicValue,
                       boolean isUndervalued, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.symbol = symbol;
        this.expectedDividend = expectedDividend;
        this.growthRate = growthRate;
        this.discountRate = discountRate;
        this.totalDividend = totalDividend;
        this.currentPrice = currentPrice;
        this.intrinsicValue = intrinsicValue;
        this.isUndervalued = isUndervalued;
        this.createdAt = createdAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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
