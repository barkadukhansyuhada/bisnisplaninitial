import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
  onToggleView?: () => void;
  onSelectAll?: () => void;
  onHelp?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onSearch,
  onEscape,
  onToggleView,
  onSelectAll,
  onHelp,
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const isModifier = ctrlKey || metaKey;
    
    // Prevent shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';
    
    // Save shortcut: Ctrl+S / Cmd+S
    if (isModifier && key === 's' && onSave) {
      event.preventDefault();
      onSave();
      return;
    }
    
    // Search shortcut: Ctrl+F / Cmd+F
    if (isModifier && key === 'f' && onSearch) {
      event.preventDefault();
      onSearch();
      return;
    }
    
    // Toggle view: Ctrl+E / Cmd+E
    if (isModifier && key === 'e' && onToggleView) {
      event.preventDefault();
      onToggleView();
      return;
    }
    
    // Select all in bulk mode: Ctrl+A / Cmd+A
    if (isModifier && key === 'a' && onSelectAll && !isInputFocused) {
      event.preventDefault();
      onSelectAll();
      return;
    }
    
    // Help modal: ? or Ctrl+? / Cmd+?
    if ((key === '?' || (isModifier && key === '?')) && onHelp) {
      event.preventDefault();
      onHelp();
      return;
    }
    
    // Only process single key shortcuts when not in input
    if (isInputFocused) return;
    
    // Escape key
    if (key === 'Escape' && onEscape) {
      onEscape();
      return;
    }
    
  }, [onSave, onSearch, onEscape, onToggleView, onSelectAll, onHelp]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return helper functions for manual triggering
  return {
    triggerSave: onSave,
    triggerSearch: onSearch,
    triggerEscape: onEscape,
    triggerToggleView: onToggleView,
    triggerSelectAll: onSelectAll,
    triggerHelp: onHelp,
  };
}