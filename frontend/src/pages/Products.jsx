import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import api, { getProducts } from '../services/api';
import { PackageX, AlertCircle } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('');

  // Debounce for search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (category && category !== 'All Categories') params.category = category;
        if (sort) params.sort = sort;

        const [data, wishlistData] = await Promise.all([
          getProducts(params),
          api.get('/wishlist').then(res => res.data).catch(() => ({ success: false, wishlist: [] }))
        ]);

        if (data.success) {
          setProducts(data.products);
          if (wishlistData.success) {
            setWishlistIds(wishlistData.wishlist.map(w => typeof w === 'object' ? w._id : w));
          }
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, category, sort]);

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans relative">
      <Navbar />
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-cream to-transparent pointer-events-none -z-10"></div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20">

        <SearchBar 
          search={search} 
          setSearch={setSearch} 
          category={category} 
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        {/* State Handling */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mb-4"></div>
             <p className="text-brand-green/70 font-medium animate-pulse">Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600 text-sm mb-6">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white border border-[#e6e2d6] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6">
                <PackageX className="w-10 h-10 text-brand-green/40" />
             </div>
             <h3 className="text-3xl font-serif font-bold text-brand-green-dark mb-3">No products found</h3>
             <p className="text-brand-green/60 max-w-md mx-auto mb-8 text-[15px]">
               We couldn't find any products matching your current filters. Try adjusting your search or category.
             </p>
             <button 
                onClick={() => {
                  setSearch('');
                  setCategory('All Categories');
                  setSort('');
                }}
                className="px-8 py-3 bg-brand-green/10 text-brand-green font-semibold rounded-xl hover:bg-brand-green hover:text-white transition-all uppercase tracking-widest text-[11px]"
              >
                Clear all filters
             </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                initialIsSaved={wishlistIds.includes(product._id)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
