import { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon,
    Form,
    FormGroup, List, ListItem,
    SearchInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { ListWithToolbar } from "../../lib/common";
import { CubesIcon } from "@patternfly/react-icons";

export const ListWithToolbarDemo: FunctionComponent<any> = () => {
    const [collection, setCollection] = useState(["one", "two", "three"]);
    const [filteredCollection, setFilteredCollection] = useState(["one", "two", "three"]);
    const [isLoading, setIsLoading] = useState(false);
    const [criteria, setCriteria] = useState("");
    const [timerId, setTimerId] = useState<number>();

    useEffect(() => {
        setFilteredCollection(collection.filter((item) => {
            return item.indexOf(criteria) !== -1;
        }));
    }, [criteria, collection]);

    const onCollectionChange = (newValue: string): void => {
        setIsLoading(true);

        clearTimeout(timerId);
        setTimerId(setTimeout(() => {
            if (newValue.trim().length === 0) {
                setCollection([]);
            } else {
                setCollection(newValue.split(","));
            }
            setIsLoading(false);
        }, 1000) as any);
    };

    const emptyState = (
        <EmptyState>
            <EmptyStateHeader titleText="No items exist" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                No items exist.  Use this empty state to tell the user that, and help them create something.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <Button variant="primary">Create something</Button>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    const filteredEmptyState = (
        <EmptyState>
            <EmptyStateHeader titleText="No items found" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                No items were found that match the criteria.  This may mean that no items exist at all, but we
                can't know that.
            </EmptyStateBody>
        </EmptyState>
    );

    const toolbar = (
        <Toolbar id="toolbar-items-example">
            <ToolbarContent>
                <ToolbarItem variant="search-filter">
                    <SearchInput
                        aria-label="Items example search input"
                        value={criteria}
                        onChange={(_evt, value) => { setCriteria(value); }} />
                </ToolbarItem>
                <ToolbarItem>
                    <Button variant="secondary">Action</Button>
                </ToolbarItem>
                <ToolbarItem variant="separator" />
                <ToolbarItem>
                    <Button variant="primary">Action</Button>
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );

    return (
        <div>
            <Card ouiaId="ControlCard">
                <CardTitle>Component Settings</CardTitle>
                <CardBody>
                    <Form isHorizontal>
                        <FormGroup label="Collection (CSV)" fieldId="horizontal-form-name">
                            <SearchInput
                                value={collection.join(",")}
                                onChange={(_event, value) => onCollectionChange(value)}
                                onClear={() => setCollection([])}
                            />
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="DemoCard">
                <CardBody>
                    <ListWithToolbar
                        toolbar={toolbar}
                        emptyState={emptyState}
                        filteredEmptyState={filteredEmptyState}
                        isLoading={isLoading}
                        isError={isLoading}
                        isFiltered={criteria !== ""}
                        isEmpty={filteredCollection.length === 0}
                    >
                        <List>
                            {
                                filteredCollection.map((item, idx) =>
                                    <ListItem key={idx}>{item}</ListItem>
                                )
                            }
                        </List>
                    </ListWithToolbar>
                </CardBody>
            </Card>
        </div>
    );
};
