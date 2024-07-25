import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingServices } from "../../fetchers/bookingFetcher";

export const useGetAllBooking = (page, limit, search) => {
    return useQuery({
        queryKey: ["allBooking", page, limit, search],
        queryFn: () => {
            const data = bookingServices.getAllBooking(page, limit, search)
            return data;
        }
    })
}

export const useGetBookingById = (id) => {
    return useQuery({
        queryKey: ["booking", id],
        queryFn: () => {
            const data = bookingServices.getBookingById(id)
            return data;
        }
    })
}

export const useGetAvailableJam = ({ onSuccess, onError, } = {}) => {
    return useMutation({
      mutationFn: ({id, payload}) => {
        const data = bookingServices.getAvailableBookingJam(id, payload);
        return data;
      },
      onSuccess,
      onError,
    })
}

export const useCreateBooking = ({ onSuccess, onError, } = {}) => {
    return useMutation({
      mutationFn: (payload) => {
        const data = bookingServices.createBooking(payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useUpdateBooking = ({ onSuccess, onError} = {}) => {
    return useMutation({
      mutationFn: ({id, payload}) => {
        const data = bookingServices.editBooking(id, payload);
        return data;
      },
      onSuccess,
      onError,
    })
  }

  export const useDeleteBooking = ({ onSuccess, onError } = {}) => {
    return useMutation({
      mutationFn: (id) => {
        const data = bookingServices.deleteBooking(id);
        return data;
      },
      onSuccess,
      onError
    })
  }
  