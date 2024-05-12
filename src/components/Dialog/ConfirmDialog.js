import React from 'react';

function ConfirmDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className={`modal modal-open ${!isOpen && 'modal-close'}`}>
      <div className="modal-box">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold flex items-center">
            <span className="text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            Apakah ingin menghapus?
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            ✕
          </button>
        </div>
        <p className="py-4">Jika anda menghapus item ini maka item ini tidak bisa pulihkan kembali!</p>
        <div className="modal-action">
          <button onClick={onClose} className="btn">Batalkan</button>
          <button onClick={onConfirm} className="btn btn-success">Konfirmasi</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
