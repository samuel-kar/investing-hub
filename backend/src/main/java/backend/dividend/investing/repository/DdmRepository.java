package backend.dividend.investing.repository;

import backend.dividend.investing.model.DdmAnalysis;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DdmRepository extends CrudRepository<DdmAnalysis, Long>{

    List<DdmAnalysis> findByUserId(String userId);
}
