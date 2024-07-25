import { useQuery } from "@tanstack/react-query";
import { totalServices } from "../../fetchers/totalFetcher";

export const useGetTotalStats = () => {
    return useQuery({
        queryKey: ["total"],
        queryFn: async () => {
            const totalTransaction = await totalServices.getTotalTransaction()
            const totalBooking = await totalServices.getTotalBooking()
            const totalMember = await totalServices.getTotalMember()
            const totalFasilitas = await totalServices.getTotalFasilitas()
            return {
                totalTransaction,
                totalBooking,
                totalMember,
                totalFasilitas
            }
        }
    })
}