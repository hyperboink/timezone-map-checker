export const setClassToElements = (selectors = {}) => {
    const elements = {};

    for (let selector in selectors) {
        if (Object.prototype.hasOwnProperty.call(selectors, selector)) {
            elements[selector] = document.querySelector(`.${selectors[selector]}`);
        }
    }

    return elements;
};

export const setAllToClassElements = (selector) => {
	return document.querySelectorAll(`.${selector}`);
}

export const removeClass = (selectors, selectorClass) => {
	if(selectors.length > 1){
		Array.prototype.forEach.call(
			selectors,
			function(node){
				node.classList.remove(selectorClass)
			}
		);
	}else{
		selectors.classList.remove(selectorClass);
	}
}