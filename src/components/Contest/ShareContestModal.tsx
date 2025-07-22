import React from "react";
import Modal from "@/components/ui/Modal";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";

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
      toast.success("Link copied to clipboard!", {
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          maxWidth: '100%',
        },
        duration: 4000,
      });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to copy link",
        {
          style: {
            background: '#1F2937',
            color: '#F3F4F6',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
            maxWidth: '100%',
          },
          duration: 4000,
        }
      );
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(contestId);
      toast.success("Contest code copied to clipboard!", {
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          maxWidth: '100%',
        },
        duration: 4000,
      });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to copy contest code",
        {
          style: {
            background: '#1F2937',
            color: '#F3F4F6',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
            maxWidth: '100%',
          },
          duration: 4000,
        }
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Contest">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[#D1D1D1] text-sm font-medium">Contest Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={contestLink}
              readOnly
              className="flex-1 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] text-white px-4 py-3 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 focus:border-cyan-500/40 focus:outline-none transition-all duration-200"
            />
            <button
              onClick={handleCopyLink}
              className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#D1D1D1] text-sm font-medium">Contest Code</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={contestId}
              readOnly
              className="flex-1 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] text-white px-4 py-3 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 focus:border-cyan-500/40 focus:outline-none transition-all duration-200"
            />
            <button
              onClick={handleCopyCode}
              className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
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
