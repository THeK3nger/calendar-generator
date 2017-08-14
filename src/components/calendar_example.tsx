import * as React from "react";

import { CalendarGeneratorOutput, SeasonsParameters } from "../calendgen"

export interface CalendarExampleProps extends React.Props<{}> {
    calendar: CalendarGeneratorOutput, days_per_week: number, seasons: SeasonsParameters
}

export class CalendarExample extends React.Component<CalendarExampleProps, {}> {

    renderMonths(day_names: Array<string>) {
        let months: Array<JSX.Element> = [];
        const year_days = this.props.calendar.calendar_parameters.days_per_year;
        const months_num = this.props.calendar.calendar_parameters.months_per_year;
        const base_days_per_month = this.props.calendar.calendar_parameters.base_days_per_month;

        // Allocate all the spare days into random months.
        let days_remainder = year_days - months_num * base_days_per_month;
        let days_per_month: Array<number> = [];
        for (let i = 0; i < months_num; i++) {
            days_per_month.push(base_days_per_month);
        }
        for (let i = 0; i < days_remainder; i++) {
            days_per_month[Math.floor(Math.random() * months_num)] += 1;
        }

        let starting_week_day = 0;
        for (let i = 0; i < months_num; i++) {
            months.push(<MonthTable key={i} id={i} day_names={day_names} days_per_week={day_names.length} month_day={days_per_month[i]} starting_day={starting_week_day} />);
            starting_week_day = (starting_week_day + days_per_month[i]) % this.props.days_per_week;
        }
        return months;
    }

    render() {
        let names = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
        return (
            <div id="calendar-example">
                <h2>Calendar Example</h2>
                <div id="example">
                    { this.renderMonths(names) }
                </div>
            </div>
        );
    }
}

interface MonthTableProps extends React.Props<{}> {
    id: number,
    day_names: Array<string>,
    days_per_week: number,
    month_day: number,
    starting_day: number // Starting day of the week for the current month.
}

export class MonthTable extends React.Component<MonthTableProps, {}> {

    renderCell(name: string, id: string = name) {
        return <td key={id}>{name}</td>;
    }

    renderMonthHeader() {
        return (
            <thead>
                <tr>
                    {this.props.day_names.map((name) => this.renderCell(name))}
                </tr>
            </thead>
        );
    }

    renderMonthWeek(id: number, starting_day: number, empty_start = 0, empty_end = 0) {
        // If empty_start > 0 fill the empty cells at the beginning of week.
        // If empty_end > 0 fill the empty cells at the end of the week.
        // Only one between empty start and empty end can be > 0!
        let week: Array<JSX.Element> = []
        let starting = empty_start;
        let ending = this.props.days_per_week - empty_end;
        let idx = 0;
        let current_day = starting_day;
        while (idx < starting) {
            week.push(this.renderCell("", idx.toString()));
            idx++;
        }
        while (idx < ending) {
            week.push(this.renderCell(current_day.toString(), idx.toString()));
            idx++;
            current_day++;
        }
        while (idx < this.props.days_per_week) {
            week.push(this.renderCell("", idx.toString()));
            idx++;
        }

        return (
            <tr key={id}>
                {week}
            </tr>
        );
    }

    renderMonthBody() {
        let weeks: Array<JSX.Element> = [];
        let current_day = 1;
        let week_num = 0;

        // First Week
        weeks.push(this.renderMonthWeek(week_num, current_day, this.props.starting_day))
        current_day += this.props.days_per_week - this.props.starting_day;
        week_num++;
        while (current_day < this.props.month_day) {
            if (current_day + this.props.days_per_week < this.props.month_day) {
                weeks.push(this.renderMonthWeek(week_num, current_day))
                week_num++;
                current_day += this.props.days_per_week;
            } else {
                weeks.push(this.renderMonthWeek(week_num, current_day, 0, (current_day + this.props.days_per_week) - this.props.month_day - 1));
                current_day += this.props.days_per_week;
                week_num++;
            }
        }

        return (
            <tbody>
                {weeks}
            </tbody>
        );
    }

    render() {
        return (
            <div>
                <h4>Month {this.props.id}</h4>
                <table>
                    {this.renderMonthHeader()}
                    {this.renderMonthBody()}
                </table>
            </div>
        );
    }
}