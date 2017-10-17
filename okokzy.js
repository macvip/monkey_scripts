// ==UserScript==
// @name         资源网助手 for Safari
// @namespace    https://greasyfork.org/zh-CN/users/104201
// @version      0.5
// @description  OK资源网，最大资源网[MP4][m3u8]视频直接播放，分类页面改进翻页功能
// @author       黄盐
// @match        http://*.zuidazy.com/?m=vod-*
// @match        http://*.okokzy.com/?m=vod-*
// @grant        GM_addStyle
// @grant        unsafeWindow
// run-at        document-end
// ==/UserScript==

(function() {
    //适配详情页，http://*.com/?m=vod-detail-id-*.html
    if(location.search.indexOf("detail") != -1) {
        GM_addStyle(''+
                    //视频框CSS
                    '#TM_f{z-index:1000;position:fixed; top:0; background:black;}'+
                    '#TM_f:hover .ctrls{display:block; z-index:2;position:absolute; font-size:20px; text-align:center; top:0px; padding: 0 0 3px 0;color:white; background:rgba(0, 0, 0, 0.4); cursor:pointer; min-width:35px; max-width:35px;}'+
                    '.ctrls{display:none;}'+
                    '#TM_f .ctrls:hover{background:#03A9F4; color: white;}'+
                    '#mid{right:90px;} #max{right:55px;} #close{right:20px;}'+
                    //按键暂停等CSS
                    '#tip{ position: absolute; z-index: 999999;padding: 10px 15px 10px 20px; border-radius: 10px; background: white; font-size:30px; color:black;top: 50%;left: 50%; transform: translate(-50%,-50%); transition: all 500ms ease;  -webkit-font-smoothing: subpixel-antialiased; font-family: "微软雅黑"; -webkit-user-select: none;}'
                   );

        //================ 最基本的操作 链接网址转链接====================
        var lis=document.querySelectorAll("div.vodplayinfo li");//文档中0~end 是链接项目，渲染结束后是6~end是链接项目
        var tmp, play;
        for(var i=0; i<lis.length; i++){
            tmp=lis[i].innerText;
            lis[i].innerHTML=lis[i].childNodes[0].outerHTML+'<a target="_blank" href="'+tmp.slice(tmp.indexOf("http"))+'">'+tmp+'</a>';
        }
        //================ 最基本的操作 链接网址转链接 End====================
    }
    //=================详情页代码==========完===================

    //适配分类页，http://*.com/?m=vod-type-id-*.html 方便翻页
    if(location.search.indexOf("type") != -1) {
        GM_addStyle('.GM_page{position:fixed !important;bottom:0 !important; width:100% !important;}');
        var ms = function (){
            var evt = window.event || arguments[0];
            if(evt.pageY<(document.body.offsetHeight-window.innerHeight)){
                document.getElementsByClassName('pages')[0].className = "pages GM_page";
            }
            else {
                document.getElementsByClassName('pages')[0].className = "pages";
            }
        };

        document.onmousewheel = ms;
    }
    //=================分类页代码==========完===================

})();
