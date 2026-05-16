import { Search } from 'lucide-react';
import { MAX_SEARCH_SUGGESTIONS, type AddressSuggestion } from './checkout-map-types';

type CheckoutMapSearchProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  isLoadingSuggestions: boolean;
  suggestions: AddressSuggestion[];
  onSelectSuggestion: (suggestion: AddressSuggestion) => void;
};

export function CheckoutMapSearch({
  searchQuery,
  onSearchQueryChange,
  isLoadingSuggestions,
  suggestions,
  onSelectSuggestion,
}: CheckoutMapSearchProps) {
  return (
    <div className="relative rounded-[20px] border border-[rgb(var(--border)/0.68)] bg-[rgb(var(--card-surface-muted)/0.72)] px-4 py-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-[rgb(var(--muted))]" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Enter an address"
          className="w-full bg-transparent text-sm font-medium text-[rgb(var(--ink))] outline-none placeholder:text-[rgb(var(--muted))]"
        />
      </div>

      {(isLoadingSuggestions || suggestions.length > 0) && (
        <div className="absolute left-2 right-2 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[16px] border border-[rgb(var(--border)/0.72)] bg-white shadow-[0_14px_36px_rgba(15,23,42,0.15)]">
          {isLoadingSuggestions ? (
            <p className="px-3 py-2.5 text-xs font-medium text-[rgb(var(--muted))]">
              Searching addresses...
            </p>
          ) : (
            suggestions.slice(0, MAX_SEARCH_SUGGESTIONS).map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onSelectSuggestion(suggestion)}
                className="block w-full border-b border-[rgb(var(--border)/0.5)] px-3 py-2.5 text-left last:border-b-0 hover:bg-[rgb(var(--card-surface-muted)/0.65)]"
              >
                <p className="line-clamp-1 text-sm font-semibold text-[rgb(var(--ink))]">
                  {suggestion.title}
                </p>
                {suggestion.subtitle ? (
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-[rgb(var(--muted))]">
                    {suggestion.subtitle}
                  </p>
                ) : null}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
