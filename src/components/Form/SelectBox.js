import React from 'react';
import FormComponent from './FormComponent';
import isEqual from 'fast-deep-equal';
import FormComponentBase from './FormComponentBase';

/**
 * 
 * @param {Object} props {
 *      {Array} elements - The array of options for the select box
 *      {String} labelKey - The key which value to use as label if the element is an object.
 *      {Anything} select - The element of elements to select initially.
 *      {Number} selectIndex - The index of the element to select initially
 * }
 */
export default class SelectBox extends FormComponentBase {

    onChange = event => {
        const element = this.props.elements[event.target.selectedIndex];
        this.setState({
            value: element
        });
        FormComponentBase.prototype.onChange.call(this, event);
    }

    getComponent = (index) => {        
        let element = this.props.elements[index];
        let label = typeof element === "object" ? element[this.props.labelKey] : element;
        const selected = (this.state.value === undefined && index === 0) || isEqual(element, this.state.value);
        
        return (
            <option key={index} selected={selected} value={index}>
                {label}
            </option>
        )
    };

    sort = (a, b) => {
        const labelA = a[this.props.labelKey];
        const labelB = b[this.props.labelKey];

        if (labelA < labelB) {
            return -1;
        }
        if (labelA > labelB) {
            return 1;
        }

        return 0;
    };
    createOption = (element, index) => this.getComponent(index);

    render() {
        let options = this.props.elements.sort(this.sort).map(this.createOption);
        
        return (
            <FormComponent label={this.props.label}>
                <div className="select">
                    <select ref={this.ref} onChange={this.onChange}>
                        { options }
                    </select>
                </div>
            </FormComponent>
        )
    }
}

SelectBox.defaultProps = {
    labelKey: "label",
    elements: []
}