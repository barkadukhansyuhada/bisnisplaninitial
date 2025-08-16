import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { X, Keyboard } from 'lucide-react';

interface ShortcutHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutHelpModal({ isOpen, onClose }: ShortcutHelpModalProps) {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { key: 'Ctrl+S', mac: '⌘+S', description: 'Save changes' },
        { key: 'Ctrl+F', mac: '⌘+F', description: 'Focus search box' },
        { key: 'Ctrl+E', mac: '⌘+E', description: 'Toggle Card/Table view' },
        { key: 'Escape', description: 'Clear search / Cancel selection' },
        { key: '?', description: 'Show this help' },
      ]
    },
    {
      category: 'Bulk Operations',
      items: [
        { key: 'Ctrl+A', mac: '⌘+A', description: 'Select all items' },
        { key: 'Space', description: 'Toggle item selection' },
        { key: 'Enter', description: 'Apply bulk action' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { key: 'Tab', description: 'Navigate between fields' },
        { key: 'Enter', description: 'Save current field' },
        { key: '1-9', description: 'Switch to domain (1=Geology, 2=QC, etc.)' },
        { key: '0', description: 'Show all domains' },
      ]
    }
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[80vh] overflow-auto"
          >
            <Card className="rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-neutral-800">Keyboard Shortcuts</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  {shortcuts.map((category) => (
                    <div key={category.category}>
                      <h3 className="font-semibold text-lg text-neutral-700 mb-3">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((shortcut, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-50 border border-neutral-200">
                            <span className="text-neutral-700 flex-1">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center gap-2">
                              {shortcut.mac && isMac ? (
                                <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono shadow-sm">
                                  {shortcut.mac}
                                </kbd>
                              ) : (
                                <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono shadow-sm">
                                  {shortcut.key}
                                </kbd>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 text-center">
                    Press <kbd className="px-1 py-0.5 bg-neutral-200 rounded text-xs font-mono">Escape</kbd> or click outside to close this dialog
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}