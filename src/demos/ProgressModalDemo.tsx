import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "@patternfly/react-core";
import { ProgressModal } from "../../lib/modals";

let counter: number = 0;

export const ProgressModalDemo: FunctionComponent<any> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [timerId, setTimerId] = useState<number>(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    const incrementProgress = (amount: number): void => {
        console.info("INC: ", counter, amount);
        counter = counter + amount;
        setProgressPercentage(counter);
    };

    useEffect(() => {
        if (isOpen) {
            counter = 0;
            const id: number = setInterval(() => {
                incrementProgress(1);
            }, 50) as any;
            setTimerId(id);
        } else {
            clearInterval(timerId);
            counter = 0;
            setProgressPercentage(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (progressPercentage > 100) {
            setIsOpen(false);
        }
    }, [progressPercentage]);

    return (
        <div>
            <Button variant="primary" ouiaId="Primary" onClick={() => setIsOpen(true)}>
                Show Modal
            </Button>
            <div style={{ padding: "15px" }} />
            <ProgressModal
                title="Doing something..."
                isCloseable={true}
                message="Progress is happening!"
                isOpen={isOpen}
                progress={progressPercentage}
                onClose={() => setIsOpen(false)} />
        </div>
    );
};
