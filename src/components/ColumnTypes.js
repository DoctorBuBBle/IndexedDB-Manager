import SelectBox from "./Form/SelectBox";

const TYPES = {
    TEXT: {},
    SELECT: {},
    NUMBER: {},
    CHECKBOX: {},
    DATE: {}
}

const typesListed = [];

for (const key in TYPES) {
    if (TYPES.hasOwnProperty(key)) {
        const element = TYPES[key];
        typesListed.push({
            label: key,
            value: element
        });
    }
}

export default class ColumnTypes extends SelectBox {

}

ColumnTypes.defaultProps = {
    labelKey: "label",
    elements: typesListed
}

ColumnTypes.MAP = TYPES;
ColumnTypes.LIST = typesListed