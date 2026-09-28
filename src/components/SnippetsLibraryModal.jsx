import React, { useState } from 'react';
import { QUICK_FEEDBACK_SNIPPETS } from '../data/mockData';
import { sounds } from '../utils/soundEffects';

export default function SnippetsLibraryModal({ isOpen, onClose, onSelectSnippet }) {
  const [snippets, setSnippets] = useState(() => {
    try {
      const saved = localStorage.getItem('rethorical_custom_snippets');
      return saved ? JSON.parse(saved) : QUICK_FEEDBACK_SNIPPETS;
    } catch {
      return QUICK_FEEDBACK_SNIPPETS;
    }
  });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('Evidence & Citations');
  const [newText, setNewText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const categories = ['All', ...new Set(snippets.map(s => s.category))];

  const filtered = snippets.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.tag.toLowerCase().includes(search.toLowerCase()) ||
                          s.text.toLowerCase().includes(search.toLowerCase()) ||
                          (s.shortcut && s.shortcut.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopySnippet = (snippet) => {
    navigator.clipboard?.writeText(snippet.text);
    sounds.playPenScratch();
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onSelectSnippet) {
      onSelectSnippet(snippet);
    }
  };

  const handleCreateSnippet = (e) => {
    e.preventDefault();
    if (!newText.trim() || !newTag.trim()) return;

    const newSnippet = {
      id: `snip-${Date.now()}`,
      category: newCategory,
      tag: newTag.trim(),
      text: newText.trim(),
      shortcut: `@${newTag.trim().toLowerCase().replace(/\s+/g, '')}`
    };

    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    try {
      localStorage.setItem('rethorical_custom_snippets', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    sounds.playStampThud();
    setNewTag('');
    setNewText('');
    setShowAddForm(false);
  };

  const handleDeleteSnippet = (id, e) => {
    e.stopPropagation();
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    try {
      localStorage.setItem('rethorical_custom_snippets', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[24px]">bookmark_heart</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Quick-Feedback Snippets Library
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Standardize recurrent feedback notes and insert them with 1-click or hotkey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-space-md border-b border-surface-container flex flex-col sm:flex-row items-center gap-space-sm bg-surface-container-lowest">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search by tag, feedback content, or @shortcut..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none focus:bg-surface-container"
            />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            type="button"
            className="px-space-md py-2 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold hover:bg-secondary hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>{showAddForm ? 'Cancel' : 'New Snippet'}</span>
          </button>
        </div>

        {/* Add Snippet Inline Drawer */}
        {showAddForm && (
          <form onSubmit={handleCreateSnippet} className="p-space-md bg-surface-container-low border-b border-surface-container space-y-space-sm animate-fade-in">
            <div className="grid grid-cols-2 gap-space-sm">
              <input
                type="text"
                required
                placeholder="Snippet Tag (e.g. Floating Quotes)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none"
              >
                <option>Evidence &amp; Citations</option>
                <option>Grammar &amp; Mechanics</option>
                <option>Analytical Depth</option>
                <option>Organization &amp; Flow</option>
                <option>Praise &amp; Voice</option>
              </select>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Enter full pedagogical feedback text..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container font-body-sm text-body-sm text-on-surface focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded text-on-surface-variant font-label-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-1 rounded bg-primary-container text-on-primary font-label-sm font-semibold hover:bg-primary"
              >
                Save Snippet
              </button>
            </div>
          </form>
        )}

        {/* Category Pills */}
        <div className="px-space-md py-2 border-b border-surface-container flex items-center gap-1.5 overflow-x-auto bg-surface-container-low/40">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-label-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Snippet Cards List */}
        <div className="p-space-md space-y-space-sm overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant font-body-sm">
              No matching feedback snippets found. Create one above!
            </div>
          ) : (
            filtered.map((snip) => (
              <div
                key={snip.id}
                onClick={() => handleCopySnippet(snip)}
                className="p-space-md rounded-xl bg-surface-container-lowest border border-surface-container hover:border-primary/50 transition-all cursor-pointer group shadow-xs flex flex-col gap-1.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {snip.tag}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-code-inline font-bold bg-secondary-fixed text-on-secondary-fixed">
                      {snip.shortcut || `@${snip.tag.toLowerCase().replace(/\s+/g, '')}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                      {snip.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSnippet(snip.id, e)}
                      title="Delete snippet"
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-on-surface-variant hover:text-error transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  "{snip.text}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-surface-container/60 text-xs font-label-sm">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">touch_app</span>
                    Click to insert into manuscript note
                  </span>
                  <span className={`font-semibold ${copiedId === snip.id ? 'text-tertiary' : 'text-primary'}`}>
                    {copiedId === snip.id ? 'Copied & Inserted! ✓' : 'Insert ➔'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-between border-t border-surface-container text-xs font-label-sm text-on-surface-variant">
          <span>{filtered.length} snippets available</span>
          <button
            onClick={onClose}
            type="button"
            className="px-space-md py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md hover:bg-surface-container-high"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
