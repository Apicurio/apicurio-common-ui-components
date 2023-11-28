import { FunctionComponent, useState } from "react";
import { Alert, Checkbox } from "@patternfly/react-core";
import { If } from "../../lib/common/If.tsx";

export const IfDemo: FunctionComponent<any> = () => {
    const [condition, setCondition] = useState(true);

    return (
        <div>
            <Checkbox
                label="Condition is true"
                isChecked={condition}
                onChange={(_evt, checked) => { setCondition(checked); }}
                id="condition-check"
                name="condition-check"
            />
            <div style={{ padding: "15px" }} />
            <If condition={condition}>
                <Alert variant="success" title="Condition is true" ouiaId="SuccessAlert" />
            </If>
        </div>
    );
};
