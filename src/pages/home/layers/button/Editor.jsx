import './style.less';

import React, { Component } from 'react';
import { Input } from 'antd';
import debounce from 'lodash/debounce';
import { SketchPicker } from 'react-color';


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

    componentDidMount() {
        document.addEventListener('click', this.hideAllMenu);
    }

    hideAllMenu = () => {
        this.setState({
            data: {
                visible: 'none',
                buttonValue: this.state.data.buttonValue,
                color: this.state.data.color
            }
        })
    }
    stopPropagation(e) {
        e.nativeEvent.stopImmediatePropagation();
    }

    handleChangeComplete = (color) => {
        console.log('handleChangeComplete',color.hex);
        this.props.layer.estyle.color = color.hex;
        this.props.layer.data.color = color.hex;
        this.setState({
            data: {
                visible: '',
                buttonValue: this.state.data.buttonValue,
                color: color.hex,
                e: this.state.data.e
            }
        });
        $(document).trigger('h5ds.setHistory');
    };



    showModal = (e) => {
        this.stopPropagation(e);
        this.setState({
            data: {
                visible: this.state.data.visible==='none'?'':'none',
                buttonValue: this.state.data.buttonValue,
                color: this.state.data.color
            }
        });
    }
    changeTextArea = e => {
        this.stopPropagation(e);

        this.setState({
            data: {
                visible: this.state.data.visible,
                buttonValue: e.target.value,
                color: this.state.data.color
            }
        });
        this.renderLayer();
    };
    // renderLayer
    renderLayer = debounce(() => {
        console.log('更新视图');
        this.props.layer.data.buttonValue = this.state.data.buttonValue;
        $(document).trigger('h5ds.setHistory');
    }, 500);

    render() {
        /*return <div style={{display: 'none'}}>
            <div></div>
        </div>;*/
        //return <SketchPicker />;
        const { data } = this.state;
        return (
            <div className="ex-set-submit">
                <div className="h5ds-layout-setgrid h5ds-layout-setgrid-1">
                    <div className="h5ds-layout-setitem ">
                        <div className="h5ds-layout-setitem-name">按钮文字</div>
                        <div className="h5ds-layout-setitem-content" >
                            <Input onChange={this.changeTextArea} className="ant-input ant-input-sm h5ds-input"  value={data.buttonValue} />
                        </div>
                    </div>
                </div>

                <div className="h5ds-layout-setgrid h5ds-layout-setgrid-2">
                    <div className="h5ds-util-bgcolor">
                        <div className="h5ds-layout-setitem">
                            <div className="h5ds-layout-setitem-name">文字颜色</div>
                            <div className="h5ds-layout-setitem-content">
                                <div className="h5ds-util-color">
                                    <span onClick={this.showModal} className="h5ds-util-color-btn" style={{backgroundColor:data.color}}></span>
                                    <div className="h5ds-util-color-box"  style={{zIndex:9999, display: data.visible}}>
                                            <SketchPicker color={ data.color }
                                                          onChangeComplete={ this.handleChangeComplete } />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
