import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import useProductStore from '../stores/useProductStore';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Loader';

const CATEGORIES = ['all', 'cakes', 'brownies', 'pastries', 'cupcakes', 'cookies', 'breads', 'beverages'];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, fetchProducts, page, pages, total } = useProductStore();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(() => ({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    isVeg: searchParams.get('isVeg') || '',
    isEggless: searchParams.get('isEggless') || '',
    page: searchParams.get('page') || '1',
  }), [searchParams]);

  useEffect(() => {
    const params = { ...filters, limit: 12 };
    if (params.category === 'all' || !params.category) delete params.category;
    if (!params.search) delete params.search;
    if (!params.isVeg) delete params.isVeg;
    if (!params.isEggless) delete params.isEggless;
    fetchProducts(params);
  }, [filters]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') { newParams.set(key, value); } else { newParams.delete(key); }
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-heading !text-left">
            {filters.category && filters.category !== 'all' ? <span className="capitalize">{filters.category}</span> : 'All Products'}
          </h1>
          {filters.search && <p className="text-mocha mt-2">Showing results for &quot;{filters.search}&quot;</p>}
          <p className="text-sm text-mocha mt-1">{total} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-accent-600 mb-2 block">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-mocha" size={16} />
                  <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search..." className="input-field !pl-10 text-sm" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-semibold text-accent-600 mb-3 block">Category</label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => updateFilter('category', cat)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${(filters.category || 'all') === cat ? 'bg-primary-100 text-primary-600 font-medium' : 'text-mocha hover:bg-primary-50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <label className="text-sm font-semibold text-accent-600 mb-3 block">Dietary</label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={filters.isVeg === 'true'} onChange={(e) => updateFilter('isVeg', e.target.checked ? 'true' : '')} className="rounded border-primary-200 text-primary-400 focus:ring-primary-300" />
                  <span className="text-sm text-accent-600">Vegetarian Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.isEggless === 'true'} onChange={(e) => updateFilter('isEggless', e.target.checked ? 'true' : '')} className="rounded border-primary-200 text-primary-400 focus:ring-primary-300" />
                  <span className="text-sm text-accent-600">Eggless Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort & Mobile Filter */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-primary-200 rounded-xl text-sm text-accent-600 hover:bg-primary-50">
                <FiFilter size={16} /> Filters
              </button>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field !w-auto text-sm !py-2">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">{Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="font-display text-xl font-semibold text-accent-600 mb-2">No products found</h3>
                <p className="text-mocha">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </motion.div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => updateFilter('page', String(p))} className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${Number(filters.page) === p ? 'bg-primary-400 text-white' : 'bg-white text-accent-600 hover:bg-primary-50 border border-primary-100'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {filtersOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-50 lg:hidden" onClick={() => setFiltersOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[80vh] overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}><FiX size={20} /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => { updateFilter('category', cat); setFiltersOpen(false); }} className={`px-4 py-2 rounded-full text-sm capitalize ${(filters.category || 'all') === cat ? 'bg-primary-400 text-white' : 'bg-primary-50 text-accent-600'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={filters.isVeg === 'true'} onChange={(e) => updateFilter('isVeg', e.target.checked ? 'true' : '')} className="rounded" /><span className="text-sm">Vegetarian</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={filters.isEggless === 'true'} onChange={(e) => updateFilter('isEggless', e.target.checked ? 'true' : '')} className="rounded" /><span className="text-sm">Eggless</span></label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
