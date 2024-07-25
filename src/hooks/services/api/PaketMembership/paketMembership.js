import { useMutation, useQuery } from "@tanstack/react-query";
import { membershipTypeServices } from "../../fetchers/paketMembershipFetcher";

export const useGetAllMembershipType = (type) => {
    return useQuery({
        queryKey: ["allMembershipType", type],
        queryFn: () => {
            const data = membershipTypeServices.getAllMembershipType(type)
            return data;
        }
    })
}

export const useGetMembershipTypeById = (id) => {
    return useQuery({
        queryKey: ["membershipType", id],
        queryFn: () => {
            const data = membershipTypeServices.getMembershipTypeById(id)
            return data;
        }
    })
}

export const useCreateMembershipType = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: (payload) => {
        const data = membershipTypeServices.createMembershipType(payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useUpdateMembershipType = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: ({id, payload}) => {
        const data = membershipTypeServices.editMembershipType(id, payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useDeletePaketMembership = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: (id) => {
        const data = membershipTypeServices.deletePaketMembership(id);
        return data;
      },
      onSuccess,
      onError
    })
  }