
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../libs/api";

const useAuthuser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false, // auth check
    });

    return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
export default useAuthuser;
