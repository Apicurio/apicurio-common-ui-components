import { FunctionComponent } from "react";
import { Label, LabelGroup } from "@patternfly/react-core";
import { ChipFilterCriteria } from "./ChipFilterCriteria";

export type FilterChipsProps = {
    categoryName?: string;
    criteria: ChipFilterCriteria[];
    onClearAllCriteria: () => void;
    onRemoveCriteria: (criteria: ChipFilterCriteria) => void;
};

/**
 * Models a collection of chips representing the current filter state (multiple filter criteria).
 */
export const FilterChips: FunctionComponent<FilterChipsProps> = (props: FilterChipsProps) => {

    return (
        <LabelGroup categoryName={props.categoryName || "Filters"} isClosable onClick={props.onClearAllCriteria}>
            {props.criteria.map((fc, idx) => (
                <Label variant="outline" key={idx} onClose={() => props.onRemoveCriteria(fc)}>
                    <b>{fc.filterBy.label}</b>
                    <span>: </span>
                    <span>{fc.filterValue}</span>
                </Label>
            ))}
        </LabelGroup>
    );

};
