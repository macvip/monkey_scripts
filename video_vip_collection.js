// ==UserScript==
// @name         破解VIP会员视频集合
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  破解[优酷|腾讯|乐视|爱奇艺|芒果|AB站|音悦台]等VIP或会员视频，解析接口贵精不贵多，绝对够用。有直接跳转＋备用接口列表。详细方法看说明还有图片。包含了[【稳定】全网VIP视频在线解析▶ttmsjx][VIP会员视频解析▶龙轩][酷绘-破解VIP会员视频▶ahuiabc2003]以及[VIP视频破解▶hoothin]的部分接口。
// @author       黄盐
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.letv.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/*
// @match        *://vip.1905.com/play/*
// @match        *://*.pptv.com/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://*.56.com/*
// @exclude      *://*.bilibili.com/blackboard/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';
    var replaceRaw=GM_getValue("replaceRaw");
    var episodes=GM_getValue("episodes");
    GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; width:100px; height:auto; border:0; margin:0;}'+
                '#parseUl{position:fixed;top:80px; left:0px;}'+
                '#parseUl li{list-style:none;}'+
                '.TM1{opacity:0.3; position:relative;padding: 0 7px 0 0; min-width: 19px; cursor:pointer;}'+
                '.TM1:hover{opacity:1;}'+
                '.TM1 span{display:block; border-radius:0 5px 5px 0; background-color:#ffff00; border:0; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:15px 2px;}'+
                '.TM3{position:absolute; top:0; left:19px; display:none; border-radius:5px; margin:0; padding:0;}'+
                '.TM3 li{float:none; width:80px; margin:0; font-size:14px; padding:3px 10px 2px 15px; cursor:pointer; color:#3a3a3a !important; background:rgba(255,255,0,0.8)}'+
                '.TM3 li:hover{color:white !important; background:rgba(0,0,0,0.8);}'+
                '.TM3 li:last-child{border-radius: 0 0 5px 5px;}'+
                '.TM3 li:first-child{border-radius: 5px 5px 0 0;}'+
                '.TM1:hover .TM3{display:block}');
    var apis=[
        {"name":"黑玄视频","url":"http://www.heixuan.vip/jiexi/index.php?url=","title":"支持腾讯"},
        {"name":"panda[kkflv]","url":"http://www.97panda.com/kkflv/index.php?url=","title":"支持腾讯"},
        {"name":"s8zy","url":"http://www.s8zy.cn/vip/index.php?url=","title":"支持腾讯"},
        {"name":"vParse[腾]","url":"https://api.vparse.org/?url=","title":"支持腾讯"},
        //{"name":"FLVSP[腾讯]","url":"https://api.flvsp.com/?url=","title":"支持腾讯"},//解析源同上
        {"name":"噗噗电影","url":"http://pupudy.com/play?make=url&id=","title":"综合接口，稳定·全网VIP*【作者ttmsjx】脚本的接口"},
        {"name":"酷绘","url":"http://appapi.svipv.kuuhui.com/svipjx/liulanqichajian/browserplugin/qhjx/qhjx.php?id=","title":"综合接口，酷绘*【作者ahuiabc2003】脚本的接口"},
        {"name":"百域阁","url":"http://api.baiyug.cn/vip/index.php?url=","title":"转圈圈就换线路"},
        {"name":"旋风解析","url":"http://api.xfsub.com/index.php?url=","title":"1905优先使用"},
        {"name":"石头解析","url":"https://jiexi.071811.cc/jx.php?url=","title":"手动点播放"},
        {"name":"无名小站","url":"http://www.sfsft.com/admin.php?url=","title":"无名小站同源"},
        {"name":"VIP看看","url":"http://q.z.vip.totv.72du.com/?url=","title":"更换线路成功率会提高"},
        {"name":"ODFLV","url":"http://aikan-tv.com/?url=","title":"不稳定，广告过滤软件可能有影响"},
        {"name":"163人","url":"http://jx.api.163ren.com/vod.php?url=","title":"偶尔支持腾讯"},
        {"name":"CKFLV","url":"http://www.0335haibo.com/tong.php?url=","title":"CKFLV云,部分站点不支持"},
        {"name":"舞动秋天","url":"http://qtzr.net/s/?qt=","title":"qtzr.net"},
        {"name":"无名小站2","url":"http://www.wmxz.wang/video.php?url=","title":"转圈圈就换线路"},
        {"name":"眼睛会下雨","url":"http://www.vipjiexi.com/yun.php?url=","title":"www.vipjiexi.com"},
        {"name":"人人发布","url":"http://v.renrenfabu.com/jiexi.php?url=","title":"综合，多线路"}
    ];
    var defaultapi={"title":"龙轩脚本的接口，默认用浮空解析，失效请更换接口","url":"http://ifkjx.com/?url="};
    //嵌入页面播放
    function openInTab(evt){
        var iframe=document.createElement("iframe");
        iframe.id="TMiframe";
        var video;
        //iframe.style.cssText="width:100%;height:100%;text-align:center;border:none;";
        iframe.style.border="none";
        iframe.textAlign="center";
        iframe.src=evt.target.dataset.url+location.href;
        var timer=setInterval(function(){                                                                //-------------检测视频元素思路借鉴他人 License MIT Begin--------------
            [].every.call(document.querySelectorAll("object,embed,video"),function(item){                //LINK:https://greasyfork.org/zh-CN/scripts/26556-vip视频破解
                var style=getComputedStyle(item, null);                                                  //Homepage: http://hoothin.com
                if(style.width.replace("px","")>100 && style.height.replace("px","")>100){               //Email: rixixi@gmail.com
                    video=item;
                    return false;//有播放窗
                }
                return true;
            });
            if(video||document.querySelector("#TMiframe")){
                if(document.querySelector("#TMiframe")){video=document.querySelector("#TMiframe");}
                clearInterval(timer);
                var videoStyle=getComputedStyle(video, null);
                iframe.width=videoStyle.width;
                iframe.height=videoStyle.height;
                var videoParent=video.parentNode;
                iframe.style.lineHeight=getComputedStyle(videoParent).height;
                if(video.parentNode){video.parentNode.replaceChild(iframe,video);}
            }
        },500);                                                                                         //-------------检测视频元素思路借鉴他人  End--------------------
        if(window.location.href.indexOf("youku")!=-1){
            document.querySelector(".vpactionv5_iframe_wrap").style.display="none";
        }
    }
    function noNewTabCheck(){
        var x, arr=document.querySelectorAll(".TM4 li");
        replaceRaw=document.querySelector("#inTabChekbx").checked;
        GM_setValue("replaceRaw",replaceRaw);
        for(x=0;x<arr.length;x++){
            if(replaceRaw){
                arr[x].addEventListener("click",openInTab,false);
                arr[x].onclick='';
            }else{
                arr[x].removeEventListener("click",openInTab,false);
                arr[x].onclick=function(){window.open(this.dataset.url+location.href);};
            }
        }
    }
    function rightEpsLinkCheck() {
        episodes=document.querySelector("#realLinkChekbx").checked;
        GM_setValue("episodes",episodes);
        if(episodes){
            document.querySelector('#widget-dramaseries').addEventListener('click', function getLink (e){      //-------------iqiyi剧集真实播放页面方法  Begin------------------//Homepage: http://hoothin.com    Email: rixixi@gmail.com
                var target=e.target.parentNode.tagName=="LI"?e.target.parentNode:(e.target.parentNode.parentNode.tagName=="LI"?e.target.parentNode.parentNode:e.target.parentNode.parentNode.parentNode);
                if(target.tagName!="LI")return;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: "http://cache.video.qiyi.com/jp/vi/"+target.dataset.videolistTvid+"/"+target.dataset.videolistVid+"/?callback=crackIqiyi",
                    onload: function(result) {
                        var crackIqiyi=function(d){
                            location.href=d.vu;
                        };
                        eval(result.responseText);
                    }
                });
            });                                                                              //-------------iqiyi剧集真实播放页面方法  End------------------
        }
        else{document.querySelector('#widget-dramaseries').removeEventListener('click', getLink);}
    }

    if(top.location==location){//只在顶层页面运行，在iframe中不起作用
        var div=document.createElement("div");
        div.id="TManays";
        var txt='',i=0;
        for (i in apis) {
            txt +='<li data-order='+i+' data-url="'+apis[i].url+'" title="'+apis[i].title+'" onclick="window.open(this.dataset.url+location.href)">'+apis[i].name+'</li>';
        }
        div.innerHTML='<ul id="parseUl">'+
            '<li class="TM1"><span id="TMList"  title="'+defaultapi.title+'" onclick="window.open(\''+defaultapi.url+'\'+window.location.href)">▶</span><ul class="TM3 TM4">'+txt+'</ul></li>'+
            '<li class="TM1"><span id="TMSet">▣</span><ul class="TM3"><li><label><input type="checkbox" id="inTabChekbx">本页解析</label></li><li><label><input type="checkbox" id="realLinkChekbx">爱奇艺正确选集</label></li></ul></li>'+
            '</ul>';
        document.body.appendChild(div);
        console.log(div.parentNode.parentNode.parentNode.tagName);
        document.querySelector("#inTabChekbx").addEventListener("click",noNewTabCheck,false);
        document.querySelector("#inTabChekbx").checked=replaceRaw;
        document.querySelector("#realLinkChekbx").addEventListener("click",rightEpsLinkCheck,false);
        document.querySelector("#realLinkChekbx").checked=episodes;

        if(episodes && window.location.href.indexOf("iqiyi")!=-1){
            rightEpsLinkCheck();
        }
        if(replaceRaw && window.location.protocol!="https:"){noNewTabCheck();document.getElementById("TMSet").click();}    //https和http页面不能镶嵌。
    }
})();

// 资源参考http://www.5ifxw.com/vip/
// 资源参考http://live.gopartook.com/
// 资源参考http://tv.dsqndh.com
// 资源参考http://51.ruyo.net/p/3127.html
//有效性未知||不能直接引用接口
//http://www.yydy8.com/common/?url=
//href="http://mt2t.com/yun?url=
//https://api.47ks.com/webcloud/?v=
//http://www.guqiankun.com/tools/vipvideo
//过期接口
//{"name":"65YW","url":"http://www.65yw.com/65yw/?vid=","title":"新接口，稳定性未知"},
//{"name":"紫狐","url":"http://yun.zihu.tv/play.html?url=","title":"效果可能不稳定"},
//{"name":"云解析","url":"http://www.efunfilm.com/yunparse/index.php?url=","title":"新接口，稳定性未知"},
//{"name":"妹儿云","url":"https://www.yymeier.com/api.php?url=","title":"不稳定"}
//{"name":"V云[腾讯]","url":"http://www.viyun.me/jiexi.php?url=","title":"腾讯首选"},

//https协议页面：film.sohu.com
