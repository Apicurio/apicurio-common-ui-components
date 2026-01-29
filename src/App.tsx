import React, { useState } from "react";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import {
    Brand,
    Button,
    ButtonVariant,
    Content,
    Masthead,
    MastheadLogo,
    MastheadContent,
    MastheadMain,
    MastheadToggle, MastheadBrand,
    Nav, NavExpandable,
    NavItem,
    NavList,
    Page,
    PageSection,
    PageSidebar,
    PageSidebarBody,
    PageToggleButton,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem
} from "@patternfly/react-core";

import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import QuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/question-circle-icon";
import brandLogo from "/apicurio_primary_logo_black.svg";
import { ALL_DEMOS, Demo } from "./AllDemos.tsx";

function App() {
    const [activeDemo, setActiveDemo] = useState(ALL_DEMOS["Common Types"][0]);

    const headerToolbar = (
        <Toolbar id="toolbar" isFullHeight isStatic>
            <ToolbarContent>
                <ToolbarGroup
                    variant="action-group-plain"
                    align={{ default: "alignEnd" }}
                    gap={{ default: "gapNone", md: "gapMd" }}
                >
                    <ToolbarGroup variant="action-group-plain" visibility={{ default: "hidden", lg: "visible" }}>
                        <ToolbarItem>
                            <Button aria-label="Help" variant={ButtonVariant.plain} icon={<QuestionCircleIcon />} />
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarGroup>
            </ToolbarContent>
        </Toolbar>
    );

    const masthead = (
        <Masthead>
            <MastheadMain>
                <MastheadToggle>
                    <PageToggleButton variant="plain" aria-label="Global navigation" icon={<BarsIcon />} />
                </MastheadToggle>
                <MastheadBrand>
                    <MastheadLogo>
                        <Brand src={brandLogo} alt="PatternFly" heights={{ default: "36px" }} />
                    </MastheadLogo>
                    <div style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "-5px" }}>Common UI Components</div>
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>{headerToolbar}</MastheadContent>
        </Masthead>
    );

    const renderDemos = (demos: Demo[]): React.ReactNode => {
        return demos.map((demo, idx) =>
            <NavItem
                key={idx}
                itemId={idx}
                isActive={demo === activeDemo}
                to={`#${demo.name}`}
                onClick={() => { setActiveDemo(demo); }}
            >
                { demo.name }
            </NavItem>
        );
    };

    const renderDemoGroups = (): React.ReactNode => {
        return Object.getOwnPropertyNames(ALL_DEMOS).map((group, idx) => {
            return (
                <NavExpandable
                    title={group}
                    key={idx}
                    groupId={`nav-expandable-group-${idx}`}
                    isExpanded
                >
                    {
                        renderDemos(ALL_DEMOS[group])
                    }
                </NavExpandable>
            );
        });
    };

    const pageNav = (
        <Nav>
            <NavList>
                {
                    renderDemoGroups()
                }
            </NavList>
        </Nav>
    );

    const sidebar = (
        <PageSidebar>
            <PageSidebarBody>{pageNav}</PageSidebarBody>
        </PageSidebar>
    );

    const mainContainerId = "main-content";

    return (
        <Page
            masthead={masthead}
            sidebar={sidebar}
            isManagedSidebar
            mainContainerId={mainContainerId}
            additionalGroupedContent={
                <PageSection hasBodyWrapper isWidthLimited>
                    <Content style={{ padding: "20px 20px 0px 20px" }}>
                        <Content component="h1">{activeDemo.name}</Content>
                        <Content component="p">{activeDemo.description}</Content>
                    </Content>
                </PageSection>
            }
        >
            <PageSection style={{ padding: "20px" }} hasBodyWrapper={false} children={activeDemo.component} />
        </Page>
    );
}

export default App;
