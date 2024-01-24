import AlertModal from './AlertModal'
import ModalPortal from './ModalPortal'

export default function ConfirmAlert({ isOpen, onClose, onSubmit, children }) {
  if (!isOpen) {
    return null
  }

  return (
    <ModalPortal>
      <AlertModal onClose={onClose}>
        <div className='p-5 w-full h-full flex flex-col justify-center items-center gap-8'>
          <span className='text-center leading-relaxed tracking-wider'>
            {children}
          </span>
          <div className='flex gap-3 w-full justify-center'>
            <button className='w-20 btn' onClick={onClose}>
              아니요
            </button>
            <button
              className='w-20 btn btn-error text-black'
              onClick={onSubmit}>
              네
            </button>
          </div>
        </div>
      </AlertModal>
    </ModalPortal>
  )
}
