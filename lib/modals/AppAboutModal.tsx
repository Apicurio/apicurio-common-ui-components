import { FunctionComponent, useEffect, useState } from "react";
import { AboutModal, Text, TextContent, TextList, TextListItem, TextVariants } from "@patternfly/react-core";
import { DateTime, IfNotLoading } from "../common";


export type FrontendInfo = {
    name: string;
    url: string;
    version: string;
    builtOn: Date | string;
    digest: string;
};

export type BackendInfo = {
    name: string;
    description: string;
    version: string;
    builtOn: Date | string;
    digest: string;
};


export type AppAboutModalProps = {
    isOpen: boolean;
    frontendInfo: FrontendInfo | (() => Promise<FrontendInfo>);
    backendInfo: BackendInfo | (() => Promise<BackendInfo>);
    backendLabel: string;
    brandImageSrc: string;
    brandImageAlt: string;
    onClose: () => void;
};

export const AppAboutModal: FunctionComponent<AppAboutModalProps> = (props: AppAboutModalProps) => {
    const [frontend, setFrontend] = useState<FrontendInfo>();
    const [backend, setBackend] = useState<BackendInfo>();

    useEffect(() => {
        if (props.isOpen) {
            if (typeof props.frontendInfo === "function") {
                props.frontendInfo().then(setFrontend);
            } else {
                setFrontend(props.frontendInfo);
            }
            if (typeof props.backendInfo === "function") {
                props.backendInfo().then(setBackend);
            } else {
                setBackend(props.backendInfo);
            }
        }
    }, [props.isOpen]);

    return (
        <AboutModal
            className="app-about-modal"
            isOpen={props.isOpen}
            onClose={props.onClose}
            trademark="&copy; 2024 Red Hat"
            brandImageSrc={props.brandImageSrc}
            brandImageAlt={props.brandImageAlt}
            aria-label={props.brandImageAlt}
        >
            <TextContent className="app-about-modal-content" style={{ marginTop: "-25px" }}>
                <Text component={TextVariants.h2}>Web console info</Text>
                <IfNotLoading isLoading={frontend === undefined}>
                    <TextList component="dl">
                        <TextListItem component="dt">Project</TextListItem>
                        <TextListItem component="dd"><a href={frontend?.url} target="_blank">{ frontend?.name }</a></TextListItem>

                        <TextListItem component="dt">Version</TextListItem>
                        <TextListItem component="dd">{ frontend?.version }</TextListItem>

                        <TextListItem component="dt">Built on</TextListItem>
                        <TextListItem component="dd">
                            <DateTime date={frontend?.builtOn} format="locale" />
                        </TextListItem>

                        <TextListItem component="dt">Digest</TextListItem>
                        <TextListItem component="dd">{ frontend?.digest }</TextListItem>
                    </TextList>
                </IfNotLoading>
                <Text style={{ marginTop: "40px" }} component={TextVariants.h2}>{props.backendLabel}</Text>
                <IfNotLoading isLoading={backend === undefined}>
                    <TextList component="dl">
                        <TextListItem component="dt">Name</TextListItem>
                        <TextListItem component="dd">{ backend?.name || "" }</TextListItem>

                        <TextListItem component="dt">Description</TextListItem>
                        <TextListItem component="dd">{ backend?.description || "" }</TextListItem>

                        <TextListItem component="dt">Version</TextListItem>
                        <TextListItem component="dd">{ backend?.version || "" }</TextListItem>

                        <TextListItem component="dt">Built on</TextListItem>
                        <TextListItem component="dd">
                            <DateTime date={backend?.builtOn} format="locale" />
                        </TextListItem>
                    </TextList>
                </IfNotLoading>
            </TextContent>
        </AboutModal>
    );
};
