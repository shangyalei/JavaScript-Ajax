/**
 * Created by think on 2017/7/14.
 */

//帮助函数

function jsonToURL(json){
    json.t=Math.random();
    var ary=[];
    for(var attr in json){
        ary.push(attr+"="+json[attr]);
    }
    return ary.join('&');
}

function jsonParse(jsonStr){
    return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
}

function ajax(json){
    josn=json||{};
    if(!json.url) return;
    var type=json.type||'get';
    var data=json.data||{};
    var url=json.url;
    var jsonp=json.jsonp||"callback";
    var xml=null;
    var timer=null;
    if(window.XMLHttpRequest){
        xml=new XMLHttpRequest();

    }else{
        xml=new ActiveXObject("Microsoft.XMLHTTP");
    }

    switch(type.toLowerCase()){
        case 'get':
            xml.open('get',url+"?"+jsonToURL(data),true);
            xml.send();
            break;
        case 'post':
            xml.open('post',url,true);
            xml.setRequestHeader("Comtent-type","application/x-www-form-urlencoded");
            xml.send(jsonToURL(data));
            break;
        case 'jsonp':
            var fnName='jsonp_'+Math.random();
            fnName=fnName.replace(".","");
            window[fnName]=function(val){
                json.success&&json.success(val);
                document.body.removeChild(oS);
            };
            data[jsonp]=fnName;
            var oS=document.createElement('script');
            oS.src=json.url+"?"+jsonToURL(data);
            document.body.appendChild(oS);
            break;

    }

    json.fnLoading&&json.fnLoading();
    xml.onreadystatechange=function(){
        if(xml.readyState===4){
            json.complete&&json.complete();
            clearTimeout(timer);
            if(/^2\d{2}$/.test(xml.status)){
                if(json.dataType==='json'){
                    json.success&&json.success(jsonParse(xml.responseText));
                }else{
                    json.success&&json.success(xml.responseText);
                }
            }else{
                json.error&&json.error(xml.status);
            }
        }
    };
    if(type==='jsonp') return;

    timer=setTimeout(function(){
        console.log('网速太慢');
        xml.onreadystatechange=null;
    },3000);


}



