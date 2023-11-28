import { FunctionComponent, useState } from "react";
import {
    Alert, Button,
    EmptyState, EmptyStateActions,
    EmptyStateBody, EmptyStateFooter,
    EmptyStateHeader, EmptyStateIcon,
    Form,
    FormGroup,
    SearchInput
} from "@patternfly/react-core";
import { IfNotEmpty } from "../../lib/common";
import { CubesIcon } from "@patternfly/react-icons";

export const IfEmptyDemo: FunctionComponent<any> = () => {
    const [collection, setCollection] = useState(["1", "2", "3"]);

    const onCollectionChange = (newValue: string): void => {
        if (newValue.trim().length === 0) {
            setCollection([]);
        } else {
            setCollection(newValue.split(","));
        }
    };

    const emptyState = (
        <EmptyState>
            <EmptyStateHeader titleText="No items found" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                No items were found in the collection.  Add some items and see what happens!
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <Button variant="primary">Primary action</Button>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    return (
        <div>
            <Form isHorizontal>
                <FormGroup label="Collection (CSV)" fieldId="horizontal-form-name">
                    <SearchInput
                        placeholder="Find by name"
                        value={collection.join(",")}
                        onChange={(_event, value) => onCollectionChange(value)}
                        onClear={() => setCollection([])}
                    />
                </FormGroup>
            </Form>
            <div style={{ padding: "15px" }} />
            <IfNotEmpty collection={collection} emptyState={emptyState}>
                <Alert variant="success" title={`Collection contains ${collection.length} items`} ouiaId="SuccessAlert" />
            </IfNotEmpty>
        </div>
    );
};
