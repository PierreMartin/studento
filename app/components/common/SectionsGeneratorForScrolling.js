const selectors = [];
for (let i = 1; i < 6; i++) {
	selectors.push(`.cm-header-${i}`, `h${i}`);
}

export default class SectionsGeneratorForScrolling {
	static fromElement(element) {
		const matches = element.querySelectorAll(selectors.join(', '));
		let previous = 0;
		const sections = [];

		matches.forEach((title) => {
			const offsetTop = this.offsetTop(title, element);
			// TODO if (element === 'editor' && offsetTop > prevArrEditor[arrEditor.length - 1][1]) sections.push([...prevArrEditor, previous, offsetTop]);
			sections.push([previous, offsetTop]);
			previous = offsetTop;
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
