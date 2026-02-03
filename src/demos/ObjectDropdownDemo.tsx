import { FunctionComponent } from "react";
import { ObjectDropdown } from "../../lib/common";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

type ComplexItem = {
    label: string;
    testId: string;
};

export const ObjectDropdownDemo: FunctionComponent<any> = () => {
    const items = ["One", "Two", "Three", "Four"];
    const objects: ComplexItem[] = [
        {
            label: "Option 1",
            testId: "option-1"
        },
        {
            label: "Option 2",
            testId: "option-2"
        },
        {
            label: "Option 3",
            testId: "option-3"
        },
        {
            label: "Not Visible",
            testId: "not-visible"
        }
    ];

    return (
        <div>
            <Card ouiaId="SimpleArrayCard">
                <CardTitle>String Array Example</CardTitle>
                <CardBody>
                    <ObjectDropdown
                        label="Select an option"
                        items={items}
                        onSelect={item => { alert(`You selected: ${item}`); }}
                        itemToString={item => item}
                        itemIsDivider={() => false}
                        itemToTestId={item => `test-${item}`}
                        noSelectionLabel="Select"
                    />
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="ObjectArrayCard">
                <CardTitle>Object Array Example</CardTitle>
                <CardBody>
                    <ObjectDropdown
                        label="Select an option"
                        items={objects}
                        onSelect={item => { alert(`You selected "${item.label}" with test-id: ${item.testId}`); }}
                        itemToString={item => item.label}
                        itemIsDivider={() => false}
                        itemToTestId={item => `test-${item.testId}`}
                        itemIsVisible={item => item.testId !== "not-visible"}
                        noSelectionLabel="Select"
                    />
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="KebabCard">
                <CardTitle>Kebab Example</CardTitle>
                <CardBody>
                    <ObjectDropdown
                        label="Select an option"
                        items={objects}
                        isKebab={true}
                        onSelect={item => { alert(`You selected "${item.label}" with test-id: ${item.testId}`); }}
                        itemToString={item => item.label}
                        itemIsDivider={() => false}
                        itemToTestId={item => `test-${item.testId}`}
                        noSelectionLabel="Select"
                    />
                </CardBody>
            </Card>
        </div>
    );
};
