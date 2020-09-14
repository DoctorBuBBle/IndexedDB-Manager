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
export default class SelectBox extends React.Component {
    reference = React.createRef();
    state = {
        selected: this.props.select || this.props.elements[this.props.selectIndex]
    }

    val(element) {
        if (element) {
            this.setState({
                selected: element
            });
        } else {
            let element = this.props.elements[this.reference.current.selectIndex];
            return element;
        }
    }

    handleClick = (element, event) => {
        if (typeof element.onClick === "function") {
            element.onClick(event, element, this.props.elements);
        }
    }

    onChange = event => {
        if (typeof this.props.onSelect === "function") {
            const element = this.props.elements[event.target.selectedIndex];
            this.props.onSelect(element, event);
        }
    }

    getComponent = (index) => {
        let element = this.props.elements[index];
        let label = typeof element === "object" ? element[this.props.labelKey] : element;

        return (
            <option key={index} onClick={this.handleClick.bind(this, element)}>
                {label}
            </option>
        )
    };

    sort = (a, b) => {
        const selected = this.state.selected;

        if (selected !== undefined) {
            if (isEqual(selected, a)) {
                return -1;
            }
            if (isEqual(selected, b)) {
                return 1;
            }
        }
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
                    <select ref={this.reference} onChange={this.onChange}>
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