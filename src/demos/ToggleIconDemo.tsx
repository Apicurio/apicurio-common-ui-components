import { FunctionComponent, useState } from "react";
import { Card, CardBody } from "@patternfly/react-core";
import { ToggleIcon } from "../../lib/common";

export const ToggleIconDemo: FunctionComponent<any> = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <Card ouiaId="ToggleIconDemo">
                <CardBody>
                    <ToggleIcon expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
                </CardBody>
            </Card>
        </div>
    );
};
