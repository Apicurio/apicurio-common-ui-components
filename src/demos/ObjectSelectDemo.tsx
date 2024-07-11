import { FunctionComponent, useState } from "react";
import { ObjectSelect } from "../../lib/common";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Modal, Wizard, WizardStep } from "@patternfly/react-core";

type ComplexItem = {
    label: string;
    testId: string;
};

const items = ["One", "Two", "Three", "Four"];
const objects: ComplexItem[] = [1,2,3,4,5,6,7,8].map((i ) => {
    return {
        label: `Object ${i}`,
        testId: `object-${i}`
    };
});

export const ObjectSelectDemo: FunctionComponent<any> = () => {
    const [selectedItem, setSelectedItem] = useState(items[0]);
    const [selectedObject, setSelectedObject] = useState(objects[0]);
    const [appendToModalOpen, setAppendToModalOpen] = useState(false);

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
            <div style={{ padding: "15px" }}/>
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
            <div style={{ padding: "15px" }}/>
            <Card ouiaId="ObjectArrayCard">
                <CardTitle>Append to...</CardTitle>
                <CardBody>
                    <Button variant="primary" ouiaId="Primary" onClick={() => setAppendToModalOpen(true)}>
                        Show Modal
                    </Button>
                    <Modal
                        title="Append to..."
                        variant="large"
                        isOpen={appendToModalOpen}
                        onClose={() => setAppendToModalOpen(false)}
                    >
                        <Wizard title="Wizard">
                            <WizardStep name="Demo Step" id="demo-step">
                                <Form>
                                    <FormGroup label="Inline" fieldId="inline">
                                        <ObjectSelect
                                            value={selectedObject}
                                            testId="object-select"
                                            items={objects}
                                            onSelect={setSelectedObject}
                                            itemToString={item => item.label}
                                            itemToTestId={item => `test-${item.testId}`}
                                            itemIsDivider={() => false}
                                            noSelectionLabel="Select on object"
                                            appendTo="inline"
                                        />
                                    </FormGroup>
                                    <FormGroup label="Document" fieldId="document">
                                        <ObjectSelect
                                            value={selectedObject}
                                            testId="object-select"
                                            items={objects}
                                            onSelect={setSelectedObject}
                                            itemToString={item => item.label}
                                            itemToTestId={item => `test-${item.testId}`}
                                            itemIsDivider={() => false}
                                            noSelectionLabel="Select on object"
                                            appendTo="document"
                                        />
                                    </FormGroup>
                                </Form>
                            </WizardStep>
                        </Wizard>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};
