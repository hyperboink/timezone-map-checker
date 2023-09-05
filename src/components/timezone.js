import {
	setClassToElements,
	setAllToClassElements,
	removeClass
} from '../utils/utils';

import { format, intlDate } from '../utils/date';

import moment from 'moment-timezone';

import { DateTime } from "luxon";

import { formatInTimeZone } from 'date-fns-tz';

import enGB from 'date-fns/locale/en-GB'

const DEFAULTS = {
	classes: {
		tzDate: 'tz-date',
		tzName: 'tz-name',
		tzAbbrev: 'tz-abbrev',
		tzOwn: 'own-date',
		plugins: 'tz-plugin',
		tzCountries: 'tz-map polygon',
	},
	current: {
		plugin: 'moment',
		timezone: moment.tz.guess()
	}
};

export default class Timezone{
	constructor(options){
		this.options = {...DEFAULTS, ...options};

		if(!this.options.current.timezone){
			this.options.current.timezone = 'America/Los_Angeles';
		}

		this.selectors = setClassToElements(this.options.classes);
		this.selectors.plugins = setAllToClassElements(this.options.classes.plugins);
		this.selectors.tzCountries = setAllToClassElements(this.options.classes.tzCountries);

		this.init();
		this.render();

	}

	init = () => {
		const { plugins, tzCountries } = this.selectors;

		this.options.current = {
			...this.options.current,
			...this.getMomentTimeZone(this.options.current.timezone)
		};

		Array.prototype.forEach.call(
			plugins,
			this.onClickPlugin
		);

		Array.prototype.forEach.call(
			tzCountries,
			this.onClickTimezone
		);
	}

	pluginTimezoneInit = (tz) => {
		let data;

		switch(this.options.current.plugin){
			case 'moment':
				data = this.getMomentTimeZone(tz);
				break;
			case 'luxon':
				data = this.getLuxonTimeZone(tz);
				break;
			case 'dateFns':
				data = this.getDateFnsTimeZone(tz);
				break;
			case 'intl':
				data = this.getDateIntlTimeZone(tz);
				break;
		}

		this.options.current = {...this.options.current, ...data};
	}

	onClickPlugin = (plugin) => {
		const { plugins } = this.selectors;

		plugin.addEventListener('click', (e) => {
			this.options.current.plugin = e.target.dataset.plugin;

			this.pluginTimezoneInit(this.options.current.timezone);

			removeClass(plugins, 'current');

			e.target.classList.add('current');

			this.render();
		});
	}

	onClickTimezone = (node) => {
		const { tzCountries } = this.selectors;

		node.addEventListener('click', (e) => {
			this.pluginTimezoneInit(e.target.dataset.timezone);

			removeClass(tzCountries, 'current');

			e.target.classList.add('current');

			this.render();
		});
	}

	getMomentTimeZone = (tz) => {
		var date = moment(new Date());
		var tz = tz || this.options.current.timezone;

	    return {
	    	date: moment(new Date()).tz(moment.tz.guess()).format('MM/DD/YY hh:mmA z'),
	    	timezoneDate: date.tz(tz).format('MM/DD/YYYY hh:mmA z'),
	    	timezone: tz,
	    	timezoneAbbrev: date.tz(tz).format('z')
	    };
	}

	getLuxonTimeZone = (tz) => {
		var tz = tz || this.options.current.timezone;

		return {
			date: DateTime.local().setZone(moment.tz.guess()).toFormat('MM/dd/yyyy hh:mma ZZZZ'),
			timezoneDate: DateTime.local().setZone(tz).toFormat('MM/dd/yyyy hh:mma ZZZZ'),
	    	timezone: tz,
	    	timezoneAbbrev: DateTime.local().setZone(tz).toFormat('ZZZZ')
		}
	}

	getDateFnsTimeZone = (tz) => {
		var tz = tz || this.options.current.timezone;

		return {
			date: formatInTimeZone(new Date(), moment.tz.guess(), 'MM/dd/yyyy hh:mma zzz', { locale: enGB }),
			timezoneDate: formatInTimeZone(new Date(), tz, 'MM/dd/yyyy hh:mma zzz', { locale: enGB }),
	    	timezone: tz,
	    	timezoneAbbrev: formatInTimeZone(new Date(), tz, 'zzz', { locale: enGB })
		}
	}

	getDateIntlTimeZone = (tz) => {
		const formatDateObj= (date) => {
			let dateSplit = date.replace(',', '').split(' ');

			return {
				date: dateSplit[0],
				time: dateSplit[1],
				meredian: dateSplit[2],
				timeZoneAbbrev: dateSplit[3]
			}
		}

		const fullDate = (dateObj) => `${dateObj.date} ${dateObj.time}${dateObj.meredian} ${dateObj.timeZoneAbbrev}`;

		let dateIntl = formatDateObj(intlDate());
		let dateIntlTz = formatDateObj(intlDate({ timeZone: tz}));

		return {
	    	date: fullDate(dateIntl),
	    	timezoneDate: fullDate(dateIntlTz),
	    	timezone: tz,
	    	timezoneAbbrev: dateIntlTz.timeZoneAbbrev
	    };

	}

	render = () => {
		const { tzDate, tzName, tzAbbrev, tzOwn } = this.selectors;

		tzDate.innerText = this.options.current.timezoneDate || '';
		tzName.innerText = this.options.current.timezone || '';
		tzAbbrev.innerText = this.options.current.timezoneAbbrev;
		tzOwn.innerText = this.options.current.date || '';
	}
}