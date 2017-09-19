import * as React from "react";

import { CalendarGeneratorOutput, SeasonsParameters, LunarPhases } from "../calendgen"

export interface CalendarExampleProps {
    calendar: CalendarGeneratorOutput, days_per_week: number, seasons: SeasonsParameters, lunar_phases: LunarPhases
}

interface MonthLunarPhases {
    full_moon: Array<number>
    new_moon: Array<number>
    first_quart: Array<number>
    third_quart: Array<number>
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
        let phases: { mlp: null | MonthLunarPhases, next: LunarPhases } = { mlp: null, next: this.props.lunar_phases };
        for (let i = 0; i < months_num; i++) {
            phases = this.compute_next_lunar_phases(phases.next, days_per_month[i])
            if (phases.mlp) {
                months.push(<MonthTable key={i} id={i}
                    day_names={day_names}
                    days_per_week={day_names.length}
                    month_day={days_per_month[i]}
                    starting_day={starting_week_day}
                    lunar_phases={phases.mlp} />);
            }
            starting_week_day = (starting_week_day + days_per_month[i]) % this.props.days_per_week;
        }
        return months;
    }

    compute_next_lunar_phases(previous: LunarPhases, days_in_month: number): { mlp: MonthLunarPhases, next: LunarPhases } {
        const moon_period = this.props.calendar.calendar_parameters.base_days_per_month;
        let fm = previous.full_moon;
        let nfmlist: Array<number> = [];
        while (fm < days_in_month) {
            if (fm >= 0 && fm < days_in_month) {
                nfmlist.push(fm);
            }
            fm += moon_period;
        }
        let nm = previous.new_moon;
        let nnmlist: Array<number> = [];
        while (nm < days_in_month) {
            if (nm >= 0 && nm < days_in_month) {
                nnmlist.push(nm);
            }
            nm += moon_period;
        }
        let fq = previous.first_quart;
        let fqmlist: Array<number> = [];
        while (fq < days_in_month) {
            if (fq >= 0 && fq < days_in_month) {
                fqmlist.push(fq);
            }
            fq += moon_period;
        }
        let tq = previous.third_quart;
        let tqmlist: Array<number> = [];
        while (tq < days_in_month) {
            if (tq >= 0 && tq < days_in_month) {
                tqmlist.push(tq);
            }
            tq += moon_period;
        }
        const nfm = fm - days_in_month;
        const nnm = nm - days_in_month;
        const fqm = fq - days_in_month;
        const tqm = tq - days_in_month;
        return {
            mlp: {
                full_moon: nfmlist,
                new_moon: nnmlist,
                first_quart: fqmlist,
                third_quart: tqmlist
            },
            next: {
                full_moon: nfm,
                new_moon: nnm,
                first_quart: fqm,
                third_quart: tqm,
            }
        };
    }

    render() {
        let names = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
        return (
            <div id="calendar-example">
                <h2>Calendar Example</h2>
                <div id="example">
                    {this.renderMonths(names)}
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
    lunar_phases: MonthLunarPhases
}

export class MonthTable extends React.Component<MonthTableProps, {}> {

    renderCell(name: string, id: string = name, symbol: string = " ") {
        return <td key={id}><div className="calenday"><span>{symbol}</span>{name}</div></td>;
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

    select_phases(day: number, phases: MonthLunarPhases): string {
        console.log(phases);
        if (phases.full_moon.indexOf(day -1) !== -1) {
            return "🌕";
        }
        if (phases.new_moon.indexOf(day -1) !== -1) {
            return "🌑";
        }
        if (phases.first_quart.indexOf(day -1) !== -1) {
            return "🌓";
        }
        if (phases.third_quart.indexOf(day -1) !== -1) {
            return "🌗";
        }
        return " ";
    }

    renderMonthWeek(id: number, starting_day: number, empty_start = 0, empty_end = 0) {
        // If empty_start > 0 fill the empty cells at the beginning of week.
        // If empty_end > 0 fill the empty cells at the end of the week.
        // Only one between empty start and empty end can be > 0!
        let week: Array<JSX.Element> = [];
        let starting = empty_start;
        let ending = this.props.days_per_week - empty_end;
        let idx = 0;
        let current_day = starting_day;
        while (idx < starting) {
            week.push(this.renderCell("", idx.toString()));
            idx++;
        }
        while (idx < ending) {
            let phase = this.select_phases(current_day, this.props.lunar_phases);
            week.push(this.renderCell(current_day.toString(), idx.toString(), phase));
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
        weeks.push(this.renderMonthWeek(week_num, current_day, this.props.starting_day));
        current_day += this.props.days_per_week - this.props.starting_day;
        week_num++;
        while (current_day < this.props.month_day) {
            if (current_day + this.props.days_per_week < this.props.month_day) {
                weeks.push(this.renderMonthWeek(week_num, current_day));
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
                <h4>Month {this.props.id + 1}</h4>
                <table>
                    {this.renderMonthHeader()}
                    {this.renderMonthBody()}
                </table>
            </div>
        );
    }
}