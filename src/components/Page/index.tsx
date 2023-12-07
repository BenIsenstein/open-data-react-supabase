import { FC, PropsWithChildren } from "react";
import { useAppContext } from "contexts";

export const Page: FC<PropsWithChildren> = ({ children }) => {
    const { user, signout } = useAppContext()

    return (
        <div className="box-border p-5 relative">
            {user && (
                <button
                    className="absolute top-5 right-5 font-semibold hover:underline active:text-zinc-500 z-50"
                    onClick={signout}
                >
                    Logout
                </button>
            )}
            {children}
        </div>
    )
}