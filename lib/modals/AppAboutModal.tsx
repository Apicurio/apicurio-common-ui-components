import { FunctionComponent, useEffect, useState } from "react";
import { AboutModal, Content, ContentVariants } from "@patternfly/react-core";
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
            <Content className="app-about-modal-content" style={{ marginTop: "-25px" }}>
                <Content component={ContentVariants.h2}>Web console info</Content>
                <IfNotLoading isLoading={frontend === undefined}>
                    <Content component="dl">
                        <Content component="dt">Project</Content>
                        <Content component="dd"><a href={frontend?.url} target="_blank">{ frontend?.name }</a></Content>

                        <Content component="dt">Version</Content>
                        <Content component="dd">{ frontend?.version }</Content>

                        <Content component="dt">Built on</Content>
                        <Content component="dd">
                            <DateTime date={frontend?.builtOn} format="locale" />
                        </Content>

                        <Content component="dt">Digest</Content>
                        <Content component="dd">{ frontend?.digest }</Content>
                    </Content>
                </IfNotLoading>
                <Content style={{ marginTop: "40px" }} component={ContentVariants.h2}>{props.backendLabel}</Content>
                <IfNotLoading isLoading={backend === undefined}>
                    <Content component="dl">
                        <Content component="dt">Name</Content>
                        <Content component="dd">{ backend?.name || "" }</Content>

                        <Content component="dt">Description</Content>
                        <Content component="dd">{ backend?.description || "" }</Content>

                        <Content component="dt">Version</Content>
                        <Content component="dd">{ backend?.version || "" }</Content>

                        <Content component="dt">Built on</Content>
                        <Content component="dd">
                            <DateTime date={backend?.builtOn} format="locale" />
                        </Content>
                    </Content>
                </IfNotLoading>
            </Content>
        </AboutModal>
    );
};
