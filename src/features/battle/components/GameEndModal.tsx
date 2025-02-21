import React, { useEffect } from 'react';
import { Modal, Box, Fade, Backdrop } from '@mui/material';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { resetGameEnd } from '../slices/gameEndSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  outline: 'none',
  width: 'auto',
  minWidth: '400px',
  overflow: 'hidden',
};

export const GameEndModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const gameEndState = useSelector((state: RootState) => state.gameEnd);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  console.log("GameEndModal render:", { gameEndState, userId });

  const isWinner = userId === gameEndState.winnerId;
  const ratingChange = gameEndState.ratingChanges[userId || ''] || 0;

  useEffect(() => {
    if (gameEndState.isOpen) {
      console.log("GameEndModal: Modal opened", gameEndState);
      
      const timer = setTimeout(() => {
        console.log("GameEndModal: Redirecting to dashboard...");
        dispatch(resetGameEnd());
        router.push('/dashboard');
      }, 5000);

      return () => {
        clearTimeout(timer);
        console.log("GameEndModal: Cleanup timer");
      };
    }
  }, [gameEndState, router, dispatch]);

  if (!gameEndState.isOpen) {
    console.log("GameEndModal: Not showing because isOpen is false");
    return null;
  }

  return (
    <Modal
      open={gameEndState.isOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backgroundColor: 'rgba(45, 39, 53, 0.8)',
            backdropFilter: 'blur(5px)'
          }
        }
      }}
    >
      <Fade in={gameEndState.isOpen}>
        <Box sx={modalStyle}>
          <div className="bg-[#10141D] rounded-lg p-8 flex flex-col items-center gap-6">
            <div className={`text-6xl ${isWinner ? 'text-yellow-500 animate-bounce' : 'text-gray-400'}`}>
              <Trophy />
            </div>
            
            <h2 className="text-3xl font-bold text-white">
              {isWinner ? 'Victory!' : 'Better luck next time!'}
            </h2>

            <div className="flex items-center gap-2 text-xl">
              <span className="text-gray-300">Rating</span>
              <div className={`flex items-center gap-1 ${
                ratingChange > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {ratingChange > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span>{Math.abs(ratingChange)}</span>
              </div>
            </div>

            <p className="text-gray-400 text-center">
              Redirecting to dashboard in 5 seconds...
            </p>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}; 