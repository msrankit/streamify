import React from 'react'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {logout} from "../libs/api.js";

const UseLogout = () => {

    const useQuery = useQueryClient()

    const {mutate:LogoutMutation} = useMutation({
        mutationFn:logout,
        onSuccess:(data) => useQuery.invalidateQueries({queryKey:['authUser']})
    });
    return {LogoutMutation}

}
export default UseLogout
