import SelectBox from "./Form/SelectBox";
import React from "react";

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

export default function ColumnTypes(props){
    return <SelectBox title="Types" labelKey="label" select={props.select} onSelect={props.onSelect} elements={typesListed}></SelectBox>
}

ColumnTypes.TYPES = TYPES;