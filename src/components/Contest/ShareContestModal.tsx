import React from 'react';
import Modal from '@/components/ui/Modal';
import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: string;
  contestTitle: string;
}

const ShareContestModal: React.FC<ShareContestModalProps> = ({
  isOpen,
  onClose,
  contestId,
}) => {
  const contestLink = `${window.location.origin}/contest/join/${contestId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(contestLink);
      toast.success('Link copied to clipboard!');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to copy link');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(contestId);
      toast.success('Contest code copied to clipboard!');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to copy contest code');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Contest">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[#D1D1D1] text-sm">Contest Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={contestLink}
              readOnly
              className="flex-1 bg-[#1A1D24] text-white px-4 py-3 rounded-lg border border-gray-700"
            />
            <button
              onClick={handleCopyLink}
              className="p-3 bg-[#1A1D24] text-white rounded-lg hover:bg-[#282C34] transition-colors"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#D1D1D1] text-sm">Contest Code</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={contestId}
              readOnly
              className="flex-1 bg-[#1A1D24] text-white px-4 py-3 rounded-lg border border-gray-700"
            />
            <button
              onClick={handleCopyCode}
              className="p-3 bg-[#1A1D24] text-white rounded-lg hover:bg-[#282C34] transition-colors"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareContestModal;