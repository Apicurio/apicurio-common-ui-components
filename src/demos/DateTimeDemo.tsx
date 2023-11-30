import { FunctionComponent } from "react";
import { DateTime } from "../../lib/common";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

export const DateTimeDemo: FunctionComponent<any> = () => {
    return (
        <div>
            <Card ouiaId="NowCard">
                <CardTitle>Now</CardTitle>
                <CardBody>
                    <div>
                        <DateTime date={new Date()} />
                    </div>
                    <div>
                        <DateTime date={new Date()} format="locale" />
                    </div>
                    <div>
                        <DateTime date={new Date()} format="fromNow" />
                    </div>
                    <div>
                        <DateTime date={new Date()} format="yyyy-MM-dd 'at' h:mm a" />
                    </div>
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="Jan17Card">
                <CardTitle>Jan 17, 2012 @ 3:30 PM (UTC)</CardTitle>
                <CardBody>
                    <div>
                        <DateTime date="2012-01-17T15:30:00Z" />
                    </div>
                    <div>
                        <DateTime date="2012-01-17T15:30:00Z" format="locale" />
                    </div>
                    <div>
                        <DateTime date="2012-01-17T15:30:00Z" format="fromNow" />
                    </div>
                    <div>
                        <DateTime date="2012-01-17T15:30:00Z" format="yyyy-MM-dd 'at' h:mm a" />
                    </div>
                </CardBody>
            </Card>
            <div style={{ padding: "15px" }} />
            <Card ouiaId="Feb10Card">
                <CardTitle>Feb 10, 2023 @ 02:15 AM (UTC)</CardTitle>
                <CardBody>
                    <div>
                        <DateTime date="2023-02-10T02:15:00Z" />
                    </div>
                    <div>
                        <DateTime date="2023-02-10T02:15:00Z" format="locale" />
                    </div>
                    <div>
                        <DateTime date="2023-02-10T02:15:00Z" format="fromNow" />
                    </div>
                    <div>
                        <DateTime date="2023-02-10T02:15:00Z" format="yyyy-MM-dd 'at' h:mm a" />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};
