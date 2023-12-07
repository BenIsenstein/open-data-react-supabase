import { PropsWithChildren, FC } from "react"
import { useNavigate } from "react-router-dom"

type Props = {
    to: string
}

export const Link: FC<PropsWithChildren<Props>> = ({ to, children }) => {
    const navigate = useNavigate()

    return (
        <a
            href={to}
            className="font-bold cursor-pointer hover:underline hover:text-blue-700 active:text-blue-400"
            onClick={(e) => {
                e.preventDefault()
                navigate(to)
            }}
        >
            {children}
        </a>
    )
}