import React from "react";
import { IfDemo } from "./demos/IfDemo.tsx";
import { IfNotEmptyDemo } from "./demos/IfNotEmptyDemo.tsx";
import { PleaseWaitModalDemo } from "./demos/PleaseWaitModalDemo.tsx";
import { ProgressModalDemo } from "./demos/ProgressModalDemo.tsx";
import { IfNotLoadingDemo } from "./demos/IfNotLoadingDemo.tsx";
import { ObjectDropdownDemo } from "./demos/ObjectDropdownDemo.tsx";
import { ObjectSelectDemo } from "./demos/ObjectSelectDemo.tsx";
import { AppAboutModalDemo } from "./demos/AppAboutModalDemo.tsx";
import { ListWithToolbarDemo } from "./demos/ListWithToolbarDemo.tsx";
import { UrlUploadDemo } from "./demos/UrlUploadDemo.tsx";

export type Demo = {
    name: string;
    description: string | React.ReactNode;
    component: React.ReactNode;
}

export type Demos = {
    [key: string]: Demo[];
}

export const ALL_DEMOS: Demos = {
    "Common Types": [
        {
            name: "If",
            description: "Wraps some children and shows them only when the condition is true.",
            component: <IfDemo/>
        },
        {
            name: "IfNotEmpty",
            description: <span>Wraps some children and shows them only when a collection (e.g. an array) is <b>not</b> empty.</span>,
            component: <IfNotEmptyDemo/>
        },
        {
            name: "IfNotLoading",
            description: "Wraps some children and shows them when some async operation is running (loading).",
            component: <IfNotLoadingDemo/>
        },
        {
            name: "ListWithToolbar",
            description: "A component that makes it easier to render a list of items with a toolbar at the top.",
            component: <ListWithToolbarDemo/>
        },
        {
            name: "ObjectDropdown",
            description: "An easier way to model a dropdown of objects.  This differs from a select, which is an input.  This component is a menu.",
            component: <ObjectDropdownDemo/>
        },
        {
            name: "ObjectSelect",
            description: "An easier way to model a select input of objects.  This differs from a dropdown, which is a menu.  This component is an input.",
            component: <ObjectSelectDemo/>
        },
        {
            name: "UrlUpload",
            description: "A component similar to the Patternfly FileUpload, but meant for choosing URLs instead of files.",
            component: <UrlUploadDemo/>
        },
    ],
    "Modals": [
        {
            name: "AppAboutModal",
            description: "A generic About modal dialog used by all Apicurio projects to display metainfo about the UI and API.",
            component: <AppAboutModalDemo/>
        },
        {
            name: "PleaseWaitModal",
            description: "A modal that can be shown while waiting for an async operation to complete.",
            component: <PleaseWaitModalDemo/>
        },
        {
            name: "ProgressModal",
            description: "A modal that can show the progress (e.g. from 0 to 100) of some async operation.",
            component: <ProgressModalDemo/>
        },
    ]
};
