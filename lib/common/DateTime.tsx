import { FunctionComponent, useEffect, useState } from "react";
import { DateTime as LuxonDateTime, LocaleOptions } from "luxon";
import { Tooltip, useInterval } from "@patternfly/react-core";

/**
 * Properties
 */
export type DateTimeProps = {
    date: Date | string | undefined | null;
    format?: string;
    locale?: string;
};

export const DateTime: FunctionComponent<DateTimeProps> = (props: DateTimeProps) => {
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [localeDate, setLocaleDate] = useState<string>("");

    const format: string = props.format || "locale";

    useInterval(() => {
        if (format === "fromNow") {
            renderDate();
        }
    }, 5000);

    const renderDate = (): void => {
        let luxonDT: LuxonDateTime | undefined = undefined;
        if (props.date && typeof props.date === "string") {
            luxonDT = LuxonDateTime.fromISO(props.date as string);
        } else if (props.date && typeof props.date === "object") {
            luxonDT = LuxonDateTime.fromJSDate(props.date as Date);
        }

        if (luxonDT) {
            const localeOptions: LocaleOptions = {
                locale: props.locale
            };
            if (format === "fromNow") {
                setFormattedDate(luxonDT.toRelative() || "");
            } else if (format === "locale") {
                setFormattedDate(luxonDT.toLocaleString(LuxonDateTime.DATETIME_FULL, localeOptions));
            } else {
                setFormattedDate(luxonDT.toFormat(format, localeOptions));
            }

            setLocaleDate(luxonDT.toLocaleString(LuxonDateTime.DATETIME_FULL, localeOptions));
        }
    };

    useEffect(() => {
        renderDate();
    }, [props.date]);

    if (format === "fromNow") {
        return (
            <Tooltip content={
                <span>{localeDate}</span>
            }>
                <span>{formattedDate}</span>
            </Tooltip>
        );
    } else {
        return (
            <span>{formattedDate}</span>
        );
    }

};
