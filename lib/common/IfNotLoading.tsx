import React, { FunctionComponent } from "react";
import { Spinner } from "@patternfly/react-core";

/**
 * Properties
 */
export type IfNotLoadingProps = {
    isLoading: boolean | (() => boolean);
    loadingComponent?: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * Displays a Spinner control while the condition property is true.  When false, the provided children
 * are displayed.  Useful when displaying content from the results of an async operation such as a REST
 * call.
 */
export const IfNotLoading: FunctionComponent<IfNotLoadingProps> = ({ isLoading, loadingComponent, children }: IfNotLoadingProps) => {
    const accept = () => {
        if (typeof isLoading === "boolean") {
            return isLoading;
        } else {
            return isLoading();
        }
    };
    const lc: React.ReactNode = loadingComponent || <Spinner />;
    return (accept() ? <React.Fragment children={lc} /> : <React.Fragment children={children} />);
};
