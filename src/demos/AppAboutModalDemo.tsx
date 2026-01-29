import { FunctionComponent, useState } from "react";
import { Button, Card, CardBody, CardTitle } from "@patternfly/react-core";
import { AppAboutModal, BackendInfo, FrontendInfo } from "../../lib/modals";

export const AppAboutModalDemo: FunctionComponent<any> = () => {
    const [isStaticOpen, setIsStaticOpen] = useState(false);
    const [isAsyncOpen, setIsAsyncOpen] = useState(false);

    const staticFrontendInfo: FrontendInfo = {
        name: "Demo App",
        url: "http://www.example.org",
        version: "1.0",
        builtOn: new Date(),
        digest: "e11670e87f5bb66a0d3081a626fc37e5b1e3b211"
    };
    const staticBackendInfo: BackendInfo = {
        name: "Demo App API",
        description: "The coolest demo API you'll ever see!",
        builtOn: new Date(),
        version: "1.0.1",
        digest: "38510badc68bd5137c4da5bf8ace018c2ad5be73"
    };

    const fetchFrontendInfo = (): Promise<FrontendInfo> => {
        const rval: Promise<FrontendInfo> = new Promise((resolve) => {
            setTimeout(() => {
                resolve(staticFrontendInfo);
            }, 1000);
        });
        return rval;
    };

    const fetchBackendInfo = (): Promise<BackendInfo> => {
        const rval: Promise<BackendInfo> = new Promise((resolve) => {
            setTimeout(() => {
                resolve(staticBackendInfo);
            }, 2000);
        });
        return rval;
    };

    return (
        <div>
            <Card ouiaId="StaticAboutCard">
                <CardTitle>Static Info Example</CardTitle>
                <CardBody>
                    <Button variant="primary" ouiaId="Primary" onClick={() => setIsStaticOpen(true)}>
                        Show About modal
                    </Button>
                    <AppAboutModal
                        frontendInfo={staticFrontendInfo}
                        backendInfo={staticBackendInfo}
                        backendLabel="Backend API"
                        brandImageSrc="/apicurio_primary_logo_black.svg"
                        brandImageAlt="Demo Brand"
                        onClose={() => setIsStaticOpen(false)}
                        isOpen={isStaticOpen} />
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="AsyncAboutCard">
                <CardTitle>Async Info Example</CardTitle>
                <CardBody>
                    <Button variant="primary" ouiaId="Primary" onClick={() => setIsAsyncOpen(true)}>
                        Show About modal
                    </Button>
                    <AppAboutModal
                        frontendInfo={fetchFrontendInfo}
                        backendInfo={fetchBackendInfo}
                        backendLabel="Backend API"
                        brandImageSrc="/apicurio_primary_logo_black.svg"
                        brandImageAlt="Demo Brand"
                        onClose={() => setIsAsyncOpen(false)}
                        isOpen={isAsyncOpen} />
                </CardBody>
            </Card>
        </div>
    );
};
