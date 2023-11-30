import { FunctionComponent } from "react";
import { DateTime } from "./DateTime.tsx";


export type FromNowProps = {
    date: Date | string | undefined;
};


export const FromNow: FunctionComponent<FromNowProps> = (props: FromNowProps) => {
    return (
        <DateTime date={props.date} format="fromNow" />
    );
};
