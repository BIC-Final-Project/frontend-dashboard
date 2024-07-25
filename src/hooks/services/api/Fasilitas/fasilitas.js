import { useMutation, useQuery } from "@tanstack/react-query";
import { fasilitasServices } from "../../fetchers/fasilitasFetcher";

export const useGetAllFasilitas = (page, limit) => {
    return useQuery({
        queryKey: ["allFasilitas", page, limit],
        queryFn: () => {
            const data = fasilitasServices.getAllFasilitas()
            return data;
        }
    })
}

export const useGetFasilitasById = (id) => {
    return useQuery({
        queryKey: ["fasilitas", id],
        queryFn: () => {
            const data = fasilitasServices.getFasilitasById(id)
            return data;
        }
    })
}

export const useCreateFasilitas = ({ onSuccess, onError, } = {}) => {
    return useMutation({
      mutationFn: (payload) => {
        const data = fasilitasServices.createFasilitas(payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useUpdateFasilitas = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: ({id, payload}) => {
        const data = fasilitasServices.editFasilitas(id, payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useDeleteFasilitas = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: (id) => {
        const data = fasilitasServices.deleteFasilitas(id);
        return data;
      },
      onSuccess,
      onError
    })
  }
  