// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js";

/** @var {object} months Months in multiple locations. */
let months = {
    en: [
        { id_month: 1, name: 'January', short: 'Jan' },
        { id_month: 2, name: 'February', short: 'Feb' },
        { id_month: 3, name: 'March', short: 'Mar' },
        { id_month: 4, name: 'April', short: 'Apr' },
        { id_month: 5, name: 'May', short: 'May' },
        { id_month: 6, name: 'June', short: 'Jun' },
        { id_month: 7, name: 'July', short: 'Jul' },
        { id_month: 8, name: 'August', short: 'Aug' },
        { id_month: 9, name: 'September', short: 'Sep' },
        { id_month: 10, name: 'October', short: 'Oct' },
        { id_month: 11, name: 'November', short: 'Nov' },
        { id_month: 12, name: 'December', short: 'Dec' },
    ], es: [
        { id_month: 0, name: 'Enero', short: 'Ene' },
        { id_month: 2, name: 'Febrero', short: 'Feb' },
        { id_month: 3, name: 'Marzo', short: 'Maz' },
        { id_month: 4, name: 'Abril', short: 'Abr' },
        { id_month: 5, name: 'Mayo', short: 'May' },
        { id_month: 6, name: 'Junio', short: 'Jun' },
        { id_month: 7, name: 'Julio', short: 'Jul' },
        { id_month: 8, name: 'Agosto', short: 'Ago' },
        { id_month: 9, name: 'Septiembre', short: 'Sep' },
        { id_month: 10, name: 'Octubre', short: 'Oct' },
        { id_month: 11, name: 'Noviembre', short: 'Nov' },
        { id_month: 12, name: 'Diciembre', short: 'Dic' },
    ],
};

/** @var {object} days Days in multiple locations. */
let days = {
    en: [
        { id_day: 0, name: 'Sunday', short: 'Sun', letter: 'S' },
        { id_day: 1, name: 'Monday', short: 'Mon', letter: 'M' },
        { id_day: 2, name: 'Tuesday', short: 'Tue', letter: 'T' },
        { id_day: 3, name: 'Wednesday', short: 'Wed', letter: 'W' },
        { id_day: 4, name: 'Thursday', short: 'Thu', letter: 'X' },
        { id_day: 5, name: 'Friday', short: 'Fri', letter: 'F' },
        { id_day: 6, name: 'Saturday', short: 'Sat', letter: 'S' },
    ], es: [
        { id_day: 0, name: 'Domingo', short: 'Dom', letter: 'D' },
        { id_day: 1, name: 'Lunes', short: 'Lun', letter: 'L' },
        { id_day: 2, name: 'Martes', short: 'Mar', letter: 'M' },
        { id_day: 3, name: 'Miércoles', short: 'Mie', letter: 'X' },
        { id_day: 4, name: 'Jueves', short: 'Jue', letter: 'J' },
        { id_day: 5, name: 'Vierne', short: 'Vie', letter: 'V' },
        { id_day: 6, name: 'Sábado', short: 'Sab', letter: 'S' },
    ],
};

/** @var {object} defaultProps Default InputDateMaker properties. */
let defaultProps = {
    id: 'calendar-1',
    lang: 'en',
    // ? datesFilter: false,
    availableWeekDays: [],
    // TODO availableDates: [],
    date: new Date(),
    today: new Date(),
    // TODO button_prev: null,
    // TODO button_next: null,
};

/**
 * * InputDateMaker makes an excellent substitute for the <input> type date.
 * @export
 * @class InputDateMaker
 * @extends {Class}
 * @author Juan Cruz Armentia <juancarmentia@gmail.com>
 */
