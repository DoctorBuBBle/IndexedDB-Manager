import Input from "./Form/Input";
import IntInput from "./Form/IntInput";
import SelectBox from "./Form/SelectBox";
import Checkbox from "./Form/Checkbox";
import DatePicker from "./Form/Date";

const TYPES = {
    TEXT: Input,
    //SELECT: SelectBox,
    NUMBER: IntInput,
    CHECKBOX: Checkbox,
    //DATE: DatePicker
}

const typesListed = [];

for (const key in TYPES) {
    if (TYPES.hasOwnProperty(key)) {
        typesListed.push({
            label: key,
            value: key
        });
    }
}

export default class ColumnTypes extends SelectBox {

}

ColumnTypes.defaultProps = {
    labelKey: "label",
    elements: typesListed,
    value: {
        label: "TEXT",
        value: "TEXT"
    }
}

ColumnTypes.MAP = TYPES;
ColumnTypes.LIST = typesListed