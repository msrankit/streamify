import React from 'react'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signup} from "../libs/api.js";

const UseSignup = () => {
    const queryClient = useQueryClient()

    const {mutate , isPending , error} = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"]}),

    })
    return {error, isPending, SignupMutate: mutate}
}
export default UseSignup
