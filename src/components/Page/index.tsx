import { FC, PropsWithChildren } from "react";
import { useAppContext } from "../../contexts/appContext";

export const Page: FC<PropsWithChildren> = ({ children }) => {
    const {user, signout} = useAppContext()

    return (
        <div className="box-border p-5">
            {user && (
                <button onClick={()=>signout()}>Logout</button>
            )}
            {children}
        </div>
    )
}