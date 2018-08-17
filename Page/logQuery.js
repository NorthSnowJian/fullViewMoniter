//日志查询页面相关的代码

//日志查询模块moduleOne需要定义的变量与函数

//处理返回结果的函数，为json格式的对象
function selectHandle(material){
	$("#oneRowS").text(material["hits"]["total"]);//显示查询到的日志总数
	var data=material["hits"]["hits"];//日志存储数组
	var rowNum=data.length;//当前显示的的日志数
	$("#oneRowSCurrent").text(rowNum);
	$("#infoTableBody").empty();
	var oneTbodyHtml='<tr><th style="width:15%">主机</th><th>地址</th><th>信息</th></tr>';
	for (var i = 0; i < rowNum; i++) {
    	oneTbodyHtml=oneTbodyHtml+'<tr><td style="height:30px;width:15%;vertical-align:middle">';
    	oneTbodyHtml=oneTbodyHtml+data[i]["_source"]["host"]+'</td>';
    	oneTbodyHtml=oneTbodyHtml+'<td style="height:30px;vertical-align:middle">'
    	oneTbodyHtml=oneTbodyHtml+data[i]["_source"]["path"]+'</td>';
    	oneTbodyHtml=oneTbodyHtml+'<td style="height:30px">'
    	oneTbodyHtml=oneTbodyHtml+'<textarea style="height: 100%;width: 100%">';
    	oneTbodyHtml=oneTbodyHtml+data[i]["_source"]["message"]+'</textarea></td></tr>';
    }
	$("#infoTableBody").html(oneTbodyHtml);
}

//文档完全加载完之后执行的代码
$(document).ready(function(){

	//日志查询模块moduleOne相关的操作
	$("#oneMin").click(function(){
		$("#oneBody").toggle();
	});
	$("#oneClose").click(function(){
		$("#oneCard").hide();		
	});
	$("#oneButton").click(function () {
		/*var keyWord=$("#oneKeyWord").val();
		if (keyWord=="") {
			alert("未输入任何关键词，请输入关键词！");
		} else{
			var json="q=message:"+keyWord.replace(/ /g,"%20")+"&size=100";
			$.ajax({
				type: "GET",
				url: "http://10.2.17.211:8080/distributed-monitor/_search",
				data: json,
				dataType: "json",
				success: function(data){
					if (data["hits"]["total"]>0) {
						selectHandle(data);
						$("#oneResult").show();
					} else {
						$("#infoTableBody").empty();
						$("#oneRowSCurrent").text("0");
						$("#oneRowS").text("0");
						$("#oneResult").hide();
						alert("未查询到任何相关的日志！");
					}
				},
				error: function(XMLHttpRequest,textStatus,errorThrown){
					alert(textStatus + errorThrown);
				}
			});
		}*/
		var keyWord=$("#oneKeyWord").val();
		if (keyWord=="") {
			alert("未输入任何关键词，请输入关键词！");
		} else{
			var data='{"took":7,"timed_out":false,"_shards":'
			+'{"total":36,"successful":36,"skipped":0,"failed":0},'
			+'"hits":{"total":57072,"max_score":1.9457735,'
			+'"hits":[{"_index":"tomcat-access","_type":"doc","_id":"5Da-Q2UBRKr2V7cRKLD0",'
			+'"_score":1.9457735,"_source":{"@timestamp":"2018-08-16T17:17:40.346Z",'
			+'"host":"server3","path":"/usr/local/tomcat/logs/localhost_access_log.2018-08-16.log",'
			+'"type":"tomcat-access","@version":"1","message":"message1"}},'
			+'{"_index":"tomcat-access","_type":"doc","_id":"_za-Q2UBRKr2V7cRKLD0",'
			+'"_score":1.9457735,"_source":{"@timestamp":"2018-08-16T17:17:40.347Z",'
			+'"host":"server3","path":"/usr/local/tomcat/logs/localhost_access_log.2018-08-16.log",'
			+'"type":"tomcat-access","@version":"1","message":"message2"}}]}}';
			data=JSON.parse(data);
			if (data["hits"]["total"]>0) {
				selectHandle(data);
				$("#oneResult").show();
			} else {
				$("#infoTableBody").empty();
				$("#oneRowSCurrent").text("0");
				$("#oneRowS").text("0");
				$("#oneResult").hide();
				alert("未查询到任何相关的日志！");
			}
		}
	});
	$("#oneKeyWord").keydown(function () {
		if (event.keyCode=="13") {
			/*var keyWord=$("#oneKeyWord").val();
			if (keyWord=="") {
				alert("未输入任何关键词，请输入关键词！");
			} else{
				var json="q=message:"+keyWord.replace(/ /g,"%20")+"&size=100";
				$.ajax({
					type: "GET",
					url: "http://10.2.17.211:8080/distributed-monitor/_search",
					data: json,
					dataType: "json",
					success: function(data){
						if (data["hits"]["total"]>0) {
							selectHandle(data);
							$("#oneResult").show();
						} else {
							$("#infoTableBody").empty();
							$("#oneRowSCurrent").text("0");
							$("#oneRowS").text("0");
							$("#oneResult").hide();
							alert("未查询到任何相关的日志！");
						}
					},
					error: function(XMLHttpRequest,textStatus,errorThrown){
						alert(textStatus + errorThrown);
					}
				});
			}*/
			var keyWord=$("#oneKeyWord").val();
			if (keyWord=="") {
				alert("未输入任何关键词，请输入关键词！");
			} else{
				var data='{"took":7,"timed_out":false,"_shards":'
				+'{"total":36,"successful":36,"skipped":0,"failed":0},'
				+'"hits":{"total":57072,"max_score":1.9457735,'
				+'"hits":[{"_index":"tomcat-access","_type":"doc","_id":"5Da-Q2UBRKr2V7cRKLD0",'
				+'"_score":1.9457735,"_source":{"@timestamp":"2018-08-16T17:17:40.346Z",'
				+'"host":"server3","path":"/usr/local/tomcat/logs/localhost_access_log.2018-08-16.log",'
				+'"type":"tomcat-access","@version":"1","message":"message1"}},'
				+'{"_index":"tomcat-access","_type":"doc","_id":"_za-Q2UBRKr2V7cRKLD0",'
				+'"_score":1.9457735,"_source":{"@timestamp":"2018-08-16T17:17:40.347Z",'
				+'"host":"server3","path":"/usr/local/tomcat/logs/localhost_access_log.2018-08-16.log",'
				+'"type":"tomcat-access","@version":"1","message":"message2"}}]}}';
				data=JSON.parse(data);
				if (data["hits"]["total"]>0) {
					selectHandle(data);
					$("#oneResult").show();
				} else {
					$("#infoTableBody").empty();
					$("#oneRowSCurrent").text("0");
					$("#oneRowS").text("0");
					$("#oneResult").hide();
					alert("未查询到任何相关的日志！");
				}
			}
		}
	});

	//操作说明模块moduleTwo相关的操作
	$("#twoMin").click(function(){
		$("#twoBody").toggle();
	});
	$("#twoClose").click(function(){
		$("#twoCard").hide();		
	});
});