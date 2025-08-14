import React, { useState, useEffect, useRef } from 'react';

const AdvancedSearch = ({ 
  data = [], 
  searchFields = [], 
  onResults, 
  placeholder = 'Search...', 
  showFilters = true,
  filters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('edutrack-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Perform search
  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = performSearch(searchTerm, data, searchFields, activeFilters);
      onResults && onResults(results);
      generateSuggestions(searchTerm);
    } else {
      onResults && onResults(data);
      setSuggestions([]);
    }
  }, [searchTerm, activeFilters, data]);

  const performSearch = (term, dataArray, fields, filters) => {
    return dataArray.filter(item => {
      // Text search
      const matchesSearch = fields.some(field => {
        const value = getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(term.toLowerCase());
      });

      // Filter search
      const matchesFilters = Object.entries(filters).every(([filterKey, filterValue]) => {
        if (!activeFilters[filterKey] || activeFilters[filterKey] === 'All') return true;
        return getNestedValue(item, filterKey) === activeFilters[filterKey];
      });

      return matchesSearch && matchesFilters;
    });
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const generateSuggestions = (term) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    const allValues = new Set();
    data.forEach(item => {
      searchFields.forEach(field => {
        const value = getNestedValue(item, field);
        if (value && value.toString().toLowerCase().includes(term.toLowerCase())) {
          allValues.add(value.toString());
        }
      });
    });

    setSuggestions(Array.from(allValues).slice(0, 5));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    
    // Add to recent searches
    if (term.length > 0) {
      const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('edutrack-recent-searches', JSON.stringify(newRecent));
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilters({});
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="advanced-search">
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-button" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>

        {showSuggestions && (searchTerm.length > 0 || recentSearches.length > 0) && (
          <div className="suggestions-dropdown">
            {suggestions.length > 0 && (
              <div className="suggestion-section">
                <div className="suggestion-header">Suggestions</div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSearch(suggestion)}
                  >
                    <span className="suggestion-icon">💡</span>
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            {recentSearches.length > 0 && searchTerm.length === 0 && (
              <div className="suggestion-section">
                <div className="suggestion-header">Recent Searches</div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSearch(search)}
                  >
                    <span className="suggestion-icon">🕒</span>
                    {search}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showFilters && Object.keys(filters).length > 0 && (
        <div className="filters-container">
          {Object.entries(filters).map(([filterKey, filterOptions]) => (
            <div key={filterKey} className="filter-group">
              <label className="filter-label">
                {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}:
              </label>
              <select
                value={activeFilters[filterKey] || 'All'}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                className="filter-select"
              >
                <option value="All">All</option>
                {filterOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
          
          {Object.keys(activeFilters).length > 0 && (
            <button className="clear-filters" onClick={() => setActiveFilters({})}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {searchTerm && (
        <div className="search-info">
          <span className="search-term">Searching for: "{searchTerm}"</span>
          {Object.keys(activeFilters).length > 0 && (
            <span className="active-filters">
              Filters: {Object.entries(activeFilters)
                .filter(([, value]) => value !== 'All')
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
            </span>
          )}
        </div>
      )}

      <style jsx>{`
        .advanced-search {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          padding: 12px 20px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .search-input-wrapper:focus-within {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
        }

        .search-icon {
          font-size: 18px;
          color: #666;
          margin-right: 12px;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #333;
          background: transparent;
        }

        .search-input::placeholder {
          color: #999;
        }

        .clear-button {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s ease;
          margin-left: 8px;
        }

        .clear-button:hover {
          background: #f0f0f0;
          color: #666;
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .suggestion-section {
          padding: 8px 0;
        }

        .suggestion-section:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }

        .suggestion-header {
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 14px;
        }

        .suggestion-item:hover {
          background: #f8f9fa;
        }

        .suggestion-icon {
          margin-right: 12px;
          opacity: 0.7;
        }

        .filters-container {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 15px;
          padding: 15px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }

        .filter-select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          min-width: 120px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .clear-filters {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .clear-filters:hover {
          background: #c82333;
        }

        .search-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
          padding: 8px 12px;
          background: #e6f3ff;
          border-radius: 8px;
          font-size: 13px;
          flex-wrap: wrap;
        }

        .search-term {
          color: #0066cc;
          font-weight: 500;
        }

        .active-filters {
          color: #666;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .search-input-wrapper {
            padding: 10px 16px;
          }

          .search-input {
            font-size: 14px;
          }

          .suggestions-dropdown {
            margin-top: 4px;
          }

          .filters-container {
            gap: 10px;
            padding: 12px 16px;
          }

          .filter-group {
            gap: 6px;
          }

          .filter-label {
            font-size: 13px;
          }

          .filter-select {
            font-size: 13px;
            min-width: 100px;
            padding: 4px 8px;
          }

          .search-info {
            gap: 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedSearch;
