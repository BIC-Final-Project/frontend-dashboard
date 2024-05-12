import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from 'notistack';
import TitleCard from "../../components/Cards/TitleCard";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

function DetailAset() {
    const [assets, setAssets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // Ini akan diatur dinamis
    const [modal, setModal] = useState({ isOpen: false, message: "", type: "", id: null });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAssets(currentPage);
    }, [currentPage]);

    const fetchAssets = async (page) => {
        try {
            const pageSize = 10; // Setiap halaman menampilkan 10 baris data
            const response = await axios.get(`URL_API?page=${page}&pageSize=${pageSize}`);
            const result = response.data;
            if (result.code === 0) {
                setAssets(result.data);
                const totalData = result.totalCount; // Asumsikan API mengembalikan jumlah total data
                setTotalPages(Math.ceil(totalData / pageSize)); // Hitung jumlah total halaman
            } else {
                console.error('API error:', result.info);
                loadDummyData();
            }
        } catch (error) {
            console.error('Axios error:', error.message);
            loadDummyData();
        }
    };

    const loadDummyData = () => {
        const fetchedAssets = [
            { id: 1, name: 'Laptop', dateEntered: '2023-05-01', vendorName: 'Dell', category: 'Elektronik', quantity: 10, image: 'https://via.placeholder.com/150' },
            { id: 2, name: 'Printer', dateEntered: '2023-05-02', vendorName: 'HP', category: 'Perkantoran', quantity: 5, image: 'https://via.placeholder.com/150' }
        ];
        setAssets(fetchedAssets);
        setTotalPages(1); // Default untuk dummy data
    };

    const handleDeleteAsset = (id) => {
        setModal({ isOpen: true, message: "Apakah Anda yakin ingin menghapus aset ini?", type: "delete", id });
    };

    const closeDialog = () => {
        setModal({ isOpen: false, id: null });
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.post('URL_DELETE_ASSET', { id: modal.id });
            if (response.status === 200) {
                setAssets(assets.filter(asset => asset.id !== modal.id));
                enqueueSnackbar('Aset berhasil dihapus.', { variant: 'success' });
            } else {
                enqueueSnackbar('Gagal menghapus aset.', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Gagal menghapus aset.', { variant: 'error' });
        }
        closeDialog();
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <TitleCard title="Detail Aset" topMargin="mt-2">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Foto Aset</th>
                                <th>Nama Aset</th>
                                <th>Tgl Aset Masuk</th>
                                <th>Nama Vendor</th>
                                <th>Kategori</th>
                                <th>Jumlah Aset</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.id}>
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={asset.image} alt="Foto Aset" />
                                            </div>
                                        </div>
                                    </td>
                                    <td>{asset.name}</td>
                                    <td>{moment(asset.dateEntered).format("DD MMM YYYY")}</td>
                                    <td>{asset.vendorName}</td>
                                    <td>{asset.category}</td>
                                    <td>{asset.quantity}</td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => handleDeleteAsset(asset.id)}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                        className="btn btn-square btn-ghost"
                                        onClick={() => console.log("Edit", asset.id)} // Tambahkan fungsi edit di sini
                                        >
                                        <PencilIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div>
                        <button className="btn" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                        <button className="btn" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                    <div>
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </TitleCard>
            <ConfirmDialog
                isOpen={modal.isOpen}
                onClose={closeDialog}
                onConfirm={confirmDelete}
            />
        </>
    );
}

export default DetailAset;
