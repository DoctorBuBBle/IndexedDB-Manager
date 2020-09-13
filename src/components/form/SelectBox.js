import React from 'react';
import FormComponent from './FormComponent';
import isEqual from 'fast-deep-equal';

/**
 * 
 * @param {Object} props {
 *      {Array} elements - The array of options for the select box
 *      {String} labelKey - The key which value to use as label if the element is an object.
 *      {Anything} select - The element of elements to select initially.
 *      {Number} selectIndex - The index of the element to select initially
 * }
 */
export default function SelectBox (props){
    const handleClick = (element, event) => {
        if (typeof element.onClick === "function") {
            element.onClick(event, element, props.elements);
        }
    }

    const getComponent = (index) => {
        let element = props.elements[index];
        let label = typeof element === "object" ? element[props.labelKey] : element;

        return (
            <option key={index} onClick={handleClick.bind(this, element)}>
                {label}
            </option>
        )
    };

    let selected = props.select || props.elements[props.selectIndex];

    const sort = (a, b) => {
        if (selected !== undefined) {
            if (isEqual(selected, a)) {
                return 1;
            }
            if (isEqual(selected, b)) {
                return -1;
            }
        }
        const labelA = a[props.labelKey];
        const labelB = b[props.labelKey];

        if (labelA < labelB) {
            return -1;
        }
        if (labelA > labelB) {
            return 1;
        }

        return 0;
    };
    const createOption = (element, index) => getComponent(index);
    const options = props.elements.sort(sort).map(createOption);
    
    return (
        <FormComponent label={props.label}>
            <div className="select">
                <select>
                    { options }
                </select>
            </div>
        </FormComponent>
    )
}

SelectBox.defaultProps = {
    labelKey: "label",
    elements: []
}