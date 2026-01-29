import {
    EmptyState,
    Spinner,
} from "@patternfly/react-core";

export function Loading() {
    return (
        <EmptyState  headingLevel="h4" icon={Spinner}  titleText="Loading">
            </EmptyState>
    );
}
