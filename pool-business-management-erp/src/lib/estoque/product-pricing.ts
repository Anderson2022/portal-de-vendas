export function productPricing(cost: number, price: number) {
  const profit = price - cost;
  return { profit, margin: price > 0 ? profit / price * 100 : 0, markup: cost > 0 ? profit / cost * 100 : 0 };
}
