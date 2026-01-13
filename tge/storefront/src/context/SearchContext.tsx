"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SearchContextType {
    isOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
    toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close search on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock body scroll when search is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const openSearch = () => setIsOpen(true);
    const closeSearch = () => setIsOpen(false);
    const toggleSearch = () => setIsOpen((prev) => !prev);

    return (
        <SearchContext.Provider
            value={{
                isOpen,
                openSearch,
                closeSearch,
                toggleSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
