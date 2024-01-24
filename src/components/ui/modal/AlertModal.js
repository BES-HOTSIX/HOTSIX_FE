import { useEffect } from 'react';
import CloseIcon from '../icon/CloseIcon';

export default function AlertModal({ onClose, children }) {
  // 모달 창이 떠 있을 땐 백그라운드 스크롤을 막음
  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    document.body.style.pointerEvents = 'none';

    return () => {
      document.body.style.overflowY = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, []);

  return (
    <section
      className='fixed top-0 left-0 flex flex-col justify-center items-center w-full h-full z-50 bg-black/30'
      style={{ pointerEvents: 'auto' }}
    >
      <div className='relative bg-white w-80 h-52 md:w-96 md:h-60 rounded-md shadow-2xl shadow-black/30 border'>
        <button className='absolute right-0 p-2' onClick={() => onClose()}>
          <CloseIcon className='w-4 h-4 text-gray-600' />
        </button>
        {children}
      </div>
    </section>
  );
}
