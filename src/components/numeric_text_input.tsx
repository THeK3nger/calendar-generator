import * as React from "react";

export interface NumericTextInputProps {
    id: string,
    label: string,
    defaultValue: number,
    onChange: (string, number) => void
}

export class NumericTextInput extends React.Component<NumericTextInputProps, {}> {

    handleChange(e: React.FormEvent<HTMLInputElement>) {
        this.props.onChange(e.currentTarget.id, parseFloat(e.currentTarget.value));        
    }

    render() {
        return (
            <p>
                {this.props.label}:
            <input type="text" id={this.props.id} defaultValue={this.props.defaultValue.toString()} onChange={(e) => this.handleChange(e)} />
            </p>
        )
    }
}