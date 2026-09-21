package br.com.poolcontrol.sales.repository;



import br.com.poolcontrol.sales.entity.QuoteItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuoteItemRepository extends JpaRepository<QuoteItem, Long> {
    List<QuoteItem> findAllByCompanyIdAndQuoteId(Long companyId, Long quoteId);
}
