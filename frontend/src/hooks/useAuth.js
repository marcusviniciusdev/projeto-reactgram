//detecta se o usuário está autenticado
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuth = () => {

    // extraindo o user do authSlice, ou seja o usuario que foi retornado registrado
    const { user } = useSelector((state) => state.auth)

    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setAuth(true)
        } else {
            setAuth(false)
        }

        setLoading(false)

    }, [user])

    return { auth, loading }

}