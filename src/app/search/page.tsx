'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { searchForVideos, setSelectedCategory, fetchVideos } from '@/store/slices/videoSlice';
import AppLayout from '@/components/AppLayout';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';
import { VideoGrid } from '@/components/VideoGrid';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES: Category[] = ['Mathematics', 'Science', 'History', 'Technology', 'Languages', 'Art', 'Business', 'Other'];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { searchResults, isSearching, selectedCategory } = useSelector((state: RootState) => state.video);

    useEffect(() => {
        if (query.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                dispatch(searchForVideos(query));
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [query, dispatch]);

    const handleCategorySelect = (category: Category | null) => {
        dispatch(setSelectedCategory(category));
        // Clear query when selecting a category to show category results
        if (category) {
            setQuery('');
            dispatch(fetchVideos({ refresh: true }));
        }
    };

    return (
        <AppLayout>
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Discover educational content..."
                            className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={24} />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-light rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategorySelect(null)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                                !selectedCategory
                                    ? "bg-primary border-primary text-white shadow-glow"
                                    : "bg-surface-light border-border text-text-secondary hover:border-text-tertiary"
                            )}
                        >
                            All
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategorySelect(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                                    selectedCategory === cat
                                        ? "bg-secondary border-secondary text-white shadow-glow-secondary"
                                        : "bg-surface-light border-border text-text-secondary hover:border-text-tertiary"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex items-center justify-between mb-6">
                    <Text variant="h3">
                        {query ? `Results for "${query}"` : "Trending Topics"}
                    </Text>
                    <button className="flex items-center gap-2 text-sm font-bold text-text-tertiary hover:text-white transition-colors">
                        <SlidersHorizontal size={18} /> Filters
                    </button>
                </div>

                {isSearching ? (
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[9/16] bg-surface-light animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
                        <div className="p-6 bg-surface-light rounded-full">
                            <SearchIcon size={48} />
                        </div>
                        <Text variant="caption">Start typing to explore the knowledge universe.</Text>
                    </div>
                ) : (
                    <VideoGrid videos={searchResults} />
                )}
            </div>
        </AppLayout>
    );
}
