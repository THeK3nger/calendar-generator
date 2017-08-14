import * as React from "react";

export interface NumericTextInputProps { id: string; label: string; defaultValue: number }

export class NumericTextInput extends React.Component<NumericTextInputProps, {}> {

    render() {
        return (
            <p>
                {this.props.label}:
            <input type="text" id={this.props.id} defaultValue={this.props.defaultValue.toString()} />
            </p>
        )
    }
}