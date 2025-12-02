// src/hooks/useProcessFilters.ts
import { useEffect, useState } from 'react';
import { Filter } from '../components/FilterBuilder';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/localStorageUtils';

const STORAGE_KEY = 'processListFilters';

type QuickFilters = {
  correlationId: string;
  requesterEmail: string;
  customerName: string;
};

const defaultQuickFilters: QuickFilters = {
  correlationId: '',
  requesterEmail: '',
  customerName: ''
};

type StoredFilters = {
  quickFilters: QuickFilters;
  appliedFilters: Filter[];
};

export function useProcessFilters() {
  const [quickFilters, setQuickFilters] = useState<QuickFilters>(defaultQuickFilters);
  const [advancedFilters, setAdvancedFilters] = useState<Filter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

  // Load initial state from localStorage (if any)
  useEffect(() => {
    const stored = safeGetItem<StoredFilters>(STORAGE_KEY);
    if (!stored) {
      return;
    }

    const loadedQuick: QuickFilters = {
      ...defaultQuickFilters,
      ...(stored.quickFilters ?? {})
    };

    const loadedApplied = stored.appliedFilters ?? [];

    setQuickFilters(loadedQuick);
    setAppliedFilters(loadedApplied);
    // When we come back to the page, the builder should show what is applied
    setAdvancedFilters(loadedApplied);
  }, []);

  // Persist active filters whenever quick/applied change
  useEffect(() => {
    const hasAny =
      quickFilters.correlationId ||
      quickFilters.requesterEmail ||
      quickFilters.customerName ||
      appliedFilters.length > 0;

    if (!hasAny) {
      // If everything is cleared, remove from storage
      safeRemoveItem(STORAGE_KEY);
      return;
    }

    const toStore: StoredFilters = {
      quickFilters,
      appliedFilters
    };

    safeSetItem(STORAGE_KEY, toStore);
  }, [quickFilters, appliedFilters]);

  const applyAdvancedFilters = () => {
    setAppliedFilters(advancedFilters);
    // localStorage will be updated by the effect above
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters([]);
    setAppliedFilters([]);
    // effect will clear from storage if no quick filters
  };

  const clearAllFilters = () => {
    setQuickFilters(defaultQuickFilters);
    setAdvancedFilters([]);
    setAppliedFilters([]);
    safeRemoveItem(STORAGE_KEY);
  };

  const hasAnyFilters =
    quickFilters.correlationId ||
    quickFilters.requesterEmail ||
    quickFilters.customerName ||
    appliedFilters.length > 0;

  return {
    quickFilters,
    setQuickFilters,
    advancedFilters,
    setAdvancedFilters,
    appliedFilters,
    setAppliedFilters,
    applyAdvancedFilters,
    clearAdvancedFilters,
    clearAllFilters,
    hasAnyFilters
  };
}
