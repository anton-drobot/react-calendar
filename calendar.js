import React from 'react';

export default class Calendar extends React.Component {
    static defaultProps = {
        date: new Date(),
        events: [],
        minDate: null,
        maxDate: null,
        weekStartsOn: 1,
        forceSixRows: false,
        months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ],
        daysOfTheWeek: [
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятника',
            'Суббота',
            'Воскресенье'
        ],
        daysOfTheWeekShort: [
            'Пн',
            'Вт',
            'Ср',
            'Чт',
            'Пт',
            'Сб',
            'Вс'
        ],
        today: new Date(),
        selectedDate: null
    };

    state = {
        date: this.props.date,
        selectedDate: this.props.selectedDate
    };

    getDay(date, weekStartsOn = 1) {
        const day = date.getDay();

        return (day < weekStartsOn ? 7 : 0) + day - this.props.weekStartsOn;
    }

    getDaysInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        return new Date(year, month + 1, 0).getDate();
    }

    getLocalizedMonth(month) {
        return this.props.months[month];
    }

    getLocalizedDay(day) {
        return this.props.daysOfTheWeek[day];
    }

    getLocalizedDayShort(day) {
        return this.props.daysOfTheWeekShort[day];
    }

    getDateString(date) {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }

            return number;
        }

        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
    }

    addDays(dirtyDate, amount) {
        const date = new Date(dirtyDate.getFullYear(), dirtyDate.getMonth(), dirtyDate.getDate());
        date.setDate(date.getDate() + amount);

        return date;
    }

    getItems() {
        const year = this.state.date.getFullYear();
        const month = this.state.date.getMonth();

        const firstDayOfMonth = this.getDay(new Date(year, month));
        const daysInMonth = this.getDaysInMonth(this.state.date);
        const startOfWeek = new Date(year, month, 1 - firstDayOfMonth);
        const amountOfDays = !this.props.forceSixRows ? daysInMonth + firstDayOfMonth + (6 - this.getDay(new Date(year, month, daysInMonth))) : 42;

        const days = [];

        for (let i = 0; i < amountOfDays; i++) {
            days.push(this.addDays(startOfWeek, i));
        }

        return days;
    }

    getDayOfTheWeekClasses(index) {
        const classes = [
            'calendar__grid-item',
            'calendar__grid-item--day',
            'calendar__grid-item--day-' + (index % 7 + 1)
        ];

        return classes.join(' ');
    }

    getDayClasses(date, index) {
        const classes = [
            'calendar__grid-item',
            'calendar__grid-item--' + this.getDateString(date),
            'calendar__grid-item--day-' + (index % 7 + 1)
        ];

        if (date === this.props.today) {
            classes.push('calendar__grid-item--today');
        }

        if (date.getMonth() < this.state.date.getMonth()) {
            classes.push('calendar__grid-item--previous-month');
        }

        if (date.getMonth() > this.state.date.getMonth()) {
            classes.push('calendar__grid-item--next-month');
        }

        if (this.props.events.indexOf(this.getDateString(date)) >= 0)
        {
            classes.push('calendar__grid-item--event');
        }

        if (this.state.selectedDate && this.state.selectedDate.getTime() === date.getTime())
        {
            classes.push('calendar__grid-item--selected');
        }

        return classes.join(' ');
    }

    getPreviousMonthButtonClasses() {
        const classes = [
            'calendar__button',
            'calendar__button--previous-month'
        ];

        if (this.isMinDate()) {
            classes.push('calendar__button--disabled');
        }

        return classes.join(' ');
    }

    getNextMonthButtonClasses() {
        const classes = [
            'calendar__button',
            'calendar__button--next-month'
        ];

        if (this.isMaxDate()) {
            classes.push('calendar__button--disabled');
        }

        return classes.join(' ');
    }

    isMinDate() {
        if (this.props.minDate) {
            const stateDate = new Date(this.state.date.getFullYear(), this.state.date.getMonth());
            const minDate = new Date(this.props.minDate.getFullYear(), this.props.minDate.getMonth());

            if (stateDate.getTime() === minDate.getTime()) {
                return true;
            }
        }

        return false;
    }

    isMaxDate() {
        if (this.props.maxDate) {
            const stateDate = new Date(this.state.date.getFullYear(), this.state.date.getMonth());
            const maxDate = new Date(this.props.maxDate.getFullYear(), this.props.maxDate.getMonth());

            if (stateDate.getTime() === maxDate.getTime()) {
                return true;
            }
        }

        return false;
    }

    previousMonth = () => {
        if (this.isMinDate()) {
            return;
        }

        this.state.date.setMonth(this.state.date.getMonth() - 1);

        this.setState({
            date: this.state.date
        });
    };

    nextMonth = () => {
        if (this.isMaxDate()) {
            return;
        }

        this.state.date.setMonth(this.state.date.getMonth() + 1);

        this.setState({
            date: this.state.date
        });
    };

    clickOnDay = (date) => {
        if (this.state.selectedDate && this.state.selectedDate.getTime() === date.getTime()) {
            this.setState({
                selectedDate: null
            });

            return;
        }

        if (this.props.events.indexOf(this.getDateString(date)) >= 0) {
            this.setState({
                selectedDate: date
            });
        }
    };

    render() {
        return (
            <div className="calendar">
                <div className="calendar__controls">
                    <div className="calendar__month">{this.getLocalizedMonth(this.state.date.getMonth())} {this.state.date.getFullYear()}</div>
                    <div className={this.getPreviousMonthButtonClasses()} onClick={this.previousMonth}>
                        <span className="icon icon--calendar-previous" />
                    </div>
                    <div className={this.getNextMonthButtonClasses()} onClick={this.nextMonth}>
                        <span className="icon icon--calendar-next" />
                    </div>
                </div>
                <div className="calendar__grid">
                    {this.props.daysOfTheWeekShort.map((day, index) =>
                        <div key={index} className={this.getDayOfTheWeekClasses(index)}>{day}</div>
                    )}
                    {this.getItems().map((date, index) =>
                        <div key={index} className={this.getDayClasses(date, index)} onClick={this.clickOnDay.bind(this, date)}>{date.getDate()}</div>
                    )}
                </div>
            </div>
        );
    }
}
