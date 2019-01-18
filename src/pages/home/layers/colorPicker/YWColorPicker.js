import React, { Component } from 'react';

//缩放绘制比例
let scaleRate = 10;
//该值表示将圆分割的份数
let count = 360;
//一整个圆的弧度值
let doublePI = Math.PI * 2;
//由于圆心处是多条线段的交汇点，Composite是source-over模式，所以后绘制的线段会覆盖前一个线段.
let deprecatedRadius = 0;
//废弃圆半径的平方
let pow2DeprecatedRadius = Math.pow(deprecatedRadius, 2);

//色相(0-360)
let hue;
//饱和度(0%-100%)
let saturation = '100%';
//亮度luminance或明度lightness(0%-100%)
let luminance = '50%';

function tfSize(len) {
    let clientW = document.documentElement.clientWidth || document.body.clientWidth;
    if(clientW>540) clientW = 540;
    return len*clientW/375;
}

const outerRadius = tfSize(20);
const innerRadius = tfSize(15);

export default class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.initCanvas = this.initCanvas.bind(this);
        this.cansId = ColorPicker.createRandomId();
        this.canvId = ColorPicker.createRandomId();
    }

    componentWillReceiveProps(nextProps) {
        if( 'hue' in nextProps){
            const { hue } = nextProps;
            if(hue !== this.hue) {
                this.hue = hue;
                this.transformHueToPoint(hue);
                console.log(hue,'componentWillReceiveProps');
            }
        }
    }

    static createRandomId(){
        return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
    }

    initCanvas() {

        this.can = document.getElementById(this.cansId);
        this.ctx = this.can.getContext("2d");
        this.can_s = document.getElementById(this.canvId);
        this.sliderCtx = this.can_s.getContext("2d");
        this.centerX = this.can.width / 2;  //画布中心点X坐标
        this.centerY = this.can.height / 2; //画布中心点Y坐标
        this.innerRadius = Math.min(this.centerX, this.centerY) - outerRadius/2; //画布的内切圆半径(之所以减去一个数是为了可以显示滑块)
        this.pow2InnerRadius = Math.pow(this.innerRadius, 2); //内切圆半径的平方

        this.can_s.addEventListener("mousedown",this.onCanvasClick.bind(this),false);
        this.can_s.addEventListener("mousemove",this.OnMouseMove.bind(this),false);
        this.can_s.addEventListener("mouseup",this.OnMouseUp.bind(this),false);
        this.can_s.addEventListener("touchstart",this.didTouchDown.bind(this),false);
        this.can_s.addEventListener("touchmove",this.didTouchMove.bind(this),false);
        this.can_s.addEventListener("touchend",this.didTouchEnd.bind(this),false);
        this.can_s.addEventListener("touchcancel",this.didTouchEnd.bind(this),false);

        this.hue = this.props.hue;
        this.createHueRing();
        this.transformHueToPoint(this.props.hue);
    }

    transformHueToPoint(hue){
        let angle = doublePI*hue/360;
        let x0 = Math.sin(angle)*this.innerRadius/2;
        let y0 = Math.cos(angle)*this.innerRadius/2;
        let x1 = (hue<180)?x0:-Math.abs(x0);
        let y1 = (hue>90&&hue<270)?Math.abs(y0):-Math.abs(y0);

        this.currentHuePosX = this.centerX+x1;  //当前色相位置X坐标
        this.currentHuePosY = this.centerY+y1;  //当前色相位置Y坐标

        this.strokeCrossCursor(this.currentHuePosX*2, this.currentHuePosY*2);
    }

    //填充圆
    fillCircle=(cx, cy, r, color)=>{
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, doublePI);
        this.ctx.fill();
    };

    //将整数转为16进制，至少保留2位
    toHexString=(intValue)=>{
        let str = intValue.toString(16);
        if(str.length === 1) {
            str = "0" + str;
        }
        return str;
    };

    //判断坐标(x,y)是否在合法的区域内
    isInValidRange=(x, y)=>{
        let pow2Distance = Math.pow(x-this.centerX, 2) + Math.pow(y-this.centerY, 2);
        return pow2Distance >= pow2DeprecatedRadius && pow2Distance <= this.pow2InnerRadius;
    };

    strokeCrossCursor=(x,y)=>{   // 绘制滑块

        let rgbObj = this.getRgbObj(x/2, y/2);
        let hex = "#" + this.toHexString(rgbObj.r) + this.toHexString(rgbObj.g) + this.toHexString(rgbObj.b);

        this.sliderCtx.clearRect(0,0,this.can_s.width,this.can_s.height);
        this.sliderCtx.save();

        this.sliderCtx.globalCompositeOperation = "source-over";
        this.sliderCtx.beginPath();
        this.sliderCtx.moveTo(this.centerX,this.centerY);
        this.sliderCtx.arc(x,y,outerRadius,0,Math.PI*2,false);
        this.sliderCtx.fillStyle='#ffffff';
        this.sliderCtx.shadowColor = "rgba(0,0,0,0.30)";
        this.sliderCtx.shadowBlur = tfSize(8);
        this.sliderCtx.fill();

        this.sliderCtx.beginPath();
        this.sliderCtx.moveTo(this.centerX,this.centerY);
        this.sliderCtx.arc(x,y,innerRadius,0,Math.PI*2,false); // 绘制滑块内侧
        this.sliderCtx.fillStyle=hex;
        this.sliderCtx.fill();
    };
    //从画布的某点获取存储RGB的对象
    getRgbObj=(x, y)=>{
        let w = 1;
        let h = 1;
        let x1 = (x>this.centerX)?(x-1):(x+1);
        let y1 = (y>this.centerY)?(y-1):(y+1);
        let imgData = this.ctx.getImageData(x1,y1,w,h);
        let obj = {
            r: imgData.data[0],
            g: imgData.data[1],
            b: imgData.data[2],
            a: imgData.data[3]
        };
        return obj;
    };

    //将rgb转换为hsl对象()
    rgbToHslObj =(r, g, b)=>{
        r /= 255;
        g /= 255;
        b /= 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let diff = max - min;
        let twoValue = max + min;
        let obj = {h:0, s:0, l:0};
        if(max === min) {
            obj.h = 0;
        } else if(max === r && g >= b) {
            obj.h = 60 * (g - b) / diff;
        } else if(max === r && g < b) {
            obj.h = 60 * (g - b) / diff + 360;
        } else if(max === g) {
            obj.h = 60 * (b - r) / diff + 120;
        } else if(max === b) {
            obj.h = 60 * (r - g) / diff + 240;
        }
        obj.l = twoValue / 2;
        if(obj.l === 0 || max === min) {
            obj.s = 0;
        } else if(0 < obj.l && obj.l <= 0.5) {
            obj.s = diff / twoValue;
            //obj.s = diff / (2 * obj.l);
        } else {
            obj.s = diff / (2 - twoValue);
            //obj.s = diff / (2 - 2 * obj.l);
        }
        obj.h = Math.round(obj.h);
        return obj;
    };

    //创建Hue颜色圆环
    createHueRing(){
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.clearRect(0,0,this.can.width,this.can.height);
        this.ctx.save();
        //将绘制原点移动到画布中心
        this.ctx.translate(this.centerX, this.centerY);

        let iSectors = 360;
        let iSectorAngle = (360/iSectors)/180 * Math.PI;

        for(let i=0; i<count; i++) {
            let degree = i / count * 360;
            let startAngle = -Math.PI*0.5;
            let endAngle = startAngle + iSectorAngle;
            let radius = this.innerRadius;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, startAngle, endAngle, false);
            this.ctx.closePath();
            this.ctx.strokeStyle = "hsl(" + degree +"," + saturation + "," + luminance + ")";
            this.ctx.stroke();
            this.ctx.fillStyle = "hsl(" + degree +"," + saturation + "," + luminance + ")";
            this.ctx.fill();
            this.ctx.rotate(iSectorAngle);
        }
        this.ctx.restore();

        this.ctx.globalCompositeOperation = "destination-in";
        this.fillCircle(this.centerX, this.centerY, this.innerRadius, "black");
    }

    drawWithMove=(x,y)=>{

        this.currentHuePosX = x*2;
        this.currentHuePosY = y*2;

        this.setColorValue(x, y);
        this.strokeCrossCursor(this.currentHuePosX, this.currentHuePosY);
    };

    conversToCircleEdgePoint=(x1, y1)=>{

        const centerX = this.centerX;
        const centerY = this.centerY;

        let x = Math.abs(x1 - centerX);
        let y = Math.abs(y1 - centerY);
        let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        let edgeX,edgeY;
        let angle =  Math.asin(y / z);

        const cosX = Math.cos(angle)*this.innerRadius;
        edgeX = Math.round((x1>centerX)?(cosX+centerX):(centerX-cosX));
        const sinY = Math.sin(angle)*this.innerRadius;
        edgeY = Math.round((y1>centerY)?(sinY+centerY):(centerY-sinY));
        return {x:edgeX,y:edgeY};
    };

    onCanvasClick=(event)=>{

        let x = event.offsetX;
        let y = event.offsetY;

        if(!this.isInValidRange(x, y)) {
            const xy = this.conversToCircleEdgePoint(x,y);
            x = xy.x; y = xy.y;
        }
        this.isDraging=true;
        this.drawWithMove(x,y);
    };


    OnMouseMove=(event)=>{

        if(this.isDraging){
            let x = event.offsetX;
            let y = event.offsetY;

            if(!this.isInValidRange(x, y)) {
                const xy = this.conversToCircleEdgePoint(x,y);
                x = xy.x; y = xy.y;
            }
            this.drawWithMove(x,y);
        }
    };

    OnMouseUp(){
        this.isDraging=false;
    };

    didTouchDown=(event)=>{
        event.preventDefault();
        let touch = event.touches[0];
        let x = touch.pageX-this.can.getBoundingClientRect().left;
        let y = touch.pageY-this.can.getBoundingClientRect().top;

        if(!this.isInValidRange(x, y)) {
            const xy = this.conversToCircleEdgePoint(x,y);
            x = xy.x; y = xy.y;
        }
        this.isDraging=true;
        this.drawWithMove(x,y);
    };
    didTouchMove=(event)=>{
        event.preventDefault();
        if(this.isDraging) {
            let touch = event.touches[0];
            let x = touch.pageX-this.can.getBoundingClientRect().left;
            let y = touch.pageY-this.can.getBoundingClientRect().top;

            if (!this.isInValidRange(x, y)) {
                const xy = this.conversToCircleEdgePoint(x,y);
                x = xy.x; y = xy.y;
            }
            this.drawWithMove(x, y);
        }
    };
    didTouchEnd(){

        this.isDraging=false;
    }
    setColorValue=(x, y)=>{
        //获取包含rgb的颜色对象
        let rgbObj = this.getRgbObj(x, y);
        // var rgbColor = this.formRgbColor(rgbObj);
        // this.colorDiv.style.backgroundColor = rgbColor;
        // this.rgbValueDiv.value = rgbColor;
        let hex = "#" + this.toHexString(rgbObj.r) + this.toHexString(rgbObj.g) + this.toHexString(rgbObj.b);
        // this.hexadecimalValueDiv.value = hex;

        let hslObj = this.rgbToHslObj(rgbObj.r, rgbObj.g, rgbObj.b);
        // this.hslValueDiv.value = this.formHslColor(hslObj);
        // hueTipDiv.innerHTML = ("Hue：" + hslObj.h);
        if(this.props.sliderEvent) this.props.sliderEvent(rgbObj,hex,hslObj.h);
    };

    onHSLRangeChange(){
        // this.setColorValue(this.currentHuePosX, this.currentHuePosY);
    }

    componentDidMount() {

        this.initCanvas();
    }
    componentDidUpdate() {

    }

    render() {

        return (

            <div style={{position:"relative"}}>
                <canvas id={this.cansId} width={tfSize(100).toString()} height={tfSize(100).toString()}> </canvas>
                <div style={{position:"absolute",top:0,left:0,zoom:0.5}}>
                    <canvas id={this.canvId} width={tfSize(200).toString()} height={tfSize(200).toString()}> </canvas>
                </div>
            </div>
        );
    }
}
