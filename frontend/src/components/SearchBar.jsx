import React from 'react';
import { Search, Filter, ArrowDownAZ } from 'lucide-react';

const SearchBar = ({ search, setSearch, category, setCategory, sort, setSort }) => {
  const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home', 'Furniture', 'Wearables', 'Home & Kitchen'];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#e6e2d6] mb-10">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-brand-green/40" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3.5 bg-brand-cream-light/50 border border-[#e6e2d6] rounded-xl text-brand-green-dark placeholder-brand-green/40 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all text-sm font-medium"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-52 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-brand-green/50" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-3.5 bg-brand-cream-light/50 border border-[#e6e2d6] rounded-xl text-brand-green-dark appearance-none focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all cursor-pointer text-[13px] font-bold tracking-wide uppercase"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-brand-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Sort Dropdown (Bonus) */}
        <div className="relative w-full sm:w-52 flex-shrink-0">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ArrowDownAZ className="h-4 w-4 text-brand-green/50" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-3.5 bg-brand-cream-light/50 border border-[#e6e2d6] rounded-xl text-brand-green-dark appearance-none focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all cursor-pointer text-[13px] font-bold tracking-wide uppercase"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-brand-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
