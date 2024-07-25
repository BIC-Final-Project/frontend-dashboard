import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 200_000
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error?.message)
    }
  }),
});

export default queryClient;