import './style.less';

import React, { Component } from 'react';

import { Input } from 'antd';
import debounce from 'lodash/debounce';

/**
 * @desc dom
 */
export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.layer.data
        };
    }
    changeTextArea = e => {
        this.setState({ data: e.target.value });
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
                {/*<div className="h5ds-layout-setgrid h5ds-layout-setgrid-1">
                    <div className="h5ds-layout-setitem ">
                        <div className="h5ds-layout-setitem-name">外半径</div>
                        <div className="h5ds-layout-setitem-content" >
                            <Input className="ant-input ant-input-sm h5ds-input"
                                   onChange={this.changeTextArea} placeholder="请输入数字" type="text" value={data} />
                        </div>
                    </div>
                </div>*/}

            </div>
        );
    }
}
