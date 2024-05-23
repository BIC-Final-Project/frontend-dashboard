import React from 'react';
import Button from '../Button'; // Import komponen Button yang telah Anda buat
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // Pastikan Anda memiliki ikon yang sesuai

const InformationDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          Anda telah berhasil menambahkan Vendor!
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Pesan ini merupakan konfirmasi bahwa tindakan penambahan yang diminta oleh pengguna telah berhasil dilakukan.
        </p>
        <div className="flex justify-center">
          <Button label="Konfirmasi" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default InformationDialog;
