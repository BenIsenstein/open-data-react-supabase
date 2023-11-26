import { FC, PropsWithChildren } from "react";

export const Page: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="box-border p-5">
            {children}
        </div>
    )
}