import { useMutation, useQuery } from "@tanstack/react-query";
import { membershipServices } from "../../fetchers/membershipFetcher";

export const useGetAllMembership = (page, limit, search) => {
    return useQuery({
        queryKey: ["allMembership", page, limit, search],
        queryFn: () => {
            const data = membershipServices.getAllMembership(page, limit, search)
            return data;
        }
    })
}

export const useGetMembershipById = (id) => {
    return useQuery({
        queryKey: ["membership", id],
        queryFn: () => {
            const data = membershipServices.getMembershipById(id)
            return data;
        }
    })
}

export const useCreateMembership = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: async (payload) => {
        const {data, formData} = payload
        const dataMember = await membershipServices.createMembership(data);
        const dataDokumen = await membershipServices.createDokumenMembership(dataMember._id, formData);
        return dataDokumen;
      },
      onSuccess,
      onError,
    })
  }

  export const useEditMembership = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: async ({id, payload}) => {
        const {data, formData} = payload
        const dataMember = await membershipServices.editMembership(id, data);
        const dataDokumen = await membershipServices.editDokumenMembership(id, formData);
        return dataDokumen;
      },
      onSuccess,
      onError,
    })
  }

  export const useDeleteMembership = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: (id) => {
        const data = membershipServices.deleteMembership(id);
        return data;
      },
      onSuccess,
      onError
    })
  }