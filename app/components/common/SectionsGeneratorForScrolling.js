const selectors = [];
for (let i = 1; i < 6; i++) {
	selectors.push(`.cm-header-${i}`, `h${i}`);
}

export default class SectionsGeneratorForScrolling {
	/**
	 * Get the offset positions of the title in in editor and in the preview
	 * @param  {html} element - the target element in DOM (editor and preview)
	 * @param  {boolean} haveNewViewportInEditor - true when CodeMirror create new element in DOM at scroll
	 * @param  {array} prevArrTitlesinEditor - the last offset's titles if already scrolled
	 * @return {array} the offset's titles
	 * */
	static getOffsetTopTitles(element, haveNewViewportInEditor = false, prevArrTitlesinEditor = []) {
		const matches = element.querySelectorAll(selectors.join(', '));
		const reRenderingCmEditor = prevArrTitlesinEditor.length > 0 && haveNewViewportInEditor;
		let sections = [];
		let previous = 0;
		let lastPrevious = 0; // For when re-rendering in CM Editor

		if (reRenderingCmEditor) {
			lastPrevious = prevArrTitlesinEditor[prevArrTitlesinEditor.length - 1][1];
			sections = prevArrTitlesinEditor;
		}

		matches.forEach((title) => {
			const offsetTop = this.offsetTop(title, element);

			if (reRenderingCmEditor && offsetTop > lastPrevious) {
				// When re-rendering - for CM Editor, push only the last items:
				sections.push([lastPrevious, offsetTop]);
				lastPrevious = offsetTop;
			} else if ((element.className === 'CodeMirror-scroll' && prevArrTitlesinEditor.length === 0) || element.className !== 'CodeMirror-scroll') {
				// First time scrolled - for all:
				sections.push([previous, offsetTop]);
				previous = offsetTop;
			}
		});

		/* Logs:
		if (element.className === 'CodeMirror-scroll') console.log('sections ===> ', sections);
		if (element.className === 'CodeMirror-scroll' && typeof prevArrTitlesinEditor[prevArrTitlesinEditor.length - 1] !== 'undefined') console.log('last prev sections ===> ', prevArrTitlesinEditor[prevArrTitlesinEditor.length - 1][1]);
		*/

		// sections.push([previous, element.scrollHeight]);
		return sections;
	}

	static offsetTop(element, target, acc = 0) {
		if (element === target) return acc;
		return this.offsetTop(element.offsetParent, target, acc + element.offsetTop);
	}

	static getIndex(y, sections) {
		return sections.findIndex((section) => {
			return y >= section[0] && y <= section[1];
		});
	}

	/**
	 * For get the final target position in container (in pixel)
	 * @param  {number} y - scrollTop position given by onScroll()
	 * @param  {array} sourceSections - arr of the sources sections
	 * @param  {array} targetSections - arr of the target sections
	 * @return {number} return the value in pixel for the full offset in the editor and the preview - or false if error (scrolled to fast...)
	 * */
	static getScrollPosition(y, sourceSections, targetSections) {
		const indexSection = this.getIndex(y, sourceSections);
		const section = sourceSections[indexSection];

		if (typeof section === 'undefined') return false;

		const percentage = (y - section[0]) / (section[1] - section[0]);
		// console.log('============= percentage (/1) ', percentage);
		// console.log('============= indexSection ', indexSection);
		const targetSection = targetSections[indexSection];

		return targetSection[0] + (percentage * (targetSection[1] - targetSection[0]));
	}
}
