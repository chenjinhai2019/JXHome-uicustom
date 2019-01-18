import './style.less';

import React, { Component } from 'react';

import { Input } from 'antd';
import debounce from 'lodash/debounce';

/**
 * @desc input
 */
export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.layer.data
        };
    }

    changeTextAreaHint = e => {
        this.setState({ data: {inputValue: this.state.data.inputValue, sign:this.state.data.sign, hint: e.target.value} });
        this.renderLayer();
    };

    changeTextAreaSign = e => {
        this.setState({ data: {hint: this.state.data.hint, inputValue:this.state.data.inputValue, sign: e.target.value} });
        this.renderLayer();
    };

    changeTextAreaValue = e => {
        this.setState({ data: {hint: this.state.data.hint, sign:this.state.data.sign, inputValue: e.target.value} });
        this.renderLayer();
    };

    // renderLayer
    renderLayer = debounce(() => {
        console.log('更新视图');
        this.props.layer.data = this.state.data;
        $(document).trigger('h5ds.setHistory');
    }, 500);

    render() {
        const { data } = this.state;
        return (
                <div className="ex-set-input">
                    <div className="h5ds-layout-setgrid h5ds-layout-setgrid-1">
                        <div className="h5ds-layout-setitem ">
                            <div className="h5ds-layout-setitem-name">字段标识</div>
                            <div className="h5ds-layout-setitem-content" >
                                <Input className="ant-input ant-input-sm h5ds-input"
                                       placeholder="请输入标识" type="text" defaultValue={data.sign}
                                       onChange={this.changeTextAreaSign} value={data.sign}/>
                            </div>
                        </div>
                    </div>

                    <div className="h5ds-layout-setgrid h5ds-layout-setgrid-1">
                        <div className="h5ds-layout-setitem ">
                            <div className="h5ds-layout-setitem-name">
                                提示内容
                            </div>
                            <div className="h5ds-layout-setitem-content" >
                                <Input className="ant-input ant-input-sm h5ds-input"
                                       onChange={this.changeTextAreaHint} type="text"  placeholder={data.hint} value={data.hint}/>
                            </div>
                        </div>
                    </div>

                    <div className="h5ds-layout-setgrid h5ds-layout-setgrid-1">
                        <div className="h5ds-layout-setitem ">
                            <div className="h5ds-layout-setitem-name">默认数据</div>
                            <div className="h5ds-layout-setitem-content">
                                <input placeholder="默认显示数据可以不填" className="ant-input ant-input-sm h5ds-input"
                                       onChange={this.changeTextAreaValue}  type="text" value={data.inputValue}/>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}
