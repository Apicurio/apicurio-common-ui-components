import React, { CSSProperties, FunctionComponent, useState } from "react";
import { Button, Spinner, TextArea, TextInput } from "@patternfly/react-core";
import { IfNotLoading } from "./IfNotLoading.tsx";
import { If } from "./If.tsx";

/**
 * Properties
 */
export type UrlUploadProps = {
    id: string | "url-upload";
    urlPlaceholder: string | "";
    testId?: string;
    onUrlFetch: (url: string) => Promise<string>;
    onChange: (value: string | undefined, url: string | undefined) => void;
};

const loadingCss: CSSProperties = {
    padding: "5px",
    minHeight: "128px",
    borderRight: 0,
    borderLeft: 0,
    borderBottom: "1px solid #666",
    backgroundColor: "rgb(240, 240, 240)"
};

const errorCss: CSSProperties = {
    ...loadingCss,
    color: "red",
    overflow: "auto"
};

/**
 * A control similar to the FileUpload control from patternfly that allows uploading from
 * a URL instead of a file.
 */
export const UrlUpload: FunctionComponent<UrlUploadProps> = (props: UrlUploadProps) => {
    const [url, setUrl] = useState<string>("");
    const [previewContent, setPreviewContent] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [downloadError, setDownloadError] = useState<string>();

    const onTextInputChange = (_env: any, value: string): void => {
        setUrl(value);
    };

    const hasUrl = (): boolean => {
        return url != undefined && url.trim().length > 0;
    };

    const hasError = (): boolean => {
        return downloadError != undefined && downloadError.trim().length > 0;
    };

    const onFetch = (): void => {
        setLoading(true);
        props.onUrlFetch(url as string).then(content => {
            setDownloadError(undefined);
            setPreviewContent(content);
            setLoading(false);
            props.onChange(content, url);
        }).catch(error => {
            setDownloadError(error.message);
            setLoading(false);
        });
    };

    const onClear = (): void => {
        setUrl("");
        setPreviewContent("");
        props.onChange(undefined, undefined);
    };

    const spinner: React.ReactNode = (
        <div className="url-upload-loading" style={loadingCss}>
            <Spinner size="md" className="spinner" style={{ marginRight: "5px" }} />
            <span className="spinner-message">Loading URL content</span>
        </div>
    );

    return (
        <div className="url-upload" data-testid={props.testId}>
            <div className="url-upload-flex" style={{ display: "flex", marginBottom: "2px" }} >
                <div className="url-upload-url" style={{ flexGrow: 1, marginRight: "3px" }}>
                    <TextInput data-testid={`${props.testId}-input`} value={url} type="text" placeholder={props.urlPlaceholder} id={props.id}
                        onChange={onTextInputChange} aria-label="url input" />
                </div>
                <div className="url-fetch-button" style={{ marginRight: "3px" }}>
                    <Button data-testid={`${props.testId}-fetch`} variant="control" isDisabled={!hasUrl()} onClick={onFetch}>Fetch</Button>
                </div>
                <div className="url-clear-button">
                    <Button data-testid={`${props.testId}-clear`} variant="control" isDisabled={!hasUrl()} onClick={onClear}>Clear</Button>
                </div>
            </div>
            <div className="url-upload-preview">
                <IfNotLoading isLoading={isLoading} loadingComponent={spinner}>
                    <If condition={hasError}>
                        <div className="url-upload-error" style={errorCss}>
                            <div>
                                Error getting content from URL.
                            </div>
                            <div>
                                {downloadError}
                            </div>
                        </div>
                    </If>
                    <If condition={!hasError()}>
                        <TextArea
                            data-testid={`${props.testId}-preview`}
                            aria-label="url-content"
                            value={previewContent}
                            readOnly={true}
                            style={{ minHeight: "128px" }} />
                    </If>
                </IfNotLoading>
            </div>
        </div>
    );
};
