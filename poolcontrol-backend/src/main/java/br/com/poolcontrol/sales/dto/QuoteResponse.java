package br.com.poolcontrol.sales.dto;



import br.com.poolcontrol.sales.entity.Quote;
import br.com.poolcontrol.sales.entity.QuoteItem;

import java.util.List;

public record QuoteResponse(
        Quote quote,
        List<QuoteItem> items
) {
}
