import { FunctionComponent, useState } from "react";
import { ObjectSelect } from "../../lib/common";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

type ComplexItem = {
    label: string;
    testId: string;
};

const items = ["One", "Two", "Three", "Four"];
const objects: ComplexItem[] = [
    {
        label: "Object 1",
        testId: "object-1"
    },
    {
        label: "Object 2",
        testId: "object-2"
    },
    {
        label: "Object 3",
        testId: "object-3"
    },
];

export const ObjectSelectDemo: FunctionComponent<any> = () => {
    const [selectedItem, setSelectedItem] = useState(items[0]);
    const [selectedObject, setSelectedObject] = useState(objects[0]);

    return (
        <div>
            <Card ouiaId="SimpleArrayCard">
                <CardTitle>String Array Example</CardTitle>
                <CardBody>
                    <ObjectSelect
                        value={selectedItem}
                        testId="item-select"
                        items={items}
                        onSelect={setSelectedItem}
                        itemToString={item => item}
                        itemToTestId={item => `test-${item}`}
                        itemIsDivider={() => false}
                        noSelectionLabel="Select an item"
                    />
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="ObjectArrayCard">
                <CardTitle>Object Array Example</CardTitle>
                <CardBody>
                    <ObjectSelect
                        value={selectedObject}
                        testId="object-select"
                        items={objects}
                        onSelect={setSelectedObject}
                        itemToString={item => item.label}
                        itemToTestId={item => `test-${item.testId}`}
                        itemIsDivider={() => false}
                        noSelectionLabel="Select on object"
                    />
                </CardBody>
            </Card>
        </div>
    );
};
