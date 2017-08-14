import * as React from "react";

export interface CalendarExampleProps extends React.Props<{}> {

}

export class CalendarExample extends React.Component<CalendarExampleProps, {}> {

    render() {
        return (
            <div id="calendar-example">
                <h2>Calendar Example</h2>
                <div id="example">
                </div>
            </div>
        );
    }
}