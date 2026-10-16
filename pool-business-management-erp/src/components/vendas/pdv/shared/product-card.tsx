import Image from "next/image";
import type { Product } from "../types/product";
import { Clock3, ShoppingCart } from "lucide-react";
import { money } from "../utils/money";
export function ProductCard({
  product,
  onAdd,
  food,
  service,
}: {
  product: Product;
  onAdd: () => void;
  food?: boolean;
  service?: boolean;
}) {
  return (
    <div
      className={`product-card ${food ? "food-card" : ""} ${service ? "service-card" : ""}`}
    >
      <Image
        unoptimized
        loading="lazy"
        src={product.image}
        alt={product.name}
        width={160}
        height={160}
      />
      <div className="product-info">
        <strong>{product.name}</strong>
        {food && (
          <small className="product-description">{product.description}</small>
        )}
        {service && (
          <small className="duration">
            <Clock3 size={12} />
            {product.duration} min
          </small>
        )}
        <div className="product-price">
          <b>{money(product.price)}</b>
          {product.stock !== undefined && <span>{product.stock}</span>}
        </div>
        {(food || service) && (
          <button className="add-product" onClick={onAdd}>
            {food && <ShoppingCart size={14} />}Adicionar
          </button>
        )}
      </div>
      {!food && !service && (
        <button
          aria-label={`Adicionar ${product.name}`}
          className="invisible-add"
          onClick={onAdd}
        />
      )}
    </div>
  );
}
