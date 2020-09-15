import moment from "moment";
import FormComponentBase from "./FormComponentBase";
import Input from "./Input";

export default class DatePicker extends FormComponentBase {

    onChange(){
        this.setState({
            value: moment(this.ref.val(), this.props.format).valueOf()
        });
        FormComponentBase.prototype.onChange.apply(this, arguments);
    }

    getFormattedValue = () => {
        const timestamp = this.val();
        if (timestamp !== undefined && timestamp !== null) {
            return moment(timestamp).format(this.props.format);
        }
    }
    
    render(){
        return (
            <Input ref={this.ref} placeholder={this.props.format} onChange={this.onChange.bind(this)} value={this.getFormattedValue()}/>
        )
    }
}

DatePicker.defaultProps = {
    format: "YYYY-MM-DD"
}