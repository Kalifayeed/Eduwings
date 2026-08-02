"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Search box on the full results page.
 *
 * A real `<form>` with a GET-style submit: pressing Enter navigates to a URL
 * that renders on the server. That keeps results shareable and crawler-visible,
 * unlike a purely client-side filter.
 */
function SearchInput({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(initialQuery);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `${routes.search}?q=${encodeURIComponent(trimmed)}` : routes.search);
  };

  return (
    <form onSubmit={onSubmit} role="search" className="flex gap-3">
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <label htmlFor="site-search" className="sr-only">
          Search EduWings
        </label>
        <Input
          id="site-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Careers, subjects, counties, articles…"
          className="h-12 pl-12"
        />
      </div>
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}

export { SearchInput };
