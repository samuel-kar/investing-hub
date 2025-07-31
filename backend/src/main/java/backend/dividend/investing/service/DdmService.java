package backend.dividend.investing.service;

import backend.dividend.investing.dto.DdmAnalysisRequestDto;
import backend.dividend.investing.dto.DdmAnalysisResponseDto;
import backend.dividend.investing.model.DdmAnalysis;
import backend.dividend.investing.repository.DdmRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DdmService {

    private final DdmRepository ddmRepository;

    public DdmService(DdmRepository ddmRepository) {
        this.ddmRepository = ddmRepository;
    }

    public List<DdmAnalysisResponseDto> getAllByUserIdAsDto(String userId) {
        return ddmRepository
                .findByUserId(userId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public DdmAnalysisResponseDto updateAnalysis(Long id, DdmAnalysisRequestDto dto) {
        DdmAnalysis existing = ddmRepository.findById(id).orElseThrow(() -> new RuntimeException("Analysis not found"));

        String currentUserId = getCurrentUserId();
        if (!existing.getUserId().equals(currentUserId)) {
            throw new SecurityException("You are not authorized to update this analysis.");
        }

        existing.setSymbol(dto.getSymbol());
        existing.setExpectedDividend(dto.getExpectedDividend());
        existing.setGrowthRate(dto.getGrowthRate());
        existing.setDiscountRate(dto.getDiscountRate());
        existing.setTotalDividend(dto.getTotalDividend());
        existing.setCurrentPrice(dto.getCurrentPrice());
        existing.setIntrinsicValue(dto.getIntrinsicValue());
        existing.setUndervalued(dto.isUndervalued());

        DdmAnalysis updated = ddmRepository.save(existing);
        return toResponseDto(updated);
    }

    public DdmAnalysisResponseDto saveAnalysis(DdmAnalysisRequestDto dto) {
        DdmAnalysis analysis = new DdmAnalysis();

        analysis.setUserId(getCurrentUserId()); // <-- auth user
        analysis.setSymbol(dto.getSymbol());
        analysis.setExpectedDividend(dto.getExpectedDividend());
        analysis.setGrowthRate(dto.getGrowthRate());
        analysis.setDiscountRate(dto.getDiscountRate());
        analysis.setTotalDividend(dto.getTotalDividend());
        analysis.setCurrentPrice(dto.getCurrentPrice());
        analysis.setIntrinsicValue(dto.getIntrinsicValue());
        analysis.setUndervalued(dto.isUndervalued());
        analysis.setCreatedAt(LocalDateTime.now());

        DdmAnalysis saved = ddmRepository.save(analysis);
        return toResponseDto(saved);
    }

    public List<DdmAnalysis> getAnalysesByUserId(String userId) {
        return ddmRepository.findByUserId(userId);
    }

    public void deleteById(Long id) {
        DdmAnalysis existing = ddmRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!existing.getUserId().equals(getCurrentUserId())) {
            throw new SecurityException("You are not authorized to delete this analysis.");
        }
        ddmRepository.deleteById(id);
    }

    private DdmAnalysisResponseDto toResponseDto(DdmAnalysis analysis) {
        DdmAnalysisResponseDto dto = new DdmAnalysisResponseDto();
        dto.setId(analysis.getId());
        dto.setSymbol(analysis.getSymbol());
        dto.setExpectedDividend(analysis.getExpectedDividend());
        dto.setGrowthRate(analysis.getGrowthRate());
        dto.setDiscountRate(analysis.getDiscountRate());
        dto.setTotalDividend(analysis.getTotalDividend());
        dto.setCurrentPrice(analysis.getCurrentPrice());
        dto.setIntrinsicValue(analysis.getIntrinsicValue());
        dto.setUndervalued(analysis.isUndervalued());
        dto.setCreatedAt(analysis.getCreatedAt());
        return dto;
    }

    private String getCurrentUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
