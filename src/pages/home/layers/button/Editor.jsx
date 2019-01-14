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
            <div className="ex-set-submit">
                <div className="h5ds-layout-setgrid h5ds-layout-setgrid-1">
                    <div className="h5ds-layout-setitem ">
                        <div className="h5ds-layout-setitem-name">按钮文字</div>
                        <div className="h5ds-layout-setitem-content" >
                            <Input onChange={this.changeTextArea} className="ant-input ant-input-sm h5ds-input"  value={data} />
                        </div>
                    </div>
                </div>

                <div className="h5ds-layout-setgrid h5ds-layout-setgrid-2">
                    <div className="h5ds-util-bgcolor">
                        <div className="h5ds-layout-setitem">
                            <div className="h5ds-layout-setitem-name">文字颜色</div>
                            <div className="h5ds-layout-setitem-content">
                                <div className="h5ds-util-color">
                                    <span className="h5ds-util-color-btn" ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
