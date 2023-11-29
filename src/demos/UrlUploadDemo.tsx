import { FunctionComponent } from "react";
import { UrlUpload } from "../../lib/common";
import { Card, CardBody } from "@patternfly/react-core";

export const UrlUploadDemo: FunctionComponent<any> = () => {

    const onFetch = async (url: string): Promise<string> => {
        return fetch(url).then(response => response.text());
    };

    return (
        <div>
            <Card ouiaId="ObjectArrayCard">
                <CardBody>
                    <UrlUpload
                        id="url-upload-demo"
                        urlPlaceholder="Choose a URL"
                        onUrlFetch={onFetch}
                        onChange={() => {}} />
                </CardBody>
            </Card>
        </div>
    );
};
