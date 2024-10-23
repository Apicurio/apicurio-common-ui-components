import { FunctionComponent } from "react";
import { Chip, ChipGroup } from "@patternfly/react-core";
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
        <ChipGroup categoryName={props.categoryName || "Filters"} isClosable onClick={props.onClearAllCriteria}>
            {props.criteria.map((fc, idx) => (
                <Chip key={idx} onClick={() => props.onRemoveCriteria(fc)}>
                    <b>{fc.filterBy.label}</b>
                    <span>: </span>
                    <span>{fc.filterValue}</span>
                </Chip>
            ))}
        </ChipGroup>
    );

};
