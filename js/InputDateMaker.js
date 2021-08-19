// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js";

// ? External repositories
import { Html } from "../../HTMLCreatorJS/js/HTMLCreator.js";

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
export default class InputDateMaker extends Class {
    /**
     * * Creates an instance of InputDateMaker.
     * @param {object} [data.props]
     * @param {string} [data.props.id="input-1"] <input> primary key.
     * @param {string} [data.props.lang="en"]
     * @param {object} [data.props.availableWeekDays]
     * @param {Date} [data.props.today]
     * @param {string} [data.props.name] <input> name.
     * @param {object} [data.props.classes] InputDateMaker class names.
     * @param {string[]} [data.props.classes.arrows] Calendar arrows class names.
     * @param {string[]} [data.props.classes.calendar] Calendar class names.
     * @param {string[]} [data.props.classes.day] Calendar day class names.
     * @param {string[]} [data.props.classes.days] Calendar days box class names.
     * @param {string[]} [data.props.classes.input] <input> class names.
     * @param {string[]} [data.props.classes.left-arrow] Calendar left arrow class names.
     * @param {string[]} [data.props.classes.month] Calendar month class names.
     * @param {string[]} [data.props.classes.right-arrow] Calendar right arrow class names.
     * @param {string[]} [data.props.classes.title] Calendar month title class names.
     * @param {string[]} [data.props.classes.week] Calendar week class names.
     * @param {number} [data.props.quantity=1] Quantity of dates to select.
     * @param {object} [data.state]
     * @param {boolean} [data.state.enablePastDates=true] If the past dates have to be enable.
     * @param {boolean} [data.state.enableToday=true] If today"s date has to be enable.
     * @param {HTMLElement|false} [data.state.generate=false] If the Input has to be generated.
     * @param {boolean} [data.state.uncheck=true] If When click one of the multiple <inputs> has to uncheck it.
     * @param {object} [data.callbacks]
     * @param {object} [data.callbacks.add] On add callback:
     * @param {fuction} [data.callbacks.add.function] On add function callback.
     * @param {*} [data.callbacks.add.params] On add function callback params.
     * @param {object} [data.callbacks.changeMonth] On change month callback:
     * @param {fuction} [data.callbacks.changeMonth.function] On change month function callback.
     * @param {*} [data.callbacks.changeMonth.params] On change month function callback params.
     * @param {object} [data.callbacks.remove] On remove callback:
     * @param {fuction} [data.callbacks.remove.function] On remove function callback.
     * @param {*} [data.callbacks.remove.params] On remove function callback params.
     * @param {object} [data.callbacks.update] On update callback:
     * @param {fuction} [data.callbacks.update.function] On update function callback.
     * @param {*} [data.callbacks.update.params] On update function callback params.
     * @memberof InputDateMaker
     */
    constructor (data = {
        props: {
            availableWeekDays: [],
            classes: {
                arrows: [],
                calendar: [],
                day: [],
                days: [],
                input: [],
                "left-arrow": [],
                month: [],
                "right-arrow": [],
                title: [],
                week: [],
            }, id: "input-1",
            lang: "en",
            name: "date",
            today: new Date(),
            quantity: 1,
        }, state: {
            enablePastDates: true,
            enableToday: true,
            generate: false,
            uncheck: true,
        }, callbacks: {
            add: {
                function: function (params = {}) { /* console.log("Added Date") */ },
                params: {},
            }, changeMonth: {
                function: function (params = {}) { /* console.log("Month changed") */ },
                params: {},
            }, remove: {
                function: function (params = {}) { /* console.log("Removed Date") */ },
                params: {},
            }, update: {
                function: function (params = {}) { /* console.log("Date updated") */ },
                params: {},
    },}}) {
        // * Instance
        super({ ...InputDateMaker.props, ...(data.hasOwnProperty("props") ? { ...data.props, classes: {...InputDateMaker.props.classes, ...(data.props.hasOwnProperty("classes") ? data.props.classes : [])} } : {}) }, { ...InputDateMaker.state, ...(data.hasOwnProperty("state") ? data.state : {}) });
        this.setCallbacks({ ...InputDateMaker.callbacks, ...(data.hasOwnProperty("callbacks") ? data.callbacks : {}) });

        // * Set the data
        this.setMonthDays(this.props.today);
        this.checkState();
        this.setCalendar();
        if (this.state.enableToday) {
            for (const day of this.days) {
                if (day.value === this.props.today.getDate()) {
                    this.add(`${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ day.value }`);
                }
            }
        }
    }

