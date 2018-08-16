/**
 * Created by vishwadeep on 12/12/17.
 */
import React, { PropTypes, PureComponent } from "react";
import RichTextEditor from 'react-rte';

const toolbarConfig = {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
        { label: 'Italic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' }
    ],
    BLOCK_TYPE_DROPDOWN: [
        { label: 'Normal', style: 'unstyled' },
        { label: 'Heading Large', style: 'header-one' }
    ],
    BLOCK_TYPE_BUTTONS: [
        { label: 'UL', style: 'unordered-list-item' },
        { label: 'OL', style: 'ordered-list-item' }
    ]
};

export default class MlTextEditor extends PureComponent {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        return this;
    }

    /**
     * @function [handleOnChange] 
     * used for the view mode as handler will not be provided
     */
    handleOnChange() {
        //console.log('handler not provided')
    }

    compareQueryOptions(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    shouldComponentUpdate(nextProps) {
        if (!this.compareQueryOptions(this.props.value, nextProps.value)) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { placeholder, isReadOnly, handleOnChange, value, autoFocus } = this.props;
        return (
            <div>
                <RichTextEditor
                    value={value}
                    onChange={(value) => handleOnChange(value)}
                    autoFocus={autoFocus}
                    readOnly={isReadOnly}
                    placeholder={placeholder}
                    toolbarConfig={toolbarConfig}
                />
            </div>
        )
    }
}

export function createValueFromString(string) {
    if (string)
        return RichTextEditor.createValueFromString(string, 'html');
    else
        return RichTextEditor.createEmptyValue();
}

MlTextEditor.defaultProps = {
    handleOnChange: MlTextEditor.prototype.handleOnChange,
    isReadOnly: false,
    placeholder: "Describe...",
    autoFocus: true,
    value: RichTextEditor.createEmptyValue()
}