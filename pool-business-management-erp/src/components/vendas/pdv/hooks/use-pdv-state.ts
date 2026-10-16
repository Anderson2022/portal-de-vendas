"use client";
import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Section } from "../types/section";
import type { Item } from "../types/item";
import type { Order } from "../types/order";
import { initialOrders } from "../constants/initial-orders";
import { modes } from "../constants/modes";
import { usePdvPaymentState } from "./use-pdv-payment-state";
export function usePdvState() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<Section>(() => {
    const mode = searchParams.get("modo");
    return modes.find(({ id }) => id === mode)?.id ?? "home";
  });
  const [cart, setCart] = useState<Record<string, Item[]>>({
    lancamento: [
      { id: "coca", qty: 2 },
      { id: "pao", qty: 6 },
      { id: "leite", qty: 1 },
    ],
    cartao: [
      { id: "coca", qty: 2 },
      { id: "pao", qty: 6 },
      { id: "leite", qty: 1 },
    ],
    supermercado: [
      { id: "coca", qty: 2 },
      { id: "pao", qty: 6 },
      { id: "leite", qty: 1 },
    ],
    delivery: [
      { id: "pizza-calabresa", qty: 1 },
      { id: "batata", qty: 1 },
      { id: "coca-food", qty: 1 },
    ],
    servicos: [
      { id: "corte-masculino", qty: 1 },
      { id: "limpeza-pele", qty: 1 },
    ],
    mesas: [],
  });
  const [modal, setModal] = useState<
    | "payment"
    | "shortcuts"
    | "customer"
    | "discount"
    | "booking"
    | "settings"
    | null
  >(null);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [scan, setScan] = useState("");
  const [client, setClient] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [newClients, setNewClients] = useState<string[]>([]);
  const [deliveryTab, setDeliveryTab] = useState<"products" | "orders">(
    "products",
  );
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(1028);
  const [orderFilter, setOrderFilter] = useState("Todos");
  const [deliverType, setDeliverType] = useState<
    "Entrega" | "Retirada no balcão"
  >("Entrega");
  const [table, setTable] = useState(2);
  const [tableCarts, setTableCarts] = useState<Record<number, Item[]>>({
    2: [
      { id: "xbacon", qty: 1 },
      { id: "batata", qty: 1 },
      { id: "coca-food", qty: 1 },
    ],
    4: [{ id: "pizza-calabresa", qty: 1 }],
    6: [{ id: "xsalada", qty: 2 }],
  });
  const [selectedStaff, setSelectedStaff] = useState("Todos");
  const [toast, setToast] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [shopOpen, setShopOpen] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    bairro: "",
    reference: "",
  });
  const [dataFilter, setDataFilter] = useState("Hoje");
  const scannerRef = useRef<HTMLInputElement>(null);
  return {
    page,
    setPage,
    cart,
    setCart,
    modal,
    setModal,
    category,
    setCategory,
    search,
    setSearch,
    scan,
    setScan,
    client,
    setClient,
    clientInput,
    setClientInput,
    newClients,
    setNewClients,
    deliveryTab,
    setDeliveryTab,
    orders,
    setOrders,
    selectedOrder,
    setSelectedOrder,
    orderFilter,
    setOrderFilter,
    deliverType,
    setDeliverType,
    table,
    setTable,
    tableCarts,
    setTableCarts,
    selectedStaff,
    setSelectedStaff,
    toast,
    setToast,
    sidebar,
    setSidebar,
    shopOpen,
    setShopOpen,
    userMenu,
    setUserMenu,
    address,
    setAddress,
    dataFilter,
    setDataFilter,
    scannerRef,
    ...usePdvPaymentState(),
  };
}
