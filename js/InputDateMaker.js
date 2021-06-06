// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js";

// ? InputDateMaker repository
import Months from "./Months.js";
import Week from "./Week.js";

/**
 * * InputDateMaker makes an excellent substitute for the <input> type date.
 * @export
 * @class InputDateMaker
 * @author Juan Cruz Armentia <juancarmentia@gmail.com>
 * @extends {Class}
 */
export class InputDateMaker extends Class {
    /**
     * * Creates an instance of InputDateMaker.
     * @param {object} [props] InputDateMaker properties:
     * @param {string} [props.id='input-1'] Input HTML element primary key.
     * @param {string} [props.lang='en'] Calendar location.
     * @param {object} [props.availableWeekDays] Calendar available week days.
     * @param {date} [props.today] Today's date.
     * @param {string} [props.name] Input name.
     * @param {string[]} [props.classes] Input class names to add.
     * @param {number} [props.quantity=1] Quantity of dates to select.
     * @param {object} [state] InputDateMaker state:
     * @param {boolean} [state.enablePastDates=true] Enable past dates.
     * @param {boolean} [state.enableToday=true] Enable today's date.
     * @param {HTMLElement|false} [state.generate=false] If the Input has to be generated.
     * @param {boolean} [state.uncheck=true] Enable uncheck a date from the multiple selections.
     * @param {object} [callback] InputDateMaker callback:
     * @param {fuction} [callback.function] On change date function callback.
     * @param {*} [callback.params] On change date function callback params.
     * @memberof InputDateMaker
     */
    constructor (props = {
        id: 'input-1',
        lang: 'en',
        availableWeekDays: [],
        today: new Date(),
        name: 'date',
        classes: [],
        quantity: 1,
    }, state = {
        enablePastDates: true,
        enableToday: true,
        generate: false,
        uncheck: true,
    }, callback = {
        function: function (e) { /* console.log('Date changed') */ },
        params: {},
    }) {
        super({ ...InputDateMaker.props, ...props }, { ...InputDateMaker.state, ...state });
        this.setCallbacks({ default: { ...InputDateMaker.callback, ...callback } });
        this.checkState();
        this.setMonthDays(new Date());
        this.createCalendar();
        if (this.state.enableToday) {
            for (const day of this.days) {
                if (day.value === this.props.today.getDate()) {
                    this.changeValue(day.id);
                }
            }
        }
    }

    /**
     * * Set an <input>
     * @param {HTMLElement} html
     * @memberof InputDateMaker
     */
    setHTMLs (html = null) {
        if (!this.htmls) {
            this.htmls = [];
        }
        if (html !== null) {
            this.htmls.push(html);
        }
        if (html === null) {
            console.error("Param must be an HTML Element");
        }
    }

