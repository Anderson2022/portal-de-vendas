package br.com.poolcontrol.config;

import java.util.Set;

public final class PermissionCatalog {

    private PermissionCatalog() {}

    public static final Set<String> ALL = Set.of(
            "DASHBOARD_VIEW",
            "USER_VIEW", "USER_CREATE",
            "CUSTOMER_VIEW", "CUSTOMER_CREATE",
            "PRODUCT_VIEW", "PRODUCT_MANAGE",
            "SUPPLIER_VIEW", "SUPPLIER_MANAGE",
            "SALESPERSON_VIEW", "SALESPERSON_MANAGE",
            "SALE_VIEW", "SALE_CREATE", "SALE_COMPLETE",
            "STOCK_VIEW", "STOCK_MOVE",
            "FINANCIAL_VIEW", "FINANCIAL_CREATE",
            "COMMISSION_VIEW",
            "POOL_VIEW", "POOL_CREATE",
            "WORK_ORDER_VIEW", "WORK_ORDER_CREATE", "WORK_ORDER_EXECUTE",
            "AUDIT_VIEW"
    );

    public static final Set<String> MANAGER = ALL.stream()
            .filter(permission -> !permission.startsWith("USER_"))
            .collect(java.util.stream.Collectors.toUnmodifiableSet());

    public static final Set<String> SELLER = Set.of(
            "DASHBOARD_VIEW",
            "CUSTOMER_VIEW", "CUSTOMER_CREATE",
            "PRODUCT_VIEW",
            "SALE_VIEW", "SALE_CREATE", "SALE_COMPLETE",
            "COMMISSION_VIEW",
            "POOL_VIEW"
    );

    public static final Set<String> FINANCIAL = Set.of(
            "DASHBOARD_VIEW",
            "CUSTOMER_VIEW",
            "SALE_VIEW",
            "FINANCIAL_VIEW", "FINANCIAL_CREATE",
            "COMMISSION_VIEW"
    );

    public static final Set<String> STOCK = Set.of(
            "DASHBOARD_VIEW",
            "PRODUCT_VIEW", "PRODUCT_MANAGE",
            "SUPPLIER_VIEW", "SUPPLIER_MANAGE",
            "STOCK_VIEW", "STOCK_MOVE"
    );

    public static final Set<String> TECHNICIAN = Set.of(
            "CUSTOMER_VIEW",
            "PRODUCT_VIEW",
            "STOCK_VIEW",
            "POOL_VIEW",
            "WORK_ORDER_VIEW", "WORK_ORDER_EXECUTE"
    );
}
