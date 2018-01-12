/**
 * @param {Date} birthday - date to calculate in age
 * @return {Number} age
 * */
export function calculateAge(birthday) {
	const ageDifMs = Date.now() - birthday.getTime();
	const ageDate = new Date(ageDifMs);

	return Math.abs(ageDate.getUTCFullYear() - 1970);
}
