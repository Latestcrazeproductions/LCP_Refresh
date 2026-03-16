'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

export type Contact = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
};

type ContactSelectProps = {
  value: { name: string; email: string };
  onChange: (contact: { name: string; email: string }) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ContactSelect({
  value,
  onChange,
  placeholder = 'Type to search contacts...',
  disabled = false,
}: ContactSelectProps) {
  const [query, setQuery] = useState(value.name || '');
  const [results, setResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchContacts = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/forms/contacts?q=${encodeURIComponent(q.trim())}`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.contacts)) {
        setResults(data.contacts);
        setHighlightedIndex(0);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchContacts(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchContacts]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    setQuery(value.name || '');
  }, [value.name]);

  function handleSelect(contact: Contact) {
    onChange({ name: contact.name, email: contact.email });
    setQuery(contact.name);
    setResults([]);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open && e.key !== 'Escape') {
      if (query.length >= 2) setOpen(true);
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter' && results[highlightedIndex]) {
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          required
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) {
              onChange({ name: '', email: '' });
            }
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>
      {open && (results.length > 0 || loading) && (
        <ul
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl"
          role="listbox"
        >
          {results.map((contact, i) => (
            <li
              key={contact.id}
              role="option"
              aria-selected={i === highlightedIndex}
              onClick={() => handleSelect(contact)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                i === highlightedIndex ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-gray-400">{contact.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
