import './phone.less';

import { H5DSComponent } from '../plusClasses.js';

// 手机端执行
export default class PhoneDom extends H5DSComponent {
    static type = 'input';

    constructor(props) {
        super(props);
    }

    didMount() {
        //console.log('app',this.props.app)
        console.log('开始执行', this.props);
        console.log('开始执行', this.props.target);
        console.log('开始执行style', this.props.target.style.cssText);
        console.log('开始执行style', this.props.target.lastElementChild.style.cssText);
        var css = this.props.target.style.cssText;
        var mid = this.props.target.id;
        console.log(mid);
        console.log(css);
        var data = '{\"'+mid+'\":\"'+css+'\",'

                    '}';
        console.log(data);
        //z-index: 9999; width: 300px; height: 40px; top: 215px; left: 310px;
        /*const mypro = {
            'z-index': '123'
        };*/
        //post请求
        /*const  url = "http://localhost:8080/aliapi/test";
        $.ajax({
            type:'post',
            url: url,
            contentType:'application/json;charset=UTF-8',
            data: data,
            dataType:"json",
            success: function(data){
                console.log('post -> ',data);
            }
        });*/

        /*$.ajax({
            url: url,
            type: 'post',
            dataType: 'application/json',
            //data: JSON.stringify({data:{status: "start"}}),
            data: {name: "xu", foo: 'bar'},
            cache: false,
            headers: {
                "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrZW4iLCJpYXQiOjE1Mzc1NTQzMDksImRhdGEiOnsidXNlcm5hbWUiOiJ4dXRvbmdiYW8iLCJpc19zdXBlcnVzZXIiOjEsImlkIjoxNywibG9naW5fdGltZSI6MTUzNzU1NDMwOX0sImV4cCI6MTUzODE1NDMwOX0.32Lys4hjjY2XRpM2r9YSmpYA798u821m_M5Tzb6wxIU",
                'Content-Type': 'application/x-www-form-urlencoded'  //multipart/form-data;boundary=--xxxxxxx   application/json
            },
            success: function(res){
                if (res.code === 200) {

                }
            },
            error: function(e) {

            }
        });*/


    }

    willUnmount() {
        console.log('被卸载前执行', this.props.target);
    }
}
