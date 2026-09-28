import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { PackageX, AlertCircle } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
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

        const data = await getProducts(params);
        if (data.success) {
          setProducts(data.products);
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Discover Products
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl">
            Find everything you need, from everyday essentials to extraordinary finds.
          </p>
        </div>

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
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
             <p className="text-gray-500 font-medium animate-pulse">Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-16 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <PackageX className="w-10 h-10 text-gray-400" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found.</h3>
             <p className="text-gray-500 max-w-md mx-auto">
               We couldn't find any products matching your current filters. Try adjusting your search or category.
             </p>
             <button 
                onClick={() => {
                  setSearch('');
                  setCategory('All Categories');
                  setSort('');
                }}
                className="mt-8 px-6 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
              >
                Clear all filters
             </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
