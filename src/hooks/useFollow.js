import toast from 'react-hot-toast'
import { baseurl } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const useFollow = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("authToken");
    const { mutate: follow, isLoading: isPending } = useMutation({
        mutationFn: async (userId) => {
            const res = await axios.post(`${baseurl}/api/users/follow/${userId}`, {}, { withCredentials: true , headers: { Authorization: `Bearer ${token}` } });
            if (!res.data) {
                throw new Error(res.error || "Something went wrong");
            }
            return res.data;
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUsers"] }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message || "An error occurred");
        },
    });

    return { follow, isPending };
};

export default useFollow;