    /**
     * * Set an <input>
     * @param {HTMLElement} html
     * @returns {boolean}
     * @memberof InputDateMaker
     */
    setHTMLs (html = null) {
        // ? If there was not <inputs> saved
        if (!this.htmls) {
            this.htmls = [];
        }

        // ? If the <input> to save is not null
        if (html !== null) {
            // * Save it
            this.htmls.push(html);
            return true;
        }
        // ? If the <input> to save is null
        if (html === null) {
            // * Returns error
            console.error("Param must be an HTML Element");
            return false;
        }
    }

    /**
     * * Makes the first & last month day.
     * @param {Date} [date]
     * @memberof InputDateMaker
     */
    setMonthDays (date = new Date()) {
        // * Creates a new Date
        date = new Date(date);

        // * Set the current month first day
        date.setDate(1);
        this.setProps("firstMonthDay", new Date(date));

        // * Set the current month last day
        let dayNumber = date.getDay() + 1;
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1)
        this.setProps("lastMonthDay", new Date(date));

        // * Set the current month quantity of days
        this.setProps("days", date.getDate() + dayNumber);
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
        // ? If must generete the HTMLs
        if (this.state.generate) {
            this.createHTMLs();
        }
        // ? If must find the HTMLs
        if (!this.state.generate) {
            // * Get the <inputs>
            let htmls = InputDateMaker.querySelector(this.props.id);

            // * Loop the <inputs>
            for (const key in htmls) {
                if (Object.hasOwnProperty.call(htmls, key)) {
                    const html = htmls[key];

                    // ? If an <input> can be saved
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
        // * Loop the quantity of <inputs> to create
        for (let index = 0; index < this.props.quantity; index++) {
            // * Create a new <input>
            let input = new Html("input", {
                props: {
                    classes: ["hidden", ...this.props.classes.input],
                    name: this.props.name,
                    type: "date",
                },
            });

            // * Save it
            this.state.generate.appendChild(input.html);
            this.setHTMLs(input.html);
        }
    }

    /**
     * * Makes the calendar.
     * @memberof InputDateMaker
     */
    setCalendar () {
        // * Get the parent node
        let parent = this.htmls[0].parentNode;

        // ? If there was a calendar 
        if (this.calendar) {
            // * Remove it
            parent.removeChild(this.calendar);
        }

        // * Create a new calendar
        this.calendar = new Html("aside", {
            props: {
                classes: ["calendar-input", ...this.props.classes.calendar],
            },
        }).html;
        
        // * Save it
        parent.insertBefore(this.calendar, this.htmls[0]);

        // * Print the calendar content
        this.printHeader();
        this.printMain();
    }

    /**
     * * Makes the calendar header.
     * @memberof InputDateMaker
     */
    printHeader () {
        // * Create the calendar header
        let header = new Html("header", {
            props: {
                classes: ["month", ...this.props.classes.month],
            }, innerHTML: [
                ["div", {
                    innerHTML: [
                        ["button", {
                            props: {
                                classes: [...this.props.classes.arrows, ...this.props.classes["left-arrow"]],
                            }, callback: {
                                function: (params) => { this.changeMonth(params.plus) },
                                params: {
                                    plus: -1,
                                },
                            }, innerHTML: [
                                ["icon", {
                                    props: {
                                        classes: ["fas", "fa-chevron-left"],
                                    },
                                }],
                            ],
                        }],
                    ],
                }], ["span", {
                    props: {
                        classes: ["name", ...this.props.classes.title],
                    }, innerHTML: `${ Months[this.props.lang][this.props.firstMonthDay.getMonth()].name } ${ this.props.firstMonthDay.getFullYear() }`,
                }], ["div", {
                    innerHTML: [
                        ["button", {
                            props: {
                                classes: [...this.props.classes.arrows, ...this.props.classes["right-arrow"]],
                            }, callback: {
                                function: (params) => { this.changeMonth(params.plus) },
                                params: {
                                    plus: +1,
                                },
                            }, innerHTML: [
                                ["icon", {
                                    props: {
                                        classes: ["fas", "fa-chevron-right"],
                                    },
                                }],
                            ],
                        }],
                    ],
                }], ["div", {
                    props: {
                        classes: ["week", ...this.props.classes.week],
                    }, innerHTML: (() => { let days = []; for (const day of Week[this.props.lang]) {
                        days.push(["span", {
                            innerHTML: day.letter,
                        }]);
                    } return days; })(),
                }],
            ],
        });

        // * Save it
        this.calendar.appendChild(header.html);
    }

    /**
     * * Makes the calendar main.
     * @memberof InputDateMaker
     */
    printMain () {
        let main = document.createElement("main");
        main.classList.add("days");
        this.calendar.appendChild(main);
        this.days = [];
        for (let day = 1; day <= this.props.days; day++) {
            let date = document.createElement("label");
            date.classList.add("date");
            if (this.props.today.getMonth() === this.props.firstMonthDay.getMonth() && day - this.props.firstMonthDay.getDay() === this.props.today.getDate()) {
                date.classList.add("today");
            }
            main.appendChild(date);
                if (day - this.props.firstMonthDay.getDay() > 0 && day - this.props.firstMonthDay.getDay() <= this.props.lastMonthDay.getDate()) {
                    let input = document.createElement("input");
                    input.dataset.date = `${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (day - this.props.firstMonthDay.getDay() < 10 ? `0${ day - this.props.firstMonthDay.getDay() }` : day - this.props.firstMonthDay.getDay()) }`;
                    input.id = `${ this.props.id }-day-${ day }`;
                    if (this.props.quantity > 1) {
                        input.type = "checkbox";
                        input.name = `${ this.props.id }-calendar-day[${ day - this.props.firstMonthDay.getDay() }]`;
                    }
                    if (this.props.quantity <= 1) {
                        input.type = "radio";
                        input.name = `${ this.props.id }-calendar-day`;
                    }
                    input.value = day - this.props.firstMonthDay.getDay();
                    input.classList.add("hidden", "date-input");
                    input.addEventListener("change", (e) => {
                        this.add(`${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (day - this.props.firstMonthDay.getDay() < 10 ? `0${ day - this.props.firstMonthDay.getDay() }` : day - this.props.firstMonthDay.getDay()) }`);
                    });
                    this.days.push(input);

                    let number = document.createElement("span");
                    number.classList.add("date-btn");
                    number.innerHTML = day - this.props.firstMonthDay.getDay();
                    for (const html of this.htmls) {
                        if (html.value) {
                            let value = html.value.split("-");
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
     * @param {number} [plus=+1] Months to add.
     * @param {object} [params] Change Month callback function params.
     * @memberof InputDateMaker
     */
    changeMonth (plus = +1, params = {}) {
        // * Get the next month
        let date = new Date(this.props.firstMonthDay);
        date.setMonth(date.getMonth() + plus);

        // * Save it
        this.setMonthDays(date);

        // * Create a new calendar
        this.setCalendar();

        // * Execute the change month callback
        this.execute("changeMonth", {
            inputDateMaker: this,
            ...this.callbacks.changeMonth.params,
            firstMonthDay: this.props.firstMonthDay,
            lastMonthDay: this.props.lastMonthDay,
            days: this.props.days,
            currentMonth: Months[this.props.lang][this.props.firstMonthDay.getMonth()],
            ...params,
        });
    }

    /**
     * * Add the <input> value.
     * @param {string} date
     * @param {object} params
     * @memberof InputDateMaker
     */
    add (date = "", params = {}) {
        // * Create the new Date
        date = new Date(`${ date }T00:00:00`);

        // * Create the parsed Date
        const parsed = `${ date.getFullYear() }-${ (date.getMonth() + 1 < 10 ? `0${ date.getMonth() + 1 }` : date.getMonth() + 1) }-${ (date.getDate() < 10 ? `0${ date.getDate() }` : date.getDate()) }`;

        // ? If there is not selected index
        if (!this.props.selectedIndex) {
            // * Set it
            this.setProps("selectedIndex", []);
        }

        // * Get the day <input>
        let day = document.querySelector(`input#${ this.props.id }-day-${ date.getDate() + this.props.firstMonthDay.getDay() }`);
        
        // * Select the correct one
        for (const html of this.days) {
            html.classList.remove("selected");
        }
        day.classList.add("selected");

        let selected = {};
        
        // ? If the day <input> is checked
        if (day.checked) {
            // ? If the dates are the same as the quantity
            if (this.props.selectedIndex.length >= this.props.quantity) {
                // * Get the first date <input>
                let html = this.htmls.shift();

                // * Update the value
                html.value = parsed;

                // * Save it
                this.htmls.push(html);

                // * Get a new index
                let index = 1;
                for (const selectedIndex of this.props.selectedIndex) {
                    if (index <= parseInt(selectedIndex.index)) {
                        index = parseInt(selectedIndex.index) + 1;
                    }
                }

                // * Remove the first selected index
                this.props.selectedIndex.shift();

                // * Save the new selected index
                this.props.selectedIndex.push({
                    index: index,
                    date: {
                        input: html,
                        parsed: parsed,
                        value: date,
                    }, day: {
                        input: day,
                        value: day.value,
                    },
                });
                selected = [...this.props.selectedIndex].pop();

            // ? If the dates are not the same as the quantity
            } else {
                // * Get the first date <input>
                let html = this.htmls.shift();

                // * Update the value
                html.value = parsed;

                // * Save it
                this.htmls.push(html);
                
                // * Get a new index
                let index = 1;
                for (const selectedIndex of this.props.selectedIndex) {
                    if (index <= parseInt(selectedIndex.index)) {
                        index = parseInt(selectedIndex.index) + 1;
                    }
                }

                // * Save the new selected index
                this.props.selectedIndex.push({
                    index: index,
                    date: {
                        input: html,
                        parsed: parsed,
                        value: date,
                    }, day: {
                        input: day,
                        value: day.value,
                    },
                });
                selected = [...this.props.selectedIndex].pop();
            }

            // * Loop the days
            days: for (const input of this.days) {
                // ? If the day <input> is unchecked
                if (!input.checked) {
                    continue;
                }

                // * Loop the date <inputs>
                for (const html of this.htmls) {
                    let dayDate = `${ this.props.firstMonthDay.getFullYear() }-${ (this.props.firstMonthDay.getMonth() + 1 < 10 ? `0${ this.props.firstMonthDay.getMonth() + 1 }` : this.props.firstMonthDay.getMonth() + 1) }-${ (parseInt(input.value) < 10 ? `0${ parseInt(input.value) }` : parseInt(input.value)) }`;
                    // ? If the day date if the same as the date
                    if (dayDate === html.value) {
                        continue days;
                    }
                }

                // * Uncheck the day <input>
                input.checked = false;
            }
        }

        // ? If the day <input> is unchecked
        if (!day.checked) {
            // * Loop the selected dates
            for (const key in this.props.selectedIndex) {
                if (Object.hasOwnProperty.call(this.props.selectedIndex, key)) {
                    selected = this.props.selectedIndex[key];

                    // ? If the selected index <input> value is the same as the current date
                    if (selected.date.parsed === parsed) {
                        this.props.selectedIndex.splice(key, 1);

                        // ? If is available uncheck
                        if (this.state.uncheck) {
                            // * Remove the value
                            selected.date.input.value = null;
                        }
                        // ? If is not available uncheck
                        if (!this.state.uncheck) {
                            // * Save it again
                            this.props.selectedIndex.push(selected);
                        }
                        break;
                    }
                }
            }

            // ? If is not available uncheck
            if (!this.state.uncheck) {
                // * Check the day <input>
                day.checked = true;
            }
        }

        // * Execute the add callback
        this.execute("add", {
            inputDateMaker: this,
            ...this.callbacks.add.params,
            dates: this.props.selectedIndex,
            current: { state: day.checked, ...selected },
            ...params,
        });

        // * Execute the update callback
        this.execute("update", {
            inputDateMaker: this,
            ...this.callbacks.update.params,
            dates: this.props.selectedIndex,
            current: { state: day.checked, ...selected },
            ...params,
        });

        return {
            inputDateMaker: this,
            dates: this.props.selectedIndex,
            current: { state: day.checked, ...selected },
            ...params,
        };
    }

    /**
     * * Remove the <input> value.
     * @param {string} date
     * @param {object} params
     * @memberof InputDateMaker
     */
    remove (date = "", params = {}) {
        // * Create the new Date
        date = new Date(`${ date }T00:00:00`);

        // * Create the parsed Date
        const parsed = `${ date.getFullYear() }-${ (date.getMonth() + 1 < 10 ? `0${ date.getMonth() + 1 }` : date.getMonth() + 1) }-${ (date.getDate() < 10 ? `0${ date.getDate() }` : date.getDate()) }`;

        // * Get the day <input>
        let day = document.querySelector(`input#${ this.props.id }-day-${ date.getDate() + this.props.firstMonthDay.getDay() }`);
        
        // * Remove the select Day
        day.classList.remove("selected");

        let selected = {};
        
        // ? If the day <input> is checked
        if (day.checked) {
            // * Loop the selected dates
            for (const key in this.props.selectedIndex) {
                if (Object.hasOwnProperty.call(this.props.selectedIndex, key)) {
                    selected = this.props.selectedIndex[key];

                    // ? If the selected index <input> value is the same as the current date
                    if (selected.date.parsed === parsed) {
                        this.props.selectedIndex.splice(key, 1);
                        
                        // * Remove the value
                        selected.date.input.value = null;
                        break;
                    }
                }
            }

            // * Uncheck the Day
            day.checked = false;
        }

        // * Execute the remove callback
        this.execute("remove", {
            inputDateMaker: this,
            ...this.callbacks.remove.params,
            dates: this.props.selectedIndex,
            current: { state: day.checked, ...selected },
            ...params,
        });

        // * Execute the update callback
        this.execute("update", {
            inputDateMaker: this,
            ...this.callbacks.update.params,
            dates: this.props.selectedIndex,
            current: { state: day.checked, ...selected },
            ...params,
        });

        return {
            inputDateMaker: this,
            dates: this.props.selectedIndex,
            current: { state: day.checked, ...selected },
            ...params,
        };
    }

    /** 
     * * Returns all the InputDateMaker's <inputs> occurrences
     * @static
     * @param {string} [id="input-1"]
     * @returns {HTMLElement}
     */
    static querySelector (id = "input-1") {
        return document.querySelectorAll(`input.${ id }`);
    }

    /** 
     * @static
     * @var {object} props Default properties.
     */
    static props = {
        availableWeekDays: [],
        classes: {
            arrows: [],
            calendar: [],
            day: [],
            days: [],
            input: [],
            "left-arrow": [],
            month: [],
            "right-arrow": [],
            title: [],
            week: [],
        }, id: "input-1",
        lang: "en",
        name: "date",
        quantity: 1,
        today: new Date(),
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
     * @var {object} callbacks Default callbacks.
     */
    static callbacks = {
        add: {
            function: function (params = {}) { /* console.log("Added Date") */ },
            params: {},
        }, changeMonth: {
            function: function (params = {}) { /* console.log("Month changed") */ },
            params: {},
        }, remove: {
            function: function (params = {}) { /* console.log("Removed Date") */ },
            params: {},
        }, update: {
            function: function (params = {}) { /* console.log("Date updated") */ },
            params: {},
    },}

    // ? InputDateMaker childs
    static Months = Months;
    static Week = Week;
}