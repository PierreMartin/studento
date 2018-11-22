function HighlightRendering(hljs) {
	const code = document.querySelectorAll('pre code');
	for (let i = 0; i < code.length; i++) hljs.highlightBlock(code[i]);
}

function kaTexRendering(katex, content) {
	const valuesKatex = []; // IN    // TODO big bug firefox !!    content.match(/(?<=```katex\s+)(.[\s\S]*?)(?=\s+```)/gi) || [];
	const katexNode = document.querySelectorAll('.language-katex'); // OUT

	for (let i = 0; i < valuesKatex.length; i++) {
		const text = valuesKatex[i];
		if (katexNode[i]) {
			const macros = {
				'\\f': 'f(#1)',
				'\\RR': '\\mathbb{R}'
			};
			katex.render(String.raw`${text}`, katexNode[i], { displayMode: true, throwOnError: false, macros });
		}
	}
}

export { HighlightRendering, kaTexRendering };
