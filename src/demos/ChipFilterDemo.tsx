import { FunctionComponent, useState } from "react";
import { ChipFilterCriteria, ChipFilterInput, ChipFilterType, FilterChips } from "../../lib/filtering";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { If } from "../../lib/common";

export const ChipFilterDemo: FunctionComponent<any> = () => {
    const [criteria, setCriteria] = useState<ChipFilterCriteria[]>([]);

    const filterTypes: ChipFilterType[] = [
        {
            label: "Filter One",
            value: "filter-1",
            testId: "filter-1"
        },
        {
            label: "Filter Two",
            value: "filter-2",
            testId: "filter-2"
        },
        {
            label: "Filter Three",
            value: "filter-3",
            testId: "filter-3"
        },
    ];

    return (
        <div>
            <Toolbar>
                <ToolbarContent>
                    <ToolbarItem className="filter-item">
                        <ChipFilterInput
                            filterTypes={filterTypes}
                            onAddCriteria={(newCriteria) => {
                                setCriteria([
                                    ...criteria,
                                    newCriteria
                                ]);
                            }} />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <If condition={criteria.length > 0}>
                <Toolbar style={{ paddingTop: "0" }}>
                    <ToolbarContent>
                        <ToolbarItem className="filter-item">
                            <FilterChips
                                criteria={criteria}
                                onClearAllCriteria={() => setCriteria([])}
                                onRemoveCriteria={(xCriteria) => {
                                    setCriteria(
                                        criteria.filter(c => c !== xCriteria)
                                    );
                                }} />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            </If>
        </div>
    );
};
