import { Boxes } from "lucide-react";
import { NumberField } from "../fields/number-field";
import { ProductSection } from "../product-section";
import { StockAddressFields } from "./stock-address-fields";
import { ProductStockPositions } from "./product-stock-positions";
import { CurrentStockFields } from "./current-stock-fields";

export function StockSection({productId}:{productId?:string}){return <><ProductSection icon={<Boxes size={17}/>} title="Estoque" description={productId?"Saldo atual e regras de reposição.":"Saldo inicial e regras de reposição."}><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StockAddressFields/>{productId?<CurrentStockFields productId={productId}/>:<NumberField label="Estoque inicial" name="initialStock"/>}<NumberField label="Estoque mínimo" name="minimumStock"/><NumberField label="Estoque máximo" name="maximumStock"/><NumberField label="Ponto de reposição" name="reorderPoint"/></div></ProductSection><ProductStockPositions productId={productId}/></>}
