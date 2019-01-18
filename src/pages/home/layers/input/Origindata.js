// 原始数据
export class Origindata {
    constructor() {
        this.id = null;
        this.type = 'input';
        this.animate = [];
        this.data =  {
            hint: '提示内容',
            sign: '字段名称，比如姓名，电话，地址',
            inputValue: '',
            notEmpty: false,
            checked: false
        };
        this.estyle = {
            backgroundColor: 'rgb(242, 242, 242)',
            border:  '1px solid rgb(204, 204, 204)'
        };
        this.style = {
            width: 300,
            height: 40,
            top: 10,
            left: 10
        };
        this.color = '';
        this.ue = {};
    }
}