export class InputDateMaker extends Class {
    /**
     * * Creates an instance of InputDateMaker.
     * @param {object} [props] InputDateMaker properties:
     * @param {string} [id='calendar-1'] Input HTML element primary key.
     * @param {string} [lang='en'] Calendar location.
     * @param {object} [availableWeekDays] Calendar available week days.
     * @param {date} [today] Today's date.
     * @param {object} [state] InputDateMaker state:
     * @param {boolean} [enablePastDates=true] Enable past dates.
     * @param {object} [callback] InputDateMaker callback:
     * @param {fuction} [function] On change date function callback.
     * @param {object} [params] On change date function callback params.
     * @memberof InputDateMaker
     */
    constructor (props = {
        id: 'calendar-1',
        lang: 'en',
        availableWeekDays: [],
        today: new Date(),
    }, state = {
        enablePastDates: true,
    }, callback = {
        function: function (e) { console.log('Date changed') },
        params: {
            //
    }}) {
        super({ ...defaultProps, ...props }, state);
        this.setCallbacks({ default: callback });
        this.setHTML(`#${ this.props.id }`);
        this.generateMonthDays(new Date());
        this.generateInnerHTML();
        this.changeHTMLValue(this.props.today.toISOString().substring(0, 10));
    }

    /**
     * * Makes the first & last month day.
     * @param {date} date
     * @memberof InputDateMaker
     */
    generateMonthDays (date) {
        date.setDate(1);
        this.setProps('firstMonthDay', new Date(date));
        let dayNumber = date.getDay() + 1;
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1)
        this.setProps('lastMonthDay', new Date(date));
        this.setProps('days', date.getDate() + dayNumber);
    }

    /**
     * * Makes the calendar.
     * @memberof InputDateMaker
     */
    generateInnerHTML () {
        let parent = this.html.parentNode;
        if (this.calendar) {
            parent.removeChild(this.calendar);
        }
        this.calendar = document.createElement('div');
        this.calendar.classList.add('calendar', 'grid', 'grid-cols-1');
        parent.insertBefore(this.calendar, this.html.nextSibling);
        this.printHeader();
        this.printMain();
    }

    /**
     * * Makes the calendar header.
     * @memberof InputDateMaker
     */
    printHeader () {
        let instance = this;
        let header = document.createElement('section');
        header.classList.add('month', 'grid', 'grid-cols-7', 'mb-4');
        this.calendar.appendChild(header);
        this.printArrows();
            let buttonDiv = document.createElement('div');
            buttonDiv.classList.add('flex', 'justify-center', 'items-center');
            header.appendChild(buttonDiv);
                let prev = document.createElement('button');
                buttonDiv.appendChild(prev);
                prev.classList.add('mb-4');
                prev.addEventListener('click', function (e) {
                    e.preventDefault();
                    instance.changeMonth(-1);
                });
                    let icon = document.createElement('i');
                    icon.classList.add('fas', 'fa-chevron-left');
                    prev.appendChild(icon);
            let title = document.createElement('span');
            header.appendChild(title);
            title.classList.add('flex', 'justify-center', 'items-center', 'col-span-5', 'color-white', 'mb-4');
            title.innerHTML = `${ months[this.props.lang][this.props.firstMonthDay.getMonth()].name } ${ this.props.firstMonthDay.getFullYear() }`;
            buttonDiv = document.createElement('div');
            buttonDiv.classList.add('flex', 'justify-center', 'items-center');
            header.appendChild(buttonDiv);
                let next = document.createElement('button');
                buttonDiv.appendChild(next);
                next.classList.add('mb-4');
                next.addEventListener('click', function (e) {
                    e.preventDefault();
                    instance.changeMonth(+1);
                });
                    icon = document.createElement('i');
                    icon.classList.add('fas', 'fa-chevron-right');
                    next.appendChild(icon);
            let daysDiv = document.createElement('div');
            daysDiv.classList.add('col-span-7', 'grid', 'grid-cols-7', 'gap-2', 'xl:gap-4', 'color-white');
            header.appendChild(daysDiv);
                for (const day of days[this.props.lang]) {
                    let dayDiv = document.createElement('div');
                    dayDiv.innerHTML = day.letter;
                    dayDiv.classList.add('flex', 'justify-center', 'items-center');
                    daysDiv.appendChild(dayDiv);
                }
    }

    /**
     * * Makes the calendar main.
     * @memberof InputDateMaker
     */
    printMain () {
        let instance = this;
        let main = document.createElement('section');
        main.classList.add('days', 'grid', 'grid-cols-7', 'gap-2', 'xl:gap-4');
        this.calendar.appendChild(main);
        for (let day = 1; day <= this.props.days; day++) {
            let date = document.createElement('div');
            date.classList.add('date');
            if (this.props.today.getMonth() === this.props.firstMonthDay.getMonth() && day - this.props.firstMonthDay.getDay() === this.props.today.getDate()) {
                date.classList.add('today');
            }
            main.appendChild(date);
                if (day - this.props.firstMonthDay.getDay() > 0 && day - this.props.firstMonthDay.getDay() <= this.props.lastMonthDay.getDate()) {
                    let input = document.createElement('input');
                    input.id = `day-${ day }`;
                    input.type = 'radio';
                    input.name = 'calendar-day';
                    input.value = day - this.props.firstMonthDay.getDay();
                    input.addEventListener('change', function (e) {
                        instance.detect();
                    })
                    if (this.html.value) {
                        let dateValue = this.html.value.split('-');
                        if (parseInt(dateValue[0]) === this.props.firstMonthDay.getFullYear() && parseInt(dateValue[1]) === this.props.firstMonthDay.getMonth() + 1 && parseInt(dateValue[2]) === day - this.props.firstMonthDay.getDay()) {
                            input.checked = true;
                        }
                    } else if (this.props.today.getMonth() === this.props.firstMonthDay.getMonth() && day - this.props.firstMonthDay.getDay() === this.props.today.getDate() && !this.html.value) {
                        input.checked = true;
                    }
                    let label = document.createElement('label');
                    label.classList.add('btn-date');
                    label.htmlFor = `day-${ day }`;
                        let span = document.createElement('span');
                        span.innerHTML = day - this.props.firstMonthDay.getDay();
                    if (this.props.availableWeekDays.length) {
                        input.disabled = true;
                        for (const dayAvailable of this.props.availableWeekDays) {
                            if ((day % 7 === 0 ? 7 : day % 7) === dayAvailable + 1) {
                                input.disabled = false;
                            }
                        }
                        date.appendChild(input);
                        date.appendChild(label);
                        label.appendChild(span);
                    } else {
                        date.appendChild(input);
                        date.appendChild(label);
                        label.appendChild(span);
                    }
                    if (this.state.enablePastDates) {
                        if (day - this.props.firstMonthDay.getDay() < 1 || this.props.firstMonthDay.getMonth() < this.props.today.getMonth()) {
                            input.disabled = true;
                        }
                    }
                }
        }
    }

    /**
     * * Makes a new <input> value.
     * @memberof InputDateMaker
     */
    detect () {
        this.changeHTMLValue(`${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (document.querySelector(`#${ this.props.id } + .calendar input[type=radio]:checked`).value < 10 ? `0${ document.querySelector(`#${ this.props.id } + .calendar input[type=radio]:checked`).value }` : document.querySelector(`#${ this.props.id } + .calendar input[type=radio]:checked`).value) }`);
    }

    /**
     * * Change the calendar current month.
     * @param {number} plus Months to add.
     * @memberof InputDateMaker
     */
    changeMonth (plus) {
        let date = new Date(this.props.firstMonthDay);
        date.setMonth(date.getMonth() + plus);
        this.generateMonthDays(date);
        this.generateInnerHTML();
    }

    /**
     * * Change the <input> value.
     * @param {string} value <input> new value.
     * @memberof InputDateMaker
     */
    changeHTMLValue (value) {
        this.html.value = value;
        this.callbacks.default.function({ ...this.callbacks.default.params, inputDateMaker: this });
    }
}

// ? Default export 
export default InputDateMaker;