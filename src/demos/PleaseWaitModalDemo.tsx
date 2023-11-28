import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "@patternfly/react-core";
import { PleaseWaitModal } from "../../lib/modals";

export const PleaseWaitModalDemo: FunctionComponent<any> = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsOpen(false), 5000);
        }
    }, [isOpen]);

    return (
        <div>
            <Button variant="primary" ouiaId="Primary" onClick={() => setIsOpen(true)}>
                Show Modal
            </Button>
            <div style={{ padding: "15px" }} />
            <PleaseWaitModal message={"Please wait..."} isOpen={isOpen} />
        </div>
    );
};
