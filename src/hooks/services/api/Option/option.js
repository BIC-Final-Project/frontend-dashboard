import { useQuery } from "@tanstack/react-query";
import { optionServices } from "../../fetchers/optionFetchers";
import { membershipTypeServices } from "../../fetchers/paketMembershipFetcher";

export const useGetFasilitasOption = () => {
    return useQuery({
        queryKey: ["fasilitasOption"],
        queryFn: () => {
            const data = optionServices.getFasilitasOption()
            return data;
        }
    })
}

export const useGetFasilitasNameOption = () => {
    return useQuery({
        queryKey: ["fasilitasNameOption"],
        queryFn: () => {
            const data = optionServices.getFasilitasNameOption()
            return data;
        }
    })
}

export const useGetMembershipTypeOption = () => {
    return useQuery({
        queryKey: ["membershipTypeOption"],
        queryFn: () => {
            const data = optionServices.getMembershipTypeOption()
            return data;
        }
    })
}