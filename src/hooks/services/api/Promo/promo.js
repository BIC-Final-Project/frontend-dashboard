import { useMutation, useQuery } from "@tanstack/react-query";
import { promoServices } from "../../fetchers/promoFetcher";

export const useGetAllPromo = (page, limit) => {
    return useQuery({
        queryKey: ["allPromo", page, limit],
        queryFn: () => {
            const data = promoServices.getAllPromo()
            return data;
        }
    })
}

export const useGetPromoById = (id) => {
    return useQuery({
        queryKey: ["promo", id],
        queryFn: () => {
            const data = promoServices.getPromoById(id)
            return data;
        }
    })
}

export const useCreatePromo = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: (payload) => {
        const data = promoServices.createPromo(payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useUpdatePromo = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: ({id, payload}) => {
        const data = promoServices.editPromo(id, payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useDeletePromo = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: (id) => {
        const data = promoServices.deletePromo(id);
        return data;
      },
      onSuccess,
      onError
    })
  }