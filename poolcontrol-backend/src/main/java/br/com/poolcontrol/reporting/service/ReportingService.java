package br.com.poolcontrol.reporting.service;



import br.com.poolcontrol.reporting.entity.ProfitabilityReport;
import br.com.poolcontrol.reporting.dto.SaleProfitabilityRow;
import br.com.poolcontrol.sales.entity.SaleStatus;
import br.com.poolcontrol.sales.repository.SaleRepository;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final SaleRepository saleRepository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public ProfitabilityReport profitability() {
        var sales = saleRepository.findAllByCompanyIdOrderByCreatedAtDesc(currentUser.companyId()).stream()
                .filter(sale -> sale.getStatus() == SaleStatus.COMPLETED)
                .map(sale -> new SaleProfitabilityRow(
                        sale.getId(),
                        sale.getCustomerId(),
                        sale.getSalespersonId(),
                        sale.getTotalSale(),
                        sale.getProductCost(),
                        sale.getAdditionalCost(),
                        sale.getCommissionAmount(),
                        sale.getTotalCost(),
                        sale.getProfit(),
                        sale.getMarginPercent(),
                        sale.getCompletedAt()
                ))
                .toList();

        var revenue = sales.stream().map(SaleProfitabilityRow::revenue).reduce(BigDecimal.ZERO, BigDecimal::add);
        var cost = sales.stream().map(SaleProfitabilityRow::totalCost).reduce(BigDecimal.ZERO, BigDecimal::add);
        var profit = sales.stream().map(SaleProfitabilityRow::profit).reduce(BigDecimal.ZERO, BigDecimal::add);
        var averageMargin = sales.isEmpty()
                ? BigDecimal.ZERO
                : sales.stream().map(SaleProfitabilityRow::marginPercent)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(sales.size()), 4, RoundingMode.HALF_UP);

        return new ProfitabilityReport(revenue, cost, profit, averageMargin, sales);
    }
}
