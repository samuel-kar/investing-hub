package backend.dividend.investing.controller;

import backend.dividend.investing.dto.DdmAnalysisRequestDto;
import backend.dividend.investing.dto.DdmAnalysisResponseDto;
import backend.dividend.investing.service.DdmService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ddm")
public class DdmController {

    private final DdmService ddmService;

    public DdmController(DdmService ddmService) {
        this.ddmService = ddmService;
    }

    @PostMapping
    public ResponseEntity<DdmAnalysisResponseDto> saveAnalysis(@RequestBody DdmAnalysisRequestDto requestDto) {
        DdmAnalysisResponseDto saved = ddmService.saveAnalysis(requestDto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<DdmAnalysisResponseDto>> getAnalysesByUser() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<DdmAnalysisResponseDto> analyses = ddmService.getAllByUserIdAsDto(userId);
        return ResponseEntity.ok(analyses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DdmAnalysisResponseDto> updateAnalysis(
            @PathVariable Long id,
            @RequestBody DdmAnalysisRequestDto requestDto) {
        DdmAnalysisResponseDto updated = ddmService.updateAnalysis(id, requestDto);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable Long id) {
        ddmService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
