export const intlDate = (options, date) => {
	const defaults = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		timeZoneName: 'short',
	}

	return new Intl.DateTimeFormat('default', {...defaults, ...options}).format(date || new Date());
};
