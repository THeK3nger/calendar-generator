import * as React from "react";

export interface CalendarDescriptionProps {
    description: Array<string>
}

export class CalendarDescription extends React.Component<CalendarDescriptionProps, {}> {

    renderParagraph(text: string, id: number) {
        return <p key={id}>{text}</p>;
    }

    render() {
        return (
            <div id="calendar-description">
                <h2>Calendar Description</h2>
                <div id="description">
                    {this.props.description.map((d, id) => this.renderParagraph(d, id))}
                </div>
            </div>
        );
    }
}