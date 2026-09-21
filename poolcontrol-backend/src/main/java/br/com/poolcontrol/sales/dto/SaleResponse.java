package br.com.poolcontrol.sales.dto;



import br.com.poolcontrol.sales.entity.Sale;
import br.com.poolcontrol.sales.entity.SaleCost;
import br.com.poolcontrol.sales.entity.SaleItem;
import br.com.poolcontrol.sales.entity.SalePayment;

import java.util.List;

public record SaleResponse(
        Sale sale,
        List<SaleItem> items,
        List<SaleCost> costs,
        List<SalePayment> payments
) {
}
