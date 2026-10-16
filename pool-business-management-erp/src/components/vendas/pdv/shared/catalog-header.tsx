import { Chip } from "./chip";
import { Search } from "lucide-react";
export function CatalogHeader({
  categories,
  category,
  setCategory,
  search,
  setSearch,
  scannerRef,
}: {
  categories: string[];
  category: string;
  setCategory: (s: string) => void;
  search: string;
  setSearch: (s: string) => void;
  scannerRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="catalog-header">
      <div className="categories">
        {categories.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <div className="catalog-search">
        <Search size={17} />
        <input
          ref={scannerRef}
          placeholder="Buscar produto por nome ou código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <kbd>Ctrl + K</kbd>
      </div>
    </div>
  );
}
