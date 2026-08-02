"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Loader2, Search as SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { SearchResult } from "@/lib/search/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Command-palette style search.
 *
 * Queries are debounced and every in-flight request is abortable, so fast typing
 * cannot produce out-of-order results — a subtle bug that is very visible to
 * users when it happens.
 */
function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const debouncedQuery = useDebouncedValue(query, 180);

  /**
   * Results are stored together with the query that produced them.
   *
   * That single pairing lets both `results` and `loading` be derived rather than
   * tracked: "loading" is precisely the state of not yet holding results for the
   * current query. Separate `results` and `loading` variables can disagree —
   * this cannot.
   */
  const [settled, setSettled] = React.useState<{ query: string; results: SearchResult[] }>({
    query: "",
    results: [],
  });

  const trimmed = debouncedQuery.trim();
  const isSearchable = trimmed.length >= 2;
  const isSettled = settled.query === trimmed;

  const results = isSearchable && isSettled ? settled.results : [];
  const loading = isSearchable && !isSettled;

  /**
   * Closing resets the dialog here rather than in an effect on `open`. The
   * parent owns the open state, so we intercept the change, wipe local state and
   * pass it on — keeping the reset in an event handler, where it belongs.
   */
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setSettled({ query: "", results: [] });
      setActiveIndex(0);
    }
    onOpenChange(next);
  };

  React.useEffect(() => {
    if (!isSearchable) return;

    // Every in-flight request is abortable, so fast typing cannot deliver an
    // earlier response after a later one and show results for a stale query.
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        setSettled({
          query: trimmed,
          results: payload?.ok ? (payload.data.results as SearchResult[]) : [],
        });
        setActiveIndex(0);
      })
      .catch((error: unknown) => {
        // An abort means a newer request is already in flight and will settle;
        // marking this query settled would flash an empty result set first.
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSettled({ query: trimmed, results: [] });
      });

    return () => controller.abort();
  }, [trimmed, isSearchable]);

  const goTo = (href: string) => {
    handleOpenChange(false);
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) goTo(target.href);
      else if (query.trim()) goTo(`${routes.search}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const showEmpty = !loading && isSearchable && results.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showClose={false} className="top-[12vh] max-w-2xl translate-y-0 gap-0 p-0">
        <DialogTitle className="sr-only">Search EduWings</DialogTitle>
        <DialogDescription className="sr-only">
          Search careers, articles, events, activities and pages.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b px-5">
          <SearchIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search careers, articles, events…"
            aria-label="Search EduWings"
            aria-controls="search-results"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
          />
          {loading ? (
            <Loader2 aria-hidden className="size-4 animate-spin text-muted-foreground" />
          ) : null}
        </div>

        <div id="search-results" className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
          {results.map((result, index) => (
            <Link
              key={result.id}
              href={result.href}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => handleOpenChange(false)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                index === activeIndex ? "bg-secondary" : "hover:bg-secondary/60",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {result.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {result.description}
                </span>
              </span>
              <Badge variant="muted" className="mt-0.5 shrink-0">
                {result.group}
              </Badge>
            </Link>
          ))}

          {showEmpty ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              No results for <span className="font-medium text-foreground">{trimmed}</span>. Try a
              career, a subject or a place.
            </p>
          ) : null}

          {!isSearchable ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              Start typing to search fourteen careers, the full programme, articles and events.
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 border-t px-5 py-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft aria-hidden className="size-3" />
            to open
          </span>
          {query.trim() ? (
            <Link
              href={`${routes.search}?q=${encodeURIComponent(query.trim())}`}
              onClick={() => handleOpenChange(false)}
              className="font-medium transition-colors hover:text-foreground"
            >
              See all results
            </Link>
          ) : (
            <span>
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Esc</kbd> to close
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SearchDialog };
