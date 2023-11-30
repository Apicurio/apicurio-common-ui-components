import { FunctionComponent, useEffect, useState } from "react";
import { DateTime as LuxonDateTime, LocaleOptions } from "luxon";

/**
 * Properties
 */
export type DateTimeProps = {
    date: Date | string | undefined;
    format?: string;
    locale?: string;
};

export const DateTime: FunctionComponent<DateTimeProps> = (props: DateTimeProps) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    const format: string = props.format || "locale";

    useEffect(() => {
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
                setFormattedDate(luxonDT.toRelative());
            } else if (format === "locale") {
                setFormattedDate(luxonDT.toLocaleString(LuxonDateTime.DATETIME_FULL, localeOptions));
            } else {
                setFormattedDate(luxonDT.toFormat(format, localeOptions));
            }
        } else {
            setFormattedDate(null);
        }
    }, [props.date]);

    return (
        <span>{ formattedDate || "" }</span>
    );
};
