/**
 * @param {Date} birthday - date to calculate in age
 * @return {Number} age
 * */
export function calculateAge(birthday) {
	const ageDifMs = Date.now() - birthday.getTime();
	const ageDate = new Date(ageDifMs);

	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * Get the avatar by the id given by parameter
 * @param {number} avatarId - the id of the avatar we want find
 * @param {object} avatarsList - the list of avatars to check, from the props
 * @return {object | null} the avatar find in the list
 * */
export function getAvatarById(avatarId, avatarsList) {
	let avatarSelected = null;

	for (let i = 0; i < avatarsList.length; i++) {
		const avatar = avatarsList[i];
		if (avatar.avatarId === avatarId) {
			avatarSelected = avatar;
			break;
		}
	}

	return avatarSelected;
}
