import React from "react";
import { IfDemo } from "./demos/IfDemo.tsx";
import { IfEmptyDemo } from "./demos/IfEmptyDemo.tsx";
import { PleaseWaitModalDemo } from "./demos/PleaseWaitModalDemo.tsx";
import { ProgressModalDemo } from "./demos/ProgressModalDemo.tsx";
import { IfNotLoadingDemo } from "./demos/IfNotLoadingDemo.tsx";
import { ObjectDropdownDemo } from "./demos/ObjectDropdownDemo.tsx";
import { ObjectSelectDemo } from "./demos/ObjectSelectDemo.tsx";
import { AppAboutModalDemo } from "./demos/AppAboutModalDemo.tsx";

export type Demo = {
    name: string;
    description: string;
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
            name: "IfEmpty",
            description: "Wraps some children and shows them only when a collection (e.g. an array) is empty.",
            component: <IfEmptyDemo/>
        },
        {
            name: "IfNotLoading",
            description: "Wraps some children and shows them when some async operation is running (loading).",
            component: <IfNotLoadingDemo/>
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
    ],
    "Modals": [
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
        {
            name: "AppAboutModal",
            description: "A generic About modal dialog used by all Apicurio projects to display metainfo about the UI and API.",
            component: <AppAboutModalDemo/>
        },
    ]
};
