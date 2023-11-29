import React, { FunctionComponent, useState } from "react";
import { Card, CardBody, CardTitle, Checkbox, Form, FormGroup } from "@patternfly/react-core";
import { ResponsiveTable } from "../../lib/table";
import { TableVariant, ThProps } from "@patternfly/react-table";

type SongInfo = {
    id: number;
    name: string;
    artist: string;
    released: number;
};

export const ResponsiveTableDemo: FunctionComponent<any> = () => {
    const [sortByIndex, setSortByIndex] = useState(0);
    const [sortDirection, setSortDirection] = useState("asc");
    const [isCompact, setIsCompact] = useState(false);

    const columns: any[] = [
        { index: 0, id: "name", label: "Song", width: 25, sortable: true },
        { index: 1, id: "artist", label: "Artist", width: 50, sortable: false },
        { index: 2, id: "date", label: "Released", width: 25, sortable: true }
    ];

    const rows: SongInfo[] = [
        { id: 1, name: "All I Know So Far", artist: "P!nk", released: 2021 },
        { id: 2, name: "Before He Cheats", artist: "Carrie Underwood", released: 2005 },
        { id: 3, name: "Cruel Summer", artist: "Taylor Swift", released: 2019 },
        { id: 4, name: "Lost Boy", artist: "Ruth B", released: 2015 },
        { id: 5, name: "Childhood Eyes", artist: "Yellowcard", released: 2023 },
    ];

    const sortParams = (column: any): ThProps["sort"] | undefined => {
        return column.sortable ? {
            sortBy: {
                index: sortByIndex,
                direction: sortDirection as ("asc" | "desc")
            },
            onSort: (_event, index, direction) => {
                console.info("OnSort: ", index, direction, typeof direction);
                setSortByIndex(index);
                setSortDirection(direction);
            },
            columnIndex: column.index
        } : undefined;
    };

    const renderColumnData = (column: SongInfo, colIndex: number): React.ReactNode => {
        // Name
        if (colIndex === 0) {
            return <span>{ column.name }</span>;
        }
        if (colIndex === 1) {
            return <span>{ column.artist }</span>;
        }
        return <span>{ column.released }</span>;
    };

    const data = (): SongInfo[] => {
        return rows.sort((s1, s2) => {
            let f1, f2;
            if (sortByIndex === 0) {
                f1 = s1.name;
                f2 = s2.name;
            } else {
                f1 = ""+s1.released;
                f2 = ""+s2.released;
            }
            return sortDirection == "asc" ? f1.localeCompare(f2) : f2.localeCompare(f1);
        });
    };

    return (
        <div>
            <Card ouiaId="ControlCard">
                <CardTitle>Component Settings</CardTitle>
                <CardBody>
                    <Form>
                        <FormGroup label="Variant" fieldId="horizontal-form-name">
                            <Checkbox
                                label="Compact Table"
                                isChecked={isCompact}
                                onChange={(_evt, checked) => { setIsCompact(checked); }}
                                id="isCompact-check"
                                name="isCompact-check"
                            />
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="TableCard">
                <CardBody>
                    <ResponsiveTable
                        ariaLabel="demo table"
                        columns={columns}
                        data={data()}
                        variant={isCompact ? TableVariant.compact : undefined}
                        renderHeader={({ column, Th }) => (
                            <Th sort={sortParams(column)}
                                className="version-list-header"
                                key={`header-${column.id}`}
                                width={column.width}
                                modifier="truncate">{column.label}</Th>
                        )}
                        renderCell={({ row, colIndex, Td }) => (
                            <Td className="demo-table-cell" key={`cell-${colIndex}-${row.id}`}
                                style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                children={renderColumnData(row, colIndex) as any} />
                        )}
                    />
                </CardBody>
            </Card>

        </div>
    );
};
