package br.com.poolcontrol.dashboard.service;

import br.com.poolcontrol.commission.repository.CommissionRepository;
import br.com.poolcontrol.dashboard.dto.DashboardSummary;
import br.com.poolcontrol.dashboard.entity.SalespersonRanking;
import br.com.poolcontrol.financial.entity.FinancialStatus;
import br.com.poolcontrol.financial.repository.AccountPayableRepository;
import br.com.poolcontrol.financial.repository.AccountReceivableRepository;
import br.com.poolcontrol.inventory.service.InventoryService;
import br.com.poolcontrol.sales.entity.QuoteStatus;
import br.com.poolcontrol.sales.entity.SaleStatus;
import br.com.poolcontrol.sales.repository.QuoteRepository;
import br.com.poolcontrol.sales.repository.SaleRepository;
import br.com.poolcontrol.salesperson.repository.SalespersonRepository;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

        private final SaleRepository saleRepository;
        private final QuoteRepository quoteRepository;
        private final AccountReceivableRepository receivableRepository;
        private final AccountPayableRepository payableRepository;
        private final SalespersonRepository salespersonRepository;
        private final InventoryService inventoryService;
        private final CurrentUserService currentUser;

        @Transactional(readOnly = true)
        public DashboardSummary summary() {
                Long companyId = currentUser.companyId();

                var stock = inventoryService.listSummaries();
                long critical = stock.stream().filter(item -> "CRITICAL".equals(item.status())).count();
                long low = stock.stream().filter(item -> "LOW".equals(item.status())).count();

                long openQuotes = quoteRepository.findAllByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                                .filter(quote -> quote.getStatus() != QuoteStatus.APPROVED
                                                && quote.getStatus() != QuoteStatus.REJECTED
                                                && quote.getStatus() != QuoteStatus.EXPIRED)
                                .count();

                return new DashboardSummary(
                                saleRepository.sumSalesByStatus(companyId, SaleStatus.COMPLETED),
                                saleRepository.sumProfitByStatus(companyId, SaleStatus.COMPLETED),
                                saleRepository.averageMarginByStatus(companyId, SaleStatus.COMPLETED),
                                saleRepository.countByCompanyIdAndStatus(companyId, SaleStatus.COMPLETED),
                                receivableRepository.sumByStatus(companyId, FinancialStatus.PENDING),
                                payableRepository.sumByStatus(companyId, FinancialStatus.PENDING),
                                critical,
                                low,
                                openQuotes);
        }

        @Transactional(readOnly = true)
        public List<SalespersonRanking> ranking() {
                Long companyId = currentUser.companyId();
                var sellerNames = new HashMap<Long, String>();
                salespersonRepository.findAllByCompanyIdOrderByNameAsc(companyId)
                                .forEach(s -> sellerNames.put(s.getId(), s.getName()));

                record Acc(BigDecimal sales, BigDecimal profit, long quantity) {
                        Acc add(BigDecimal sale, BigDecimal gain) {
                                return new Acc(sales.add(sale), profit.add(gain), quantity + 1);
                        }
                }

                var grouped = new HashMap<Long, Acc>();

                saleRepository.findAllByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                                .filter(sale -> sale.getStatus() == SaleStatus.COMPLETED
                                                && sale.getSalespersonId() != null)
                                .forEach(sale -> grouped.compute(
                                                sale.getSalespersonId(),
                                                (id, acc) -> acc == null
                                                                ? new Acc(sale.getTotalSale(), sale.getProfit(), 1)
                                                                : acc.add(sale.getTotalSale(), sale.getProfit())));

                List<SalespersonRanking> ranking = new ArrayList<>();
                grouped.forEach((sellerId, acc) -> ranking.add(new SalespersonRanking(
                                sellerId,
                                sellerNames.getOrDefault(sellerId, "Vendedor"),
                                acc.sales(),
                                acc.profit(),
                                acc.quantity())));

                ranking.sort((a, b) -> b.sales().compareTo(a.sales()));
                return ranking;
        }
}
