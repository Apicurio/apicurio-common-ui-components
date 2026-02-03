import { FunctionComponent, useEffect, useState } from "react";
import { Button, ButtonVariant, Form, InputGroup, InputGroupItem, TextInput } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { ObjectSelect } from "../common";
import { ChipFilterType } from "./ChipFilterType";
import { ChipFilterCriteria } from "./ChipFilterCriteria";

export type ChipFilterInputProps = {
    filterTypes: ChipFilterType[];
    onAddCriteria: (criteria: ChipFilterCriteria) => void;
};

/**
 * Models a filter control with chips.
 */
export const ChipFilterInput: FunctionComponent<ChipFilterInputProps> = (props: ChipFilterInputProps) => {
    const [selectedFilterType, setSelectedFilterType] = useState<ChipFilterType>(props.filterTypes[0]);
    const [filterValue, setFilterValue] = useState("");

    const onFilterSubmit = (event: any|undefined): void => {
        if (event) {
            event.preventDefault();
        }
        props.onAddCriteria({
            filterBy: selectedFilterType,
            filterValue: filterValue
        });
        setFilterValue("");
    };

    useEffect(() => {
        setSelectedFilterType(props.filterTypes[0]);
    }, [props.filterTypes]);

    return (
        <Form onSubmit={onFilterSubmit}>
            <InputGroup>
                <InputGroupItem>
                    <ObjectSelect
                        value={selectedFilterType}
                        items={props.filterTypes}
                        testId="chip-filter-select"
                        toggleClassname="chip-filter-toggle"
                        onSelect={setSelectedFilterType}
                        appendTo="document"
                        itemToTestId={(item) => item.testId}
                        itemToString={(item) => item.label} />
                </InputGroupItem>
                <InputGroupItem isFill>
                    <TextInput name="filterValue" id="filterValue" type="search"
                        value={filterValue}
                        onChange={(_evt, value) => setFilterValue(value)}
                        data-testid="chip-filter-value"
                        aria-label="search input"/>
                </InputGroupItem>
                <InputGroupItem>
                    <Button icon={<SearchIcon/>} variant={ButtonVariant.control}
                        onClick={onFilterSubmit}
                        data-testid="chip-filter-search"
                        aria-label="search button for search input">

                    </Button>
                </InputGroupItem>
            </InputGroup>
        </Form>
    );

};
