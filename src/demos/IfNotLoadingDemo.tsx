import React, { FunctionComponent, useState } from "react";
import { IfNotLoading } from "../../lib/common";
import { Alert, Card, CardBody, Checkbox, Spinner } from "@patternfly/react-core";

export const IfNotLoadingDemo: FunctionComponent<any> = () => {
    const [isLoading, setIsLoading] = useState(true);

    const loadingComponent: React.ReactNode = (
        <Card ouiaId="BasicCard">
            <CardBody>
                <Spinner size="md" />
                &nbsp;&nbsp;
                <span style={{ fontSize: "17px" }}>Loading, please wait...</span>
            </CardBody>
        </Card>
    );

    return (
        <div>
            <Checkbox
                label="Loading is true"
                isChecked={isLoading}
                onChange={(_evt, checked) => { setIsLoading(checked); }}
                id="isLoading-check"
                name="isLoading-check"
            />
            <div style={{ padding: "15px" }} />
            <IfNotLoading isLoading={isLoading} loadingComponent={loadingComponent}>
                <Alert variant="success" title="Loading is complete!" ouiaId="SuccessAlert" />
            </IfNotLoading>
        </div>
    );
};