    /**
     * * Makes the first & last month day.
     * @param {date} date
     * @memberof InputDateMaker
     */
    setMonthDays (date) {
        date.setDate(1);
        this.setProps('firstMonthDay', new Date(date));
        let dayNumber = date.getDay() + 1;
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1)
        this.setProps('lastMonthDay', new Date(date));
        this.setProps('days', date.getDate() + dayNumber);
    }

    /**
     * * Check the InputDateMaker state.
     * @memberof InputDateMaker
     */
    checkState () {
        this.checkGenerateState();
    }

    /**
     * * Check the generate <input> state
     * @memberof InputDateMaker
     */
    checkGenerateState () {
        if (this.state.generate) {
            this.createHTMLs();
        }
        if (!this.state.generate) {
            for (const key in document.querySelectorAll(`input.${ this.props.id }`)) {
                if (Object.hasOwnProperty.call(document.querySelectorAll(`input.${ this.props.id }`), key)) {
                    const html = document.querySelectorAll(`input.${ this.props.id }`)[key];
                    if (parseInt(key) < this.props.quantity) {
                        this.setHTMLs(html);
                    }
                }
            }
        }
    }

    /**
     * * Creates an <input>
     * @param {number} [length=1] Quantity of <input> to create.
     * @memberof InputDateMaker
     */
    createHTMLs () {
        for (let index = 0; index < this.props.quantity; index++) {
            let html = document.createElement('input');
            html.classList.add("hidden");
            for (const className of this.props.classes) {
                html.classList.add(className);
            }
            html.name = this.props.name;
            html.type = 'date';
            this.state.generate.appendChild(html);
            this.setHTMLs(html);
        }
    }

    /**
     * * Makes the calendar.
     * @memberof InputDateMaker
     */
    createCalendar () {
        let parent = this.htmls[0].parentNode;
        if (this.calendar) {
            parent.removeChild(this.calendar);
        }
        this.calendar = document.createElement('aside');
        this.calendar.classList.add("calendar-input");
        parent.insertBefore(this.calendar, this.htmls[0]);
        this.printHeader();
        this.printMain();
    }

    /**
     * * Makes the calendar header.
     * @memberof InputDateMaker
     */
    printHeader () {
        let instance = this;
        let header = document.createElement('header');
        header.classList.add("month");
        this.calendar.appendChild(header);
            let prevDiv = document.createElement('div');
            header.appendChild(prevDiv);
                let prev = document.createElement('button');
                prevDiv.appendChild(prev);
                prev.addEventListener('click', function (e) {
                    e.preventDefault();
                    instance.changeMonth(-1);
                });
                    let icon = document.createElement('i');
                    icon.classList.add("fas", "fa-chevron-left");
                    prev.appendChild(icon);

            let title = document.createElement('span');
            header.appendChild(title);
            title.classList.add("name");
            title.innerHTML = `${ Months[this.props.lang][this.props.firstMonthDay.getMonth()].name } ${ this.props.firstMonthDay.getFullYear() }`;

            let nextDiv = document.createElement('div');
            header.appendChild(nextDiv);
                let next = document.createElement('button');
                nextDiv.appendChild(next);
                next.addEventListener('click', function (e) {
                    e.preventDefault();
                    instance.changeMonth(+1);
                });
                    icon = document.createElement('i');
                    icon.classList.add("fas", "fa-chevron-right");
                    next.appendChild(icon);

            let days = document.createElement('div');
            days.classList.add("week-names");
            header.appendChild(days);
                for (const day of Week[this.props.lang]) {
                    let span = document.createElement('span');
                    span.innerHTML = day.letter;
                    days.appendChild(span);
                }
    }

    /**
     * * Makes the calendar main.
     * @memberof InputDateMaker
     */
    printMain () {
        this.inputs = [];
        let instance = this;
        let main = document.createElement('main');
        main.classList.add("days");
        this.calendar.appendChild(main);
        this.days = [];
        for (let day = 1; day <= this.props.days; day++) {
            let date = document.createElement('label');
            date.classList.add("date");
            if (this.props.today.getMonth() === this.props.firstMonthDay.getMonth() && day - this.props.firstMonthDay.getDay() === this.props.today.getDate()) {
                date.classList.add("today");
            }
            main.appendChild(date);
                if (day - this.props.firstMonthDay.getDay() > 0 && day - this.props.firstMonthDay.getDay() <= this.props.lastMonthDay.getDate()) {
                    let input = document.createElement('input');
                    this.inputs.push(input);
                    input.dataset.date = `${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (day - this.props.firstMonthDay.getDay() < 10 ? `0${ day - this.props.firstMonthDay.getDay() }` : day - this.props.firstMonthDay.getDay()) }`;
                    input.id = `${ this.props.id }-day-${ day }`;
                    if (this.props.quantity > 1) {
                        input.type = 'checkbox';
                        input.name = `${ this.props.id }-calendar-day[${ day - this.props.firstMonthDay.getDay() }]`;
                    }
                    if (this.props.quantity <= 1) {
                        input.type = 'radio';
                        input.name = `${ this.props.id }-calendar-day`;
                    }
                    input.value = day - this.props.firstMonthDay.getDay();
                    input.classList.add("hidden", "date-input");
                    input.addEventListener('change', function (e) {
                        instance.changeValue(`${ instance.props.id }-day-${ day }`);
                    });
                    this.days.push(input);

                    let number = document.createElement('span');
                    number.classList.add("date-btn");
                    number.innerHTML = day - this.props.firstMonthDay.getDay();
                    for (const html of this.htmls) {
                        if (html.value) {
                            let value = html.value.split('-');
                            if (parseInt(value[0]) === this.props.firstMonthDay.getFullYear() && parseInt(value[1]) === this.props.firstMonthDay.getMonth() + 1 && parseInt(value[2]) === day - this.props.firstMonthDay.getDay()) {
                                input.checked = true;
                            }
                        }
                        if (this.props.today.getMonth() === this.props.firstMonthDay.getMonth() && day - this.props.firstMonthDay.getDay() === this.props.today.getDate() && !html.value) {
                            input.checked = true;
                        }
                    }
                    if (this.props.availableWeekDays.length) {
                        input.disabled = true;
                        for (const dayAvailable of this.props.availableWeekDays) {
                            if ((day % 7 === 0 ? 7 : day % 7) === dayAvailable + 1) {
                                input.disabled = false;
                            }
                        }
                        date.appendChild(input);
                        date.appendChild(number);
                    }
                    if (!this.props.availableWeekDays.length) {
                        date.appendChild(input);
                        date.appendChild(number);
                    }
                    if (!this.state.enablePastDates) {
                        if (day - this.props.firstMonthDay.getDay() < 1 || this.props.firstMonthDay.getMonth() < this.props.today.getMonth() || (day - this.props.firstMonthDay.getDay() < this.props.today.getDate() && this.props.firstMonthDay.getMonth() === this.props.today.getMonth())) {
                            input.disabled = true;
                            input.checked = false;
                        }
                    }
                    if (!this.state.enableToday) {
                        if (`${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (day - this.props.firstMonthDay.getDay() < 10 ? `0${ day - this.props.firstMonthDay.getDay() }` : day - this.props.firstMonthDay.getDay()) }` === `${ this.props.today.getFullYear() }-${ (this.props.today.getMonth() + 1 < 10 ? `0${ this.props.today.getMonth() + 1 }` : this.props.today.getMonth() + 1) }-${ (this.props.today.getDate() < 10 ? `0${ this.props.today.getDate() }` : this.props.today.getDate()) }`) {
                            input.disabled = true;
                            input.checked = false;
                        }
                    }
                }
        }
    }

    /**
     * * Change the calendar current month.
     * @param {number} plus Months to add.
     * @memberof InputDateMaker
     */
    changeMonth (plus) {
        let date = new Date(this.props.firstMonthDay);
        date.setMonth(date.getMonth() + plus);
        this.setMonthDays(date);
        this.createCalendar();
    }

    /**
     * * Change the <input> value.
     * @param {string} id_day <input> id.
     * @memberof InputDateMaker
     */
    changeValue (id_day = '') {
        this.setProps('selectedIndex', (this.props.selectedIndex ? this.props.selectedIndex : []));
        let day = document.querySelector(`input#${ id_day }`);
        for (const html of this.days) {
            html.classList.remove('selected');
        }
        day.classList.add('selected');
        let dates = [], selected = {};
        let date = `${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (parseInt(day.value) < 10 ? `0${ parseInt(day.value) }` : parseInt(day.value)) }`;
        if (day.checked) {
            for (const html of this.htmls) {
                if (html.value) {
                    dates.push(html.value);
                }
            }

            if (dates.length >= this.props.quantity) {
                let html = this.htmls.shift();
                this.props.selectedIndex.shift();
                html.value = date;
                let index = 1;
                for (const selectedIndex of this.props.selectedIndex) {
                    if (index <= parseInt(selectedIndex.index)) {
                        index = parseInt(selectedIndex.index) + 1;
                    }
                }
                this.props.selectedIndex.push({
                    index: index,
                    date: date,
                    input: day,
                });
                selected = this.props.selectedIndex[this.props.selectedIndex.length - 1];
                this.htmls.push(html);
            } else {
                let html = this.htmls.shift();
                html.value = date;
                let index = 1;
                for (const selectedIndex of this.props.selectedIndex) {
                    if (index <= parseInt(selectedIndex.index)) {
                        index = parseInt(selectedIndex.index) + 1;
                    }
                }
                this.props.selectedIndex.push({
                    index: index,
                    date: date,
                    input: day,
                });
                selected = this.props.selectedIndex[this.props.selectedIndex.length - 1];
                this.htmls.push(html);
            }

            days: for (const input of this.days) {
                if (!input.checked) {
                    continue;
                }
                for (const html of this.htmls) {
                    if (`${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (parseInt(input.value) < 10 ? `0${ parseInt(input.value) }` : parseInt(input.value)) }` === html.value) {
                        continue days;
                    }
                }
                input.checked = false;
            }
        }

        if (!day.checked) {
            let indexes = [], keys = [];
            if (this.state.uncheck) {
                for (const key in this.htmls) {
                    if (Object.hasOwnProperty.call(this.htmls, key)) {
                        const html = this.htmls[key];
                        if (html.value === date) {
                            html.value = null;
                            keys.push(key);
                        }
                    }
                }
                let remove = 0;
                for (const key of keys) {
                    selected = this.props.selectedIndex[key - remove];
                    this.props.selectedIndex.splice((key - remove), 1)[0];
                    remove++;
                }
            }

            if (!this.state.uncheck) {
                for (const key in [...this.props.selectedIndex]) {
                    if (Object.hasOwnProperty.call(this.props.selectedIndex, key)) {
                        const index = this.props.selectedIndex[key];
                        if (date === index.date) {
                            keys.push(key);
                            indexes.push(index);
                        }
                    }
                }
                let remove = 0;
                for (const key of keys) {
                    selected = this.props.selectedIndex[key - remove];
                    this.props.selectedIndex.splice((key - remove), 1)[0];
                    remove++;
                }
                for (const index of indexes) {
                    this.props.selectedIndex.push(index);
                }
                day.checked = true;
            }
        }

        dates = [];
        for (const html of this.htmls) {
            if (html.value) {
                dates.push(html.value);
            }
        }

        this.execute('default', {
            inputDateMaker: this,
            dates: dates,
            clicked: { state: day.checked, ...selected },
        });
    }

    /** 
     * @static
     * @var {object} props Default properties.
     */
    static props = {
        id: 'input-1',
        lang: 'en',
        availableWeekDays: [],
        date: new Date(),
        today: new Date(),
        name: 'date',
        classes: [],
        quantity: 1,
        // TODO availableDates: [],
        // TODO button_prev: null,
        // TODO button_next: null,
    }

    /** 
     * @static
     * @var {object} state Default state.
     */
    static state = {
        enablePastDates: true,
        enableToday: true,
        generate: false,
        uncheck: true,
    }

    /** 
     * @static
     * @var {object} callback Default callback.
     */
    static callback = {
        function: function (e) { /* console.log('Date changed') */ },
        params: {},
    }
}

// ? InputDateMaker childs
InputDateMaker.Months = Months;
InputDateMaker.Week = Week;

// ? Default export 
export default InputDateMaker;