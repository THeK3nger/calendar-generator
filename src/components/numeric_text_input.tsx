import * as React from "react";

export interface NumericTextInputProps { id: string; label: string; defaultValue: number }
export interface NumericTextInputState { value: number }

export class NumericTextInput extends React.Component<NumericTextInputProps, NumericTextInputState> {

    updateValue(event) {
        let new_state = {
            value: parseFloat(event.target.value)
        }
        this.setState(new_state);
    }

    render() {
        return (
            <p>
                {this.props.label}:
            <input type="text" id={this.props.id} defaultValue={this.props.defaultValue.toString()} />
            </p>
        )
    }
}