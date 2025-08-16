import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, X, Trash2, User, Star, CheckCircle } from 'lucide-react';
import { ItemStatus } from '@/lib/types';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkUpdateStatus: (status: ItemStatus) => void;
  onBulkUpdatePriority: (priority: "Low" | "Medium" | "High") => void;
  onBulkUpdateOwner: (owner: string) => void;
  onBulkDelete: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkUpdateStatus,
  onBulkUpdatePriority,
  onBulkUpdateOwner,
  onBulkDelete,
}: BulkActionsToolbarProps) {
  const [ownerInput, setOwnerInput] = React.useState('');

  const handleOwnerUpdate = () => {
    if (ownerInput.trim()) {
      onBulkUpdateOwner(ownerInput.trim());
      setOwnerInput('');
    }
  };

  const handleDelete = () => {
    if (confirm(`Hapus ${selectedCount} item yang dipilih?`)) {
      onBulkDelete();
    }
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
        >
          <Card className="rounded-2xl shadow-2xl border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Selection Info */}
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    {selectedCount} item dipilih
                  </span>
                </div>

                {/* Status Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">Status:</span>
                  <Select onValueChange={(value: ItemStatus) => onBulkUpdateStatus(value)}>
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue placeholder="Set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          Ada
                        </div>
                      </SelectItem>
                      <SelectItem value="missing">
                        <div className="flex items-center gap-2">
                          <X className="w-3 h-3 text-orange-600" />
                          Kurang
                        </div>
                      </SelectItem>
                      <SelectItem value="na">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-neutral-400 rounded-full" />
                          N/A
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">Priority:</span>
                  <Select onValueChange={(value: "Low" | "Medium" | "High") => onBulkUpdatePriority(value)}>
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue placeholder="Set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-red-600 fill-red-600" />
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-orange-600" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-neutral-400" />
                          Low
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Owner Assignment */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <Input
                    value={ownerInput}
                    onChange={(e) => setOwnerInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleOwnerUpdate()}
                    placeholder="Set owner"
                    className="w-32 h-8 text-xs"
                  />
                  <Button
                    onClick={handleOwnerUpdate}
                    disabled={!ownerInput.trim()}
                    size="sm"
                    variant="outline"
                    className="h-8 px-2 text-xs"
                  >
                    Apply
                  </Button>
                </div>

                {/* Delete Action */}
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>

                {/* Clear Selection */}
                <Button
                  onClick={onClearSelection}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}