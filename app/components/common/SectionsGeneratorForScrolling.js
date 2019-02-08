const selectors = [];
for (let i = 1; i < 6; i++) {
	selectors.push(`.cm-header-${i}`, `h${i}`);
}

export default class SectionsGeneratorForScrolling {
	static fromElement(element, haveNewViewportInEditor = false, prevArrTitlesinEditor = []) {
		const matches = element.querySelectorAll(selectors.join(', '));
		const reRenderingCmEditor = prevArrTitlesinEditor.length > 0 && haveNewViewportInEditor;
		let sections = [];
		let previous = 0;
		let lastPrevious; // For when re-rendering in CM Editor

		if (reRenderingCmEditor) {
			lastPrevious = prevArrTitlesinEditor[prevArrTitlesinEditor.length - 1][1];
			sections = prevArrTitlesinEditor;
		}

		matches.forEach((title) => {
			const offsetTop = this.offsetTop(title, element);

			if (reRenderingCmEditor && offsetTop > prevArrTitlesinEditor[prevArrTitlesinEditor.length - 1][1]) {
				// Re-rendering in CM Editor:
				sections.push([lastPrevious, offsetTop]);
				lastPrevious = offsetTop;
			} else if ((element.className === 'CodeMirror-scroll' && prevArrTitlesinEditor.length === 0) || element.className !== 'CodeMirror-scroll') {
				// First time scrolled:
				sections.push([previous, offsetTop]);
				previous = offsetTop;
			}
		});

		sections.push([previous, element.scrollHeight]);
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
	 * Return the final target position in container (in pixel)
	 * */
	static getScrollPosition(y, sourceSections, targetSections) {
		const indexSection = this.getIndex(y, sourceSections);
		const section = sourceSections[indexSection];
		const percentage = (y - section[0]) / (section[1] - section[0]);
		// console.log('============= percentage (/1) ', percentage);
		// console.log('============= indexSection ', indexSection);
		const targetSection = targetSections[indexSection];

		return targetSection[0] + (percentage * (targetSection[1] - targetSection[0]));
	}
}
