//主页面，基本监控页面相关的代码

//生成随机数组对象
function randomArrayObject(min,max,num){	
	if (num==0) {
		num=10;
	}
	else if (num<0) {
		num=-Math.floor(num);
	}
	else if (num>0) {
		num=Math.ceil(num);
	}
	if(max==min){
		max=min+10;
	}
	else if (max<min) {
		var exchange=min;
		min=max;
		max=exchange;
	}
	var data=[];
	for (var i = 0; i < num; i++) {
		data.push(Math.random()*(max-min)+min);
	}
	return data;
}

//某年某月的天数
function dayNum(year,month){
	switch(month){
		case 4:
		case 6:
		case 9:
		case 11:
		return 30;
		case 2:
		if ((year%400==0)||((year%4==0)&&(year%100!=0))) {
			return 29;
		}
		else{
			return 28;
		}
		default :
		return 31;
	}
}

//星期转换数组
var weekday=new Array(7);
weekday[0]="星期日";
weekday[1]="星期一";
weekday[2]="星期二";
weekday[3]="星期三";
weekday[4]="星期四";
weekday[5]="星期五";
weekday[6]="星期六";

//小于10的非负数前加“0”
function checkTime(i){
	if (i<10){
		i="0" + i;
	}
	return i;
}

//时间更新函数
function timeRefresh(timeStr){
	var certainDate=new Date();
	document.getElementById(timeStr).value="      "+certainDate.getFullYear()+'-'
	+checkTime(Number(certainDate.getMonth())+1)+'-'+checkTime(certainDate.getDate())
	+"        "+weekday[certainDate.getDay()]+"        "+checkTime(certainDate.getHours())
	+':'+checkTime(certainDate.getMinutes())+':'+checkTime(certainDate.getSeconds());
}

//百分数转换函数
function toPercent(point){
    var str=Number(point*100).toFixed(2).toString();
    str+="%";
    return str;
}

//实时业务量统计模块moduleOne需要定义的变量与函数
var oneMinute=[];//分相关的变量
var oneHour=[];//时相关的变量
var oneDay=[];//天相关的变量
var oneMonth=[];//月相关的变量
var oneYear=[];//年相关的变量
var oneSymbol=1;//显示内容标志，1表示分，2表示时，3表示天，4表示月，5表示年
var oneInterval;//刷新控制ID
var oneGap=1000;//分显示格式刷新时间间隔，单位为毫秒，默认值为1000
var oneGapHour=oneGap*60;//时显示格式刷新时间间隔
var oneGapDay=oneGapHour*24;//天显示格式刷新时间间隔
var oneGapMonth=oneGapDay*30;//月显示格式刷新时间间隔
var oneGapYear=oneGapMonth*12;//年显示格式刷新时间间隔
var ticksMinute=[];//分相关的x轴刻度
var ticksHour=[];//时相关的x轴刻度
var ticksDay=[];//天相关的x轴刻度
var ticksMonth=[];//月相关的x轴刻度
var ticksYear=[];//年相关的x轴刻度
var collSymOne=0;//折叠控制标志
for (var i = 0; i <60; i++) {
	oneMinute.push([i,i]);
	oneHour.push([i,0]);
	ticksMinute.push([i,""]);
	ticksHour.push([i,""]);
}
for (var i = 0; i <24; i++) {
	oneDay.push([i,0]);
	ticksDay.push([i,""]);
}
for (var i = 0; i <30; i++) {
	oneMonth.push([i,0]);
	ticksMonth.push([i,""]);
}
for (var i = 0; i <12; i++) {
	oneYear.push([i,0]);
	ticksYear.push([i,""]);
}


//实时业务量统计模块刷新函数
function oneRefresh(Symbol){
	var ymax;
	var xmax;
	timeRefresh("oneTime");
	var currentDate=new Date();
	if (Symbol==1) {
		ymax=10;
		xmax=59;
		//ticksMinute更新
		var currentSecond=Number(currentDate.getSeconds());
		for (var i = xmax; i >=0; i--) {
			if (currentSecond<0) {
				if (currentSecond>(-51)) {
					ticksMinute[i][1]=(currentSecond+60).toString();
				} else {
					ticksMinute[i][1]="0"+(currentSecond+60).toString();
				}
			}
			else{
				if (currentSecond<10) {
					ticksMinute[i][1]="0"+currentSecond.toString();
				}
				else{
					ticksMinute[i][1]=currentSecond.toString();
				}
			}
			currentSecond=currentSecond-1;
		}
		//oneMinute更新
		var oneMinuteRef=randomArrayObject(0,ymax,xmax+1);
		for (var i = 0; i <=xmax; i++) {
			oneMinute[i][1]=oneMinuteRef[i];
		}
		//更新图像
		$.plot('#oneChart', [oneMinute], {
			grid: {
			borderColor: '#33FF33',//边框颜色
			borderWidth: 1,//边框宽度
			tickColor: '#E0E0E0',//内部网格颜色
			hoverable: true
		    },
		    series: {
		    shadowSize: 0,//阴影宽度
            color: '#3333FF'//阴影颜色
            },
            lines: {
            fill: true,//是否填充区域
            //fillColor: '#6666FF'//填充颜色
            },
            yaxis: {
            min: 0,
            max: ymax,
            show: true
            },
            xaxis: {
            min: 0,
            max: xmax,
            show: true,
            ticks: ticksMinute
		    }
		});
		/*$.ajax({
			type: "GET",
			url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
			data: "name=BusinessStatisticsService",
			dataType: "json",
			success: function(data){
				if (data["status"]==1) {
					timeRefresh("oneTime");
					var currentDate=new Date();
					//ticksMinute更新
					var currentSecond=Number(currentDate.getSeconds());
					for (var i = xmax; i >=0; i--) {
						if (currentSecond<0) {
							if (currentSecond>(-51)) {
								ticksMinute[i][1]=(currentSecond+60).toString();
							} else {
								ticksMinute[i][1]="0"+(currentSecond+60).toString();
							}
						}
						else{
							if (currentSecond<10) {
								ticksMinute[i][1]="0"+currentSecond.toString();
							}
							else{
								ticksMinute[i][1]=currentSecond.toString();
							}
						}
						currentSecond=currentSecond-1;
					}
					//oneMinute更新
					for (var i = 0; i <=xmax; i++) {
						oneMinute[i][1]=data["value"][xmax-i]["numberofbusiness"];
					}
					//更新图像
					$.plot('#oneChart', [oneMinute], {
						grid: {
						borderColor: '#33FF33',//边框颜色
						borderWidth: 1,//边框宽度
						tickColor: '#E0E0E0',//内部网格颜色
						hoverable: true
					    },
					    series: {
					    shadowSize: 0,//阴影宽度
			            color: '#3333FF'//阴影颜色
			            },
			            lines: {
			            fill: true,//是否填充区域
			            //fillColor: '#6666FF'//填充颜色
			            },
			            yaxis: {
			            min: 0,
			            max: ymax,
			            show: true
			            },
			            xaxis: {
			            min: 0,
			            max: xmax,
			            show: true,
			            ticks: ticksMinute
					    }
					});
				} else {
					alert("后台操作失败！");
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert(textStatus + errorThrown);
			}
		});*/
	}
	if (Symbol==2) {
		ymax=1000;
		xmax=59;
		//ticksHour更新
		var currentMinute=Number(currentDate.getMinutes());
		for (var i = xmax; i >=0; i--) {
			if (currentMinute<0) {
				if (currentMinute>(-51)) {
					ticksHour[i][1]=(currentMinute+60).toString();
				} else {
					ticksHour[i][1]="0"+(currentMinute+60).toString();
				}
			}
			else{
				if (currentMinute<10) {
					ticksHour[i][1]="0"+currentMinute.toString();
				}
				else{
					ticksHour[i][1]=currentMinute.toString();
				}
			}
			currentMinute=currentMinute-1;
		}
		//oneHour更新
		oneHourRef=randomArrayObject(0,ymax,xmax+1);
		for (var i = 0; i <=xmax; i++) {
			oneHour[i][1]=oneHourRef[i];
		}
		//更新图像
		$.plot('#oneChart', [oneHour], {
			grid: {
			borderColor: '#33FF33',//边框颜色
			borderWidth: 1,//边框宽度
			tickColor: '#E0E0E0',//内部网格颜色
			hoverable: true
		    },
		    series: {
		    shadowSize: 0,//阴影宽度
            color: '#3333FF'//阴影颜色
            },
            lines: {
            fill: true,//是否填充区域
            //fillColor: '#6666FF'//填充颜色
            },
            yaxis: {
            min: 0,
            max: ymax,
            show: true
            },
            xaxis: {
            min: 0,
            max: xmax,
            show: true,
            ticks: ticksHour
		    }
		});
		/*$.ajax({
			type: "GET",
			url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
			data: "name=FindPortfolioMinute",
			dataType: "json",
			success: function(data){
				if (data["status"]==1) {
					timeRefresh("oneTime");
					var currentDate=new Date();
					//ticksHour更新
					var currentMinute=Number(currentDate.getMinutes());
					for (var i = xmax; i >=0; i--) {
						if (currentMinute<0) {
							if (currentMinute>(-51)) {
								ticksHour[i][1]=(currentMinute+60).toString();
							} else {
								ticksHour[i][1]="0"+(currentMinute+60).toString();
							}
						}
						else{
							if (currentMinute<10) {
								ticksHour[i][1]="0"+currentMinute.toString();
							}
							else{
								ticksHour[i][1]=currentMinute.toString();
							}
						}
						currentMinute=currentMinute-1;
					}
					//oneHour更新
					for (var i = 0; i <=xmax; i++) {
						oneHour[i][1]=data["value"][xmax-i]["number"];
					}
					//更新图像
					$.plot('#oneChart', [oneHour], {
						grid: {
						borderColor: '#33FF33',//边框颜色
						borderWidth: 1,//边框宽度
						tickColor: '#E0E0E0',//内部网格颜色
						hoverable: true
					    },
					    series: {
					    shadowSize: 0,//阴影宽度
			            color: '#3333FF'//阴影颜色
			            },
			            lines: {
			            fill: true,//是否填充区域
			            //fillColor: '#6666FF'//填充颜色
			            },
			            yaxis: {
			            min: 0,
			            max: ymax,
			            show: true
			            },
			            xaxis: {
			            min: 0,
			            max: xmax,
			            show: true,
			            ticks: ticksHour
					    }
					});
				} else {
					alert("后台操作失败！");
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert(textStatus + errorThrown);
			}
		});*/
	}
	if (Symbol==3) {
		ymax=10000;
		xmax=23;
		//ticksDay更新
		var currentHour=Number(currentDate.getHours());
		for (var i = xmax; i >=0; i--) {
			if (currentHour<0) {
				if (currentHour>(-15)) {
					ticksDay[i][1]=(currentHour+24).toString();
				} else {
					ticksDay[i][1]="0"+(currentHour+24).toString();
				}
			}
			else{
				if (currentHour<10) {
					ticksDay[i][1]="0"+currentHour.toString();
				}
				else{
					ticksDay[i][1]=currentHour.toString();
				}
			}
			currentHour=currentHour-1;
		}
		//oneDay更新
		oneDayRef=randomArrayObject(0,ymax,xmax+1);
		for (var i = 0; i <=xmax; i++) {
			oneDay[i][1]=oneDayRef[i];
		}
		//更新图像
		$.plot('#oneChart', [oneDay], {
			grid: {
			borderColor: '#33FF33',//边框颜色
			borderWidth: 1,//边框宽度
			tickColor: '#E0E0E0',//内部网格颜色
			hoverable: true
		    },
		    series: {
		    shadowSize: 0,//阴影宽度
            color: '#3333FF'//阴影颜色
            },
            lines: {
            fill: true,//是否填充区域
            //fillColor: '#6666FF'//填充颜色
            },
            yaxis: {
            min: 0,
            max: ymax,
            show: true
            },
            xaxis: {
            min: 0,
            max: xmax,
            show: true,
            ticks: ticksDay
		    }
		});
		/*$.ajax({
			type: "GET",
			url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
			data: "name=FindPortfolioHour",
			dataType: "json",
			success: function(data){
				if (data["status"]==1) {
					timeRefresh("oneTime");
					var currentDate=new Date();
					//ticksDay更新
					var currentHour=Number(currentDate.getHours());
					for (var i = xmax; i >=0; i--) {
						if (currentHour<0) {
							if (currentHour>(-15)) {
								ticksDay[i][1]=(currentHour+24).toString();
							} else {
								ticksDay[i][1]="0"+(currentHour+24).toString();
							}
						}
						else{
							if (currentHour<10) {
								ticksDay[i][1]="0"+currentHour.toString();
							}
							else{
								ticksDay[i][1]=currentHour.toString();
							}
						}
						currentHour=currentHour-1;
					}
					//oneDay更新
					oneDayRef=randomArrayObject(0,ymax,xmax+1);
					for (var i = 0; i <=xmax; i++) {
						oneDay[i][1]=data["value"][xmax-i]["number"];
					}
					//更新图像
					$.plot('#oneChart', [oneDay], {
						grid: {
						borderColor: '#33FF33',//边框颜色
						borderWidth: 1,//边框宽度
						tickColor: '#E0E0E0',//内部网格颜色
						hoverable: true
					    },
					    series: {
					    shadowSize: 0,//阴影宽度
			            color: '#3333FF'//阴影颜色
			            },
			            lines: {
			            fill: true,//是否填充区域
			            //fillColor: '#6666FF'//填充颜色
			            },
			            yaxis: {
			            min: 0,
			            max: ymax,
			            show: true
			            },
			            xaxis: {
			            min: 0,
			            max: xmax,
			            show: true,
			            ticks: ticksDay
					    }
					});
				} else {
					alert("后台操作失败！");
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert(textStatus + errorThrown);
			}
		});*/
	}
	if (Symbol==4) {
		ymax=100000;
		xmax=29;
		//ticksMonth更新
		var currentDay=Number(currentDate.getDate());
		var currentMonth=Number(currentDate.getMonth())+1;
		var currentYear=Number(currentDate.getFullYear());
		if ((currentYear%400!=0)&&((currentYear%4!=0)||(currentYear%100==0))&&(currentMonth==3)&&(currentDay==1)) {
			ticksMonth[0][1]="31";
			ticksMonth[29][1]="01";
			for (var i = 1; i < 29; i++) {
				if (i<10) {
					ticksMonth[i][1]="0"+i.toString();
				} else {
					ticksMonth[i][1]=i.toString();
				}
			}
		} 
		else {
			if (currentDay==31) {
				var remDay=29;
				for (var i = 31; i >1; i--) {
					if (i<10) {
						ticksMonth[remDay][1]="0"+i.toString();
					} else {
						ticksMonth[remDay][1]=i.toString();
					}
					remDay--;
				}
			} else {
				var remDay=29;
				for (var i = currentDay; i >0; i--) {
					if (i<10) {
						ticksMonth[remDay][1]="0"+i.toString();
					} else {
						ticksMonth[remDay][1]=i.toString();
					}
					remDay--;
				}
				var preMonthDay;
				if (currentMonth==1) {
					preMonthDay=31;
				} else {
					preMonthDay=dayNum(currentYear,currentMonth-1);
				}
				for (var i = remDay; i >=0; i--) {
					if (preMonthDay<10) {
						ticksMonth[i][1]="0"+preMonthDay.toString();
					} else {
						ticksMonth[i][1]=preMonthDay.toString();
					}
					preMonthDay--;
				}
			}		
		}
		//oneMonth更新
		oneMonthRef=randomArrayObject(0,ymax,xmax+1);
		for (var i = 0; i <=xmax; i++) {
			oneMonth[i][1]=oneMonthRef[i];
		}
		//更新图像
		$.plot('#oneChart', [oneMonth], {
			grid: {
			borderColor: '#33FF33',//边框颜色
			borderWidth: 1,//边框宽度
			tickColor: '#E0E0E0',//内部网格颜色
			hoverable: true
		    },
		    series: {
		    shadowSize: 0,//阴影宽度
            color: '#3333FF'//阴影颜色
            },
            lines: {
            fill: true,//是否填充区域
            //fillColor: '#6666FF'//填充颜色
            },
            yaxis: {
            min: 0,
            max: ymax,
            show: true
            },
            xaxis: {
            min: 0,
            max: xmax,
            show: true,
            ticks: ticksMonth
		    }
		});
		/*$.ajax({
			type: "GET",
			url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
			data: "name=FindPortfolioDay",
			dataType: "json",
			success: function(data){
				if (data["status"]==1) {
					timeRefresh("oneTime");
					var currentDate=new Date();
					//ticksMonth更新
					//((year%400==0)||((year%4==0)&&(year%100!=0)))表示闰年
					var currentDay=Number(currentDate.getDate());
					var currentMonth=Number(currentDate.getMonth())+1;
					var currentYear=Number(currentDate.getFullYear());
					if ((currentYear%400!=0)&&((currentYear%4!=0)||(currentYear%100==0))&&(currentMonth==3)&&(currentDay==1)) {
						ticksMonth[0][1]="31";
						ticksMonth[29][1]="01";
						for (var i = 1; i < 29; i++) {
							if (i<10) {
								ticksMonth[i][1]="0"+i.toString();
							} else {
								ticksMonth[i][1]=i.toString();
							}
						}
					} 
					else {
						if (currentDay==31) {
							var remDay=29;
							for (var i = 31; i >1; i--) {
								if (i<10) {
									ticksMonth[remDay][1]="0"+i.toString();
								} else {
									ticksMonth[remDay][1]=i.toString();
								}
								remDay--;
							}
						} else {
							var remDay=29;
							for (var i = currentDay; i >0; i--) {
								if (i<10) {
									ticksMonth[remDay][1]="0"+i.toString();
								} else {
									ticksMonth[remDay][1]=i.toString();
								}
								remDay--;
							}
							var preMonthDay;
							if (currentMonth==1) {
								preMonthDay=31;
							} else {
								preMonthDay=dayNum(currentYear,currentMonth-1);
							}
							for (var i = remDay; i >=0; i--) {
								if (preMonthDay<10) {
									ticksMonth[i][1]="0"+preMonthDay.toString();
								} else {
									ticksMonth[i][1]=preMonthDay.toString();
								}
								preMonthDay--;
							}
						}		
					}
					//oneMonth更新
					for (var i = 0; i <=xmax; i++) {
						oneMonth[i][1]=data["value"][xmax-i]["number"];
					}
					//更新图像
					$.plot('#oneChart', [oneMonth], {
						grid: {
						borderColor: '#33FF33',//边框颜色
						borderWidth: 1,//边框宽度
						tickColor: '#E0E0E0',//内部网格颜色
						hoverable: true
					    },
					    series: {
					    shadowSize: 0,//阴影宽度
			            color: '#3333FF'//阴影颜色
			            },
			            lines: {
			            fill: true,//是否填充区域
			            //fillColor: '#6666FF'//填充颜色
			            },
			            yaxis: {
			            min: 0,
			            max: ymax,
			            show: true
			            },
			            xaxis: {
			            min: 0,
			            max: xmax,
			            show: true,
			            ticks: ticksMonth
					    }
					});
				} else {
					alert("后台操作失败！");
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert(textStatus + errorThrown);
			}
		});*/
	}
	if (Symbol==5) {
		ymax=1000000;
		xmax=11;
		//ticksYear更新
		var currentMonth=Number(currentDate.getMonth())+1;
		for (var i = xmax; i >=0; i--) {
			if (currentMonth<1) {
				if (currentMonth>(-3)) {
					ticksYear[i][1]=(currentMonth+12).toString();
				} else {
					ticksYear[i][1]="0"+(currentMonth+12).toString();
				}
			}
			else{
				if (currentMonth<10) {
					ticksYear[i][1]="0"+currentMonth.toString();
				}
				else{
					ticksYear[i][1]=currentMonth.toString();
				}
			}
			currentMonth=currentMonth-1;
		}
		//oneYear更新
		oneYearRef=randomArrayObject(0,ymax,xmax+1);
		for (var i = 0; i <=xmax; i++) {
			oneYear[i][1]=oneYearRef[i];
		}
		//更新图像
		$.plot('#oneChart', [oneYear], {
			grid: {
			borderColor: '#33FF33',//边框颜色
			borderWidth: 1,//边框宽度
			tickColor: '#E0E0E0',//内部网格颜色
			hoverable: true
		    },
		    series: {
		    shadowSize: 0,//阴影宽度
            color: '#3333FF'//阴影颜色
            },
            lines: {
            fill: true,//是否填充区域
            //fillColor: '#6666FF'//填充颜色
            },
            yaxis: {
            min: 0,
            max: ymax,
            show: true
            },
            xaxis: {
            min: 0,
            max: xmax,
            show: true,
            ticks: ticksYear
		    }
		});
		/*$.ajax({
			type: "GET",
			url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
			data: "name=FindPortfolioMonth",
			dataType: "json",
			success: function(data){
				if (data["status"]==1) {
					timeRefresh("oneTime");
					var currentDate=new Date();
					//ticksYear更新
					var currentMonth=Number(currentDate.getMonth())+1;
					for (var i = xmax; i >=0; i--) {
						if (currentMonth<1) {
							if (currentMonth>(-3)) {
								ticksYear[i][1]=(currentMonth+12).toString();
							} else {
								ticksYear[i][1]="0"+(currentMonth+12).toString();
							}
						}
						else{
							if (currentMonth<10) {
								ticksYear[i][1]="0"+currentMonth.toString();
							}
							else{
								ticksYear[i][1]=currentMonth.toString();
							}
						}
						currentMonth=currentMonth-1;
					}
					//oneYear更新
					for (var i = 0; i <=xmax; i++) {
						oneYear[i][1]=data["value"][xmax-i]["number"];
					}
					//更新图像
					$.plot('#oneChart', [oneYear], {
						grid: {
						borderColor: '#33FF33',//边框颜色
						borderWidth: 1,//边框宽度
						tickColor: '#E0E0E0',//内部网格颜色
						hoverable: true
					    },
					    series: {
					    shadowSize: 0,//阴影宽度
			            color: '#3333FF'//阴影颜色
			            },
			            lines: {
			            fill: true,//是否填充区域
			            //fillColor: '#6666FF'//填充颜色
			            },
			            yaxis: {
			            min: 0,
			            max: ymax,
			            show: true
			            },
			            xaxis: {
			            min: 0,
			            max: xmax,
			            show: true,
			            ticks: ticksYear
					    }
					});
				} else {
					alert("后台操作失败！");
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert(textStatus + errorThrown);
			}
		});*/
	}
}

//发起渠道模块moduleTwo需要定义的变量与函数
var twoOne=0;//手机网银渠道相关的变量
var twoTwo=0;//企业网银渠道相关的变量
var twoThree=0;//清算网银渠道相关的变量
var twoFour=0;//柜面渠道相关的变量
var twoFive=0;//POS渠道相关的变量
var twoSix=0;//自动终端渠道相关的变量
var twoInterval;//刷新控制ID
var twoGap=1000;//刷新时间间隔，单位为毫秒，默认值为1000
var collSymTwo=0;//折叠控制标志

//发起渠道模块刷新函数
function twoRefresh(){
	timeRefresh("twoTime");
	twoOne=Math.random();
	twoTwo=Math.random();
	twoThree=Math.random();
	twoFour=Math.random();
	twoFive=Math.random();
	twoSix=Math.random();
	var twoSetOne= [{ label: "手机网银", data: twoOne, color: '#FF3333'},
	{ label: "企业网银", data: twoTwo, color: '#FFFF33'},
	{ label: "清算网银", data: twoThree, color: '#33FF66'},
	{ label: "柜面", data: twoFour, color: '#3399FF'},
	{ label: "POS", data: twoFive, color: '#9933FF'},
    { label: "自动终端", data: twoSix, color: '#CCFFFF'}];
    $.plot("#twoChart", twoSetOne, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#000000',
        			width: 1
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	var twoSum=twoOne+twoTwo+twoThree+twoFour+twoFive+twoSix;
	var twoOneP=twoOne/twoSum;
	var twoTwoP=twoTwo/twoSum;
	var twoThreeP=twoThree/twoSum;
	var twoFourP=twoFour/twoSum;
	var twoFiveP=twoFive/twoSum;
	var twoSixP=twoSix/twoSum;
	$("#twoTable11").text(twoOne.toFixed(4));
	$("#twoTable21").text(twoTwo.toFixed(4));
	$("#twoTable31").text(twoThree.toFixed(4));
	$("#twoTable41").text(twoFour.toFixed(4));
	$("#twoTable51").text(twoFive.toFixed(4));
	$("#twoTable61").text(twoSix.toFixed(4));
	$("#twoTable12").text(toPercent(twoOneP));
	$("#twoTable22").text(toPercent(twoTwoP));
	$("#twoTable32").text(toPercent(twoThreeP));
	$("#twoTable42").text(toPercent(twoFourP));
	$("#twoTable52").text(toPercent(twoFiveP));
	$("#twoTable62").text(toPercent(twoSixP));
	/*$.ajax({
		type: "GET",
		url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
		data: "name=InitiationChannelService",
		dataType: "json",
		success: function(data){
			if (data["status"]==1) {
				timeRefresh("twoTime");
				//twoOne=data["value"][0]["channel"];
				//twoTwo=data["value"][1]["channel"];
				//twoThree=data["value"][2]["channel"];
				//twoFour=data["value"][3]["channel"];
				//twoFive=data["value"][4]["channel"];
				//twoSix=data["value"][5]["channel"];
				twoOne=data["value"]["phone"];
				twoTwo=data["value"]["enterprise"];
				twoThree=data["value"]["liqudation"];
				twoFour=data["value"]["counter"];
				twoFive=data["value"]["posservice"];
				twoSix=data["value"]["selfservice"];
				var twoSetOne= [{ label: "手机网银", data: twoOne, color: '#FF3333'},
				{ label: "企业网银", data: twoTwo, color: '#FFFF33'},
				{ label: "清算网银", data: twoThree, color: '#33FF66'},
				{ label: "柜面", data: twoFour, color: '#3399FF'},
				{ label: "POS", data: twoFive, color: '#9933FF'},
			    { label: "自动终端", data: twoSix, color: '#CCFFFF'}];
			    $.plot("#twoChart", twoSetOne, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#000000',
			        			width: 1
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				var twoSum=twoOne+twoTwo+twoThree+twoFour+twoFive+twoSix;
				var twoOneP=twoOne/twoSum;
				var twoTwoP=twoTwo/twoSum;
				var twoThreeP=twoThree/twoSum;
				var twoFourP=twoFour/twoSum;
				var twoFiveP=twoFive/twoSum;
				var twoSixP=twoSix/twoSum;
				$("#twoTable11").text(twoOne.toFixed(4));
				$("#twoTable21").text(twoTwo.toFixed(4));
				$("#twoTable31").text(twoThree.toFixed(4));
				$("#twoTable41").text(twoFour.toFixed(4));
				$("#twoTable51").text(twoFive.toFixed(4));
				$("#twoTable61").text(twoSix.toFixed(4));
				$("#twoTable12").text(toPercent(twoOneP));
				$("#twoTable22").text(toPercent(twoTwoP));
				$("#twoTable32").text(toPercent(twoThreeP));
				$("#twoTable42").text(toPercent(twoFourP));
				$("#twoTable52").text(toPercent(twoFiveP));
				$("#twoTable62").text(toPercent(twoSixP));
			} else {
				alert("后台操作失败！");
			}
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert(textStatus + errorThrown);
		}
	});*/
}

//报文类型模块moduleThree需要定义的变量与函数
var threeOne=0;//贷记发报类型相关的变量
var threeTwo=0;//贷记收报类型相关的变量
var threeThree=0;//借记发报类型相关的变量
var threeFour=0;//借记收报类型相关的变量
var threeFive=0;//第三方发报类型相关的变量
var threeSix=0;//第三方收报类型相关的变量
var threeInterval;//刷新控制ID
var threeGap=1000;//刷新时间间隔，单位为毫秒，默认值为1000
var collSymThree=0;//折叠控制标志

//报文类型模块刷新函数
function threeRefresh(){
	timeRefresh("threeTime");
	threeOne=Math.random();
	threeTwo=Math.random();
	threeThree=Math.random();
	threeFour=Math.random();
	threeFive=Math.random();
	threeSix=Math.random();
	var threeSetOne= [{ label: "贷记发报", data: threeOne, color: '#FF3333'},
	{ label: "贷记收报", data: threeTwo, color: '#FFFF33'},
	{ label: "借记发报", data: threeThree, color: '#33FF66'},
	{ label: "借记收报", data: threeFour, color: '#3399FF'},
	{ label: "第三方发报", data: threeFive, color: '#9933FF'},
    { label: "第三方收报", data: threeSix, color: '#CCFFFF'}];
    $.plot("#threeChart", threeSetOne, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#000000',
        			width: 1
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	var threeSum=threeOne+threeTwo+threeThree+threeFour+threeFive+threeSix;
	var threeOneP=threeOne/threeSum;
	var threeTwoP=threeTwo/threeSum;
	var threeThreeP=threeThree/threeSum;
	var threeFourP=threeFour/threeSum;
	var threeFiveP=threeFive/threeSum;
	var threeSixP=threeSix/threeSum;
	$("#threeTable11").text(threeOne.toFixed(4));
	$("#threeTable21").text(threeTwo.toFixed(4));
	$("#threeTable31").text(threeThree.toFixed(4));
	$("#threeTable41").text(threeFour.toFixed(4));
	$("#threeTable51").text(threeFive.toFixed(4));
	$("#threeTable61").text(threeSix.toFixed(4));
	$("#threeTable12").text(toPercent(threeOneP));
	$("#threeTable22").text(toPercent(threeTwoP));
	$("#threeTable32").text(toPercent(threeThreeP));
	$("#threeTable42").text(toPercent(threeFourP));
	$("#threeTable52").text(toPercent(threeFiveP));
	$("#threeTable62").text(toPercent(threeSixP));
	/*$.ajax({
		type: "GET",
		url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
		data: "name=MessageTypeServive",
		dataType: "json",
		success: function(data){
			if (data["status"]==1) {
				timeRefresh("threeTime");
				//threeOne=data["value"][0]["type"];
				//threeTwo=data["value"][1]["type"];
				//threeThree=data["value"][2]["type"];
				//threeFour=data["value"][3]["type"];
				//threeFive=data["value"][4]["type"];
				//threeSix=data["value"][5]["type"];
				threeOne=data["value"]["creditreceive"];
				threeTwo=data["value"]["credittransmitting"];
				threeThree=data["value"]["debitreceive"];
				threeFour=data["value"]["debittransmitting"];
				threeFive=data["value"]["thirdreceive"];
				threeSix=data["value"]["thirdtransmitting"];
				var threeSetOne= [{ label: "贷记发报", data: threeOne, color: '#FF3333'},
				{ label: "贷记收报", data: threeTwo, color: '#FFFF33'},
				{ label: "借记发报", data: threeThree, color: '#33FF66'},
				{ label: "借记收报", data: threeFour, color: '#3399FF'},
				{ label: "第三方发报", data: threeFive, color: '#9933FF'},
			    { label: "第三方收报", data: threeSix, color: '#CCFFFF'}];
			    $.plot("#threeChart", threeSetOne, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#000000',
			        			width: 1
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				var threeSum=threeOne+threeTwo+threeThree+threeFour+threeFive+threeSix;
				var threeOneP=threeOne/threeSum;
				var threeTwoP=threeTwo/threeSum;
				var threeThreeP=threeThree/threeSum;
				var threeFourP=threeFour/threeSum;
				var threeFiveP=threeFive/threeSum;
				var threeSixP=threeSix/threeSum;
				$("#threeTable11").text(threeOne.toFixed(4));
				$("#threeTable21").text(threeTwo.toFixed(4));
				$("#threeTable31").text(threeThree.toFixed(4));
				$("#threeTable41").text(threeFour.toFixed(4));
				$("#threeTable51").text(threeFive.toFixed(4));
				$("#threeTable61").text(threeSix.toFixed(4));
				$("#threeTable12").text(toPercent(threeOneP));
				$("#threeTable22").text(toPercent(threeTwoP));
				$("#threeTable32").text(toPercent(threeThreeP));
				$("#threeTable42").text(toPercent(threeFourP));
				$("#threeTable52").text(toPercent(threeFiveP));
				$("#threeTable62").text(toPercent(threeSixP));
			} else {
				alert("后台操作失败！");
			}
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert(textStatus + errorThrown);
		}
	});*/
}


//业务交易率模块moduleFour需要定义的变量与函数
var fourOne=0;//个人账户相关的变量
var fourTwo=0;//热点账户相关的变量
var fourThree=0;//对公非热点账户相关的变量
var fourInterval;//刷新控制ID
var fourGap=1000;//刷新时间间隔，单位为毫秒，默认值为1000
var collSymFour=0;//折叠控制标志

//业务交易率模块刷新函数
function fourRefresh(){
	timeRefresh("fourTime");
	fourOne=Math.random();
	fourTwo=Math.random();
	fourThree=Math.random();
	var fourSetOne= [{ label: "已发报", data: fourOne, color: 'red'},
	{ label: "未发报", data: (1-fourOne), color: '#C0C0C0'}];
    $.plot("#fourChartOne", fourSetOne, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		innerRadius: 0.5,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#FFFFFF',
        			width: 0
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	var fourSetTwo= [{ label: "已发报", data: fourTwo, color: 'yellow'},
	{ label: "未发报", data: (1-fourTwo), color: '#C0C0C0'}];
    $.plot("#fourChartTwo", fourSetTwo, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		innerRadius: 0.5,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#FFFFFF',
        			width: 0
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	var fourSetThree= [{ label: "已发报", data: fourThree, color: 'blue'},
	{ label: "未发报", data: (1-fourThree), color: '#C0C0C0'}];
    $.plot("#fourChartThree", fourSetThree, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		innerRadius: 0.5,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#FFFFFF',
        			width: 0
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	$("#fourDataOne").text(toPercent(fourOne));
	$("#fourDataTwo").text(toPercent(fourTwo));
	$("#fourDataThree").text(toPercent(fourThree));
	/*$.ajax({
		type: "GET",
		url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
		//"http://10.2.17.211:8080/distributed-monitor/data.do",
		data: "name=BusinessTransactionRateService",//"type=4",
		dataType: "json",
		success: function(data){
			if (data["status"]==1) {
				timeRefresh("fourTime");
				//fourOne=data["values"][0]["rate"];
				//fourTwo=data["values"][1]["rate"];
				//fourThree=data["values"][2]["rate"];
				fourOne=data["value"]["individualaccount"];
				fourTwo=data["value"]["hotaccount"];
				fourThree=data["value"]["nothotaccount"];
				var fourSetOne= [{ label: "已发报", data: fourOne, color: 'red'},
				{ label: "未发报", data: (1-fourOne), color: '#C0C0C0'}];
			    $.plot("#fourChartOne", fourSetOne, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		innerRadius: 0.5,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#FFFFFF',
			        			width: 0
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				var fourSetTwo= [{ label: "已发报", data: fourTwo, color: 'yellow'},
				{ label: "未发报", data: (1-fourTwo), color: '#C0C0C0'}];
			    $.plot("#fourChartTwo", fourSetTwo, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		innerRadius: 0.5,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#FFFFFF',
			        			width: 0
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				var fourSetThree= [{ label: "已发报", data: fourThree, color: 'blue'},
				{ label: "未发报", data: (1-fourThree), color: '#C0C0C0'}];
			    $.plot("#fourChartThree", fourSetThree, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		innerRadius: 0.5,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#FFFFFF',
			        			width: 0
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				$("#fourDataOne").text(toPercent(fourOne));
				$("#fourDataTwo").text(toPercent(fourTwo));
				$("#fourDataThree").text(toPercent(fourThree));
			} else {
				alert("后台操作失败！");
			}
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert(textStatus +" "+ errorThrown);
		}
	});*/	
}

//业务成功率模块moduleFive需要定义的变量与函数
var fiveOne=0;//个人账户相关的变量
var fiveTwo=0;//热点账户相关的变量
var fiveThree=0;//对公非热点账户相关的变量
var fiveInterval;//刷新控制ID
var fiveGap=1000;//刷新时间间隔，单位为毫秒，默认值为1000
var collSymFive=0;//折叠控制标志

//业务成功率模块刷新函数
function fiveRefresh(){
	timeRefresh("fiveTime");
	fiveOne=Math.random();
	fiveTwo=Math.random();
	fiveThree=Math.random();
	var fiveSetOne= [{ label: "已发报", data: fiveOne, color: '#00FF00'},
	{ label: "未发报", data: (1-fiveOne), color: '#C0C0C0'}];
    $.plot("#fiveChartOne", fiveSetOne, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		innerRadius: 0.5,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#FFFFFF',
        			width: 0
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	var fiveSetTwo= [{ label: "已发报", data: fiveTwo, color: '#00FFFF'},
	{ label: "未发报", data: (1-fiveTwo), color: '#C0C0C0'}];
    $.plot("#fiveChartTwo", fiveSetTwo, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		innerRadius: 0.5,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#FFFFFF',
        			width: 0
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	var fiveSetThree= [{ label: "已发报", data: fiveThree, color: '#993399'},
	{ label: "未发报", data: (1-fiveThree), color: '#C0C0C0'}];
    $.plot("#fiveChartThree", fiveSetThree, {
        series: {
        	pie: { 
        		show: true,
        		radius: 0.98,
        		innerRadius: 0.5,
        		label: {
        			show: false
        		},
        		stroke: {
        			color: '#FFFFFF',
        			width: 0
        		}
        	}
        },
        legend: {
        	show: false
        }
    });
	$("#fiveDataOne").text(toPercent(fiveOne));
	$("#fiveDataTwo").text(toPercent(fiveTwo));
	$("#fiveDataThree").text(toPercent(fiveThree));
	/*$.ajax({
		type: "GET",
		url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
		data: "name=TransactionSuccessRateService",
		dataType: "json",
		success: function(data){
			if (data["status"]==1) {
				timeRefresh("fiveTime");
				//fiveOne=data["value"][0]["rate2"];
				//fiveTwo=data["value"][0]["rate2"];
				//fiveThree=data["value"][0]["rate2"];
				fiveOne=data["value"]["personsuccessrate"];
				fiveTwo=data["value"]["hotspotsuccessrate"];
				fiveThree=data["value"]["otherrate"];
				var fiveSetOne= [{ label: "已发报", data: fiveOne, color: '#00FF00'},
				{ label: "未发报", data: (1-fiveOne), color: '#C0C0C0'}];
			    $.plot("#fiveChartOne", fiveSetOne, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		innerRadius: 0.5,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#FFFFFF',
			        			width: 0
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				var fiveSetTwo= [{ label: "已发报", data: fiveTwo, color: '#00FFFF'},
				{ label: "未发报", data: (1-fiveTwo), color: '#C0C0C0'}];
			    $.plot("#fiveChartTwo", fiveSetTwo, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		innerRadius: 0.5,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#FFFFFF',
			        			width: 0
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				var fiveSetThree= [{ label: "已发报", data: fiveThree, color: '#993399'},
				{ label: "未发报", data: (1-fiveThree), color: '#C0C0C0'}];
			    $.plot("#fiveChartThree", fiveSetThree, {
			        series: {
			        	pie: { 
			        		show: true,
			        		radius: 0.98,
			        		innerRadius: 0.5,
			        		label: {
			        			show: false
			        		},
			        		stroke: {
			        			color: '#FFFFFF',
			        			width: 0
			        		}
			        	}
			        },
			        legend: {
			        	show: false
			        }
			    });
				$("#fiveDataOne").text(toPercent(fiveOne));
				$("#fiveDataTwo").text(toPercent(fiveTwo));
				$("#fiveDataThree").text(toPercent(fiveThree));
			} else {
				alert("后台操作失败！");
			}
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert(textStatus + errorThrown);
		}
	});*/	
}

//服务可用性模块moduleSix需要定义的变量与函数
var sixOne;//服务1可用率相关的变量
var sixTwo;//服务1可用数相关的变量
var sixThree="";//服务1状态相关的变量
var sixFour;//服务2可用率相关的变量
var sixFive;//服务2可用数相关的变量
var sixSix="";//服务2状态相关的变量
var sixSeven;//服务3可用率相关的变量
var sixEgiht;//服务3可用数相关的变量
var sixNine="";//服务3状态相关的变量
var sixInterval;//刷新控制ID
var sixGap=1000;//刷新时间间隔，单位为毫秒，默认值为1000
var collSymSix=0;//折叠控制标志
var rowOneSym=0;//服务1详情控制标志
var rowTwoSym=0;//服务2详情控制标志
var rowThreeSym=0;//服务3详情控制标志

//服务可用性模块刷新函数
function sixRefresh(){
	timeRefresh("sixTime");
	sixOne=Math.random();
	sixTwo=Math.random();
	//服务1状态更新
	sixFour=Math.random();
	sixFive=Math.random();
	//服务2状态更新
	sixSeven=Math.random();
	sixEgiht=Math.random();
	//服务3状态更新
	$("#sixTable11").attr("style","width: "+toPercent(sixOne));
	$("#sixTable11").children("span").text(toPercent(sixOne));
	$("#sixTable12").text((sixTwo*100).toFixed(0));
	$("#sixTable21").attr("style","width: "+toPercent(sixFour));
	$("#sixTable21").children("span").text(toPercent(sixFour));
	$("#sixTable22").text((sixFive*100).toFixed(0));
	$("#sixTable31").attr("style","width: "+toPercent(sixSeven));
	$("#sixTable31").children("span").text(toPercent(sixSeven));
	$("#sixTable32").text((sixEgiht*100).toFixed(0));
	if (rowOneSym==1) {
		$("#sixTitle").text("服务1详情");
		$("#sixTableN1").text("服务1");
		$("#sixTableN2").text("集群1");
		$("#sixTableN3").attr("style","width: "+toPercent(sixOne));
		$("#sixTableN3").children("span").text(toPercent(sixOne));
		$("#sixTableN4").text((sixTwo*100).toFixed(0));
		$("#sixTableN5").text(sixThree);
	}
	if (rowTwoSym==1) {
		$("#sixTitle").text("服务2详情");
		$("#sixTableN1").text("服务2");
		$("#sixTableN2").text("集群2");
		$("#sixTableN3").attr("style","width: "+toPercent(sixFour));
		$("#sixTableN3").children("span").text(toPercent(sixFour));
		$("#sixTableN4").text((sixFive*100).toFixed(0));
		$("#sixTableN5").text(sixSix);
	}
	if (rowThreeSym==1) {
		$("#sixTitle").text("服务3详情");
		$("#sixTableN1").text("服务3");
		$("#sixTableN2").text("集群3");
		$("#sixTableN3").attr("style","width: "+toPercent(sixSeven));
		$("#sixTableN3").children("span").text(toPercent(sixSeven));
		$("#sixTableN4").text((sixEgiht*100).toFixed(0));
		$("#sixTableN5").text(sixNine);
	}
	/*$.ajax({
		type: "GET",
		url: "http://10.2.17.211:8080/distributed-monitor-consumer3/returnMonitor.do",
		data: "name=ServiceAvailabilityService",
		dataType: "json",
		success: function(data){
			if (data["status"]==1) {
				timeRefresh("sixTime");
				serviceOneState=data["value"][0]["state"];
				sixOne=data["value"][0]["numberofavailable"]/10;
				sixTwo=data["value"][0]["numberofavailable"];
				//服务1状态更新
				//sixThree=serviceOneState;
				//sixThree=JSON.stringify(data["value"][0]["state"]);
				sixThree="";
				for (var i = 0; i < sixTwo-1; i++) {
					sixThree=sixThree+"dsf_ip:"+serviceOneState[i]["dsf_ip"]+
					", dsf_set:"+serviceOneState[i]["dsf_set"]+";\n";
				}
				sixThree=sixThree+"dsf_ip:"+serviceOneState[sixTwo-1]["dsf_ip"]
				+", dsf_set:"+serviceOneState[sixTwo-1]["dsf_set"];

				serviceTwoState=data["value"][1]["state"];
				sixFour=data["value"][1]["numberofavailable"]/20;
				sixFive=data["value"][1]["numberofavailable"];
				//服务2状态更新
				//sixSix=serviceTwoState;
				//sixSix=JSON.stringify(data["value"][1]["state"]);
				sixSix="";
				for (var i = 0; i < sixFive-1; i++) {
					sixSix=sixSix+"dsf_ip:"+serviceTwoState[i]["dsf_ip"]+
					", dsf_set:"+serviceTwoState[i]["dsf_set"]+";\n";
				}
				sixSix=sixSix+"dsf_ip:"+serviceTwoState[sixFive-1]["dsf_ip"]
				+", dsf_set:"+serviceTwoState[sixFive-1]["dsf_set"];

				serviceThreeState=data["value"][2]["state"];
				sixSeven=data["value"][2]["numberofavailable"]/30;
				sixEgiht=data["value"][2]["numberofavailable"];
				//服务3状态更新
				//sixNine=serviceThreeState;
				//sixNine=JSON.stringify(data["value"]);
				sixNine="";
				for (var i = 0; i < sixEgiht-1; i++) {
					sixNine=sixNine+"dsf_ip:"+serviceThreeState[i]["dsf_ip"]+
					", dsf_set:"+serviceThreeState[i]["dsf_set"]+";\n";
				}
				sixNine=sixNine+"dsf_ip:"+serviceThreeState[sixEgiht-1]["dsf_ip"]
				+", dsf_set:"+serviceThreeState[sixEgiht-1]["dsf_set"];

				$("#sixTable11").attr("style","width: "+toPercent(sixOne));
				$("#sixTable11").children("span").text(toPercent(sixOne));
				$("#sixTable12").text(sixTwo);
				$("#sixTable21").attr("style","width: "+toPercent(sixFour));
				$("#sixTable21").children("span").text(toPercent(sixFour));
				$("#sixTable22").text(sixFive);
				$("#sixTable31").attr("style","width: "+toPercent(sixSeven));
				$("#sixTable31").children("span").text(toPercent(sixSeven));
				$("#sixTable32").text(sixEgiht);
				if (rowOneSym==1) {
					$("#sixTitle").text("服务1详情");
					$("#sixTableN1").text("服务1");
					$("#sixTableN2").text("集群1");
					$("#sixTableN3").attr("style","width: "+toPercent(sixOne));
					$("#sixTableN3").children("span").text(toPercent(sixOne));
					$("#sixTableN4").text(sixTwo);
					$("#sixTableN5").text(sixThree);
				}
				if (rowTwoSym==1) {
					$("#sixTitle").text("服务2详情");
					$("#sixTableN1").text("服务2");
					$("#sixTableN2").text("集群2");
					$("#sixTableN3").attr("style","width: "+toPercent(sixFour));
					$("#sixTableN3").children("span").text(toPercent(sixFour));
					$("#sixTableN4").text(sixFive);
					$("#sixTableN5").text(sixSix);
				}
				if (rowThreeSym==1) {
					$("#sixTitle").text("服务3详情");
					$("#sixTableN1").text("服务3");
					$("#sixTableN2").text("集群3");
					$("#sixTableN3").attr("style","width: "+toPercent(sixSeven));
					$("#sixTableN3").children("span").text(toPercent(sixSeven));
					$("#sixTableN4").text(sixEgiht);
					$("#sixTableN5").text(sixNine);
				}
			} else {
				alert("后台操作失败！");
			}
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert(textStatus + errorThrown);
		}
	});*/
}

//中央控制模块moduleSeven需要定义的变量与函数
var sevenInterval;//刷新控制ID
var sevenGap=1000;//刷新时间间隔，单位为毫秒，默认值为1000

//文档完全加载完之后执行的代码
$(document).ready(function(){

	//实施业务量统计模块moduleOne相关的操作
	oneInterval=setInterval("oneRefresh(oneSymbol);",oneGap);
	//节点提示函数 
	function showTooltip(x, y, contents) {    
        $('<div id="tooltip">' + contents + '</div>').css( {    
            position: 'absolute',    
            display: 'none',    
            top: y + 8,    
            left: x + 8,    
            border: '2px solid black',    
            padding: '1px',    
            'background-color': '#FFFF00',    
            opacity: 0.80    
        }).appendTo("body").fadeIn(200);    
    }    

    var previousPoint = null;    
    //绑定节点提示事件    
    $("#oneChart").bind("plothover", function (event, pos, item) {    
        if (item) {    
            if (previousPoint != item.dataIndex) {    
                previousPoint = item.dataIndex;    
                $("#tooltip").remove();    
                var y = item.datapoint[1].toFixed(0);
                var tip = "业务量：";    
                showTooltip(item.pageX, item.pageY, tip+y);    
            }    
        }    
        else {    
            $("#tooltip").remove();    
            previousPoint = null;    
        }    
    });
	$("#oneMin").click(function(){
		if (collSymOne==0) {
			clearInterval(oneInterval);
			collSymOne=1;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
				$("#sevenCard").hide();
			}
		} else {
			if (oneSymbol==1) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGap);
			}
			if (oneSymbol==2) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapHour);
			}
			if (oneSymbol==3) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapDay);
			}
			if (oneSymbol==4) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapMonth);
			}
			if (oneSymbol==5) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapYear);
			}
			collSymOne=0;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)<5) {
				$("#sevenCard").show();
			}
		}
		clearInterval(sevenInterval);
		$("#oneBody").toggle();
	});
	$("#oneClose").click(function(){
		clearInterval(oneInterval);
		collSymOne=1;
		if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
			$("#sevenCard").hide();
		}
		//clearInterval(sevenInterval);
		$("#oneCard").hide();	
	});
	$("#oneButtonMinute").click(function(){
		clearInterval(oneInterval);
		oneSymbol=1;
		oneRefresh(oneSymbol);
		oneInterval=setInterval("oneRefresh(oneSymbol);",oneGap);
		clearInterval(sevenInterval);
	});
	$("#oneButtonHour").click(function(){
		clearInterval(oneInterval);
		oneSymbol=2;
		oneRefresh(oneSymbol);
		oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapHour);
		clearInterval(sevenInterval);
	});
	$("#oneButtonDay").click(function(){
		clearInterval(oneInterval);
		oneSymbol=3;
		oneRefresh(oneSymbol);
		oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapDay);
		clearInterval(sevenInterval);
	});
	$("#oneButtonMonth").click(function(){
		clearInterval(oneInterval);
		oneSymbol=4;
		oneRefresh(oneSymbol);
		oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapMonth);
		clearInterval(sevenInterval);
	});
	$("#oneButtonYear").click(function(){
		clearInterval(oneInterval);
		oneSymbol=5;
		oneRefresh(oneSymbol);
		oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapYear);
		clearInterval(sevenInterval);
	});
	$("#oneButton1").click(function(){
		clearInterval(oneInterval);
		if (oneSymbol==1) {
			oneInterval=setInterval("oneRefresh(oneSymbol);",oneGap);
		}
		if (oneSymbol==2) {
			oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapHour);
		}
		if (oneSymbol==3) {
			oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapDay);
		}
		if (oneSymbol==4) {
			oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapMonth);
		}
		if (oneSymbol==5) {
			oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapYear);
		}
		clearInterval(sevenInterval);		
	});
	$("#oneButton2").click(function(){
		clearInterval(oneInterval);
		clearInterval(sevenInterval);
	});
	$("#oneButton3").click(function(){
		oneRefresh(oneSymbol);
	});
	$("#oneButton4").click(function(){
		var oneSetTime=prompt("请设定每分钟的刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(oneSetTime)==false)&&(oneSetTime>0)){
			oneGap=oneSetTime;
			oneGapHour=oneGap*60;
			oneGapDay=oneGapHour*24;
			oneGapMonth=oneGapDay*30;
			oneGapYear=oneGapMonth*12;
			if (oneSymbol==1) {
				clearInterval(oneInterval);
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGap);
			}
			if (oneSymbol==2) {
				clearInterval(oneInterval);
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapHour);
			}
			if (oneSymbol==3) {
				clearInterval(oneInterval);
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapDay);
			}
			if (oneSymbol==4) {
				clearInterval(oneInterval);
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapMonth);
			}
			if (oneSymbol==5) {
				clearInterval(oneInterval);
				oneInterval=setInterval("oneRefresh(oneSymbol);",oneGapYear);
			}
			clearInterval(sevenInterval);			
		}
	});

	//发起渠道模块moduleTwo相关的操作
	twoInterval=setInterval("twoRefresh();",twoGap);
	$("#twoMin").click(function(){
		if (collSymTwo==0) {
			clearInterval(twoInterval);
			collSymTwo=1;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
				$("#sevenCard").hide();
			}
		} else {
			twoInterval=setInterval("twoRefresh();",twoGap);
			collSymTwo=0;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)<5) {
				$("#sevenCard").show();
			}
		}
		clearInterval(sevenInterval);
		$("#twoBody").toggle();
	});
	$("#twoClose").click(function(){
		clearInterval(twoInterval);
		collSymTwo=1;
		if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
			$("#sevenCard").hide();
		}
		//clearInterval(sevenInterval);
		$("#twoCard").hide();		
	});
	$("#twoButton1").click(function(){
		clearInterval(twoInterval);
		twoInterval=setInterval("twoRefresh();",twoGap);
		clearInterval(sevenInterval);
	});
	$("#twoButton2").click(function(){
		clearInterval(twoInterval);
		clearInterval(sevenInterval);
	});
	$("#twoButton3").click(function(){
		twoRefresh();
	});
	$("#twoButton4").click(function(){
		var twoSetTime=prompt("请设定刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(twoSetTime)==false)&&(twoSetTime>0)){
			twoGap=twoSetTime;
			clearInterval(twoInterval);
			twoInterval=setInterval("twoRefresh();",twoGap);
			clearInterval(sevenInterval);
		}
	});

	//报文类型模块moduleThree相关的操作
	threeInterval=setInterval("threeRefresh();",threeGap);
	$("#threeMin").click(function(){
		if (collSymThree==0) {
			clearInterval(threeInterval);
			collSymThree=1;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
				$("#sevenCard").hide();
			}
		} else {
			threeInterval=setInterval("threeRefresh();",threeGap);
			collSymThree=0;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)<5) {
				$("#sevenCard").show();
			}
		}
		clearInterval(sevenInterval);
		$("#threeBody").toggle();
	});
	$("#threeClose").click(function(){
		clearInterval(threeInterval);
		collSymThree=1;
		if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
			$("#sevenCard").hide();
		}
		//clearInterval(sevenInterval);
		$("#threeCard").hide();		
	});
	$("#threeButton1").click(function(){
		clearInterval(threeInterval);
		threeInterval=setInterval("threeRefresh();",threeGap);
		clearInterval(sevenInterval);
	});
	$("#threeButton2").click(function(){
		clearInterval(threeInterval);
		clearInterval(sevenInterval);
	});
	$("#threeButton3").click(function(){
		threeRefresh();
	});
	$("#threeButton4").click(function(){
		var threeSetTime=prompt("请设定刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(threeSetTime)==false)&&(threeSetTime>0)){
			threeGap=threeSetTime;
			clearInterval(threeInterval);
			threeInterval=setInterval("threeRefresh();",threeGap);
			clearInterval(sevenInterval);
		}
	});

	//业务交易率模块moduleFour相关的操作
	fourInterval=setInterval("fourRefresh();",fourGap);
	$("#fourMin").click(function(){
		if (collSymFour==0) {
			clearInterval(fourInterval);
			collSymFour=1;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
				$("#sevenCard").hide();
			}
		} else {
			fourInterval=setInterval("fourRefresh();",fourGap);
			collSymFour=0;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)<5) {
				$("#sevenCard").show();
			}
		}
		clearInterval(sevenInterval);
		$("#fourBody").toggle();
	});
	$("#fourClose").click(function(){
		clearInterval(fourInterval);
		collSymFour=1;
		if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
			$("#sevenCard").hide();
		}
		//clearInterval(sevenInterval);
		$("#fourCard").hide();		
	});
	$("#fourButton1").click(function(){
		clearInterval(fourInterval);
		fourInterval=setInterval("fourRefresh();",fourGap);
		clearInterval(sevenInterval);
	});
	$("#fourButton2").click(function(){
		clearInterval(fourInterval);
		clearInterval(sevenInterval);
	});
	$("#fourButton3").click(function(){
		fourRefresh();
	});
	$("#fourButton4").click(function(){
		var fourSetTime=prompt("请设定刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(fourSetTime)==false)&&(fourSetTime>0)){
			fourGap=fourSetTime;
			clearInterval(fourInterval);
			fourInterval=setInterval("fourRefresh();",fourGap);
			clearInterval(sevenInterval);
		}
	});

	//业务成功率模块modulefive相关的操作
	fiveInterval=setInterval("fiveRefresh();",fiveGap);
	$("#fiveMin").click(function(){
		if (collSymFive==0) {
			clearInterval(fiveInterval);
			collSymFive=1;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
				$("#sevenCard").hide();
			}
		} else {
			fiveInterval=setInterval("fiveRefresh();",fiveGap);
			collSymFive=0;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)<5) {
				$("#sevenCard").show();
			}
		}
		clearInterval(sevenInterval);
		$("#fiveBody").toggle();
	});
	$("#fiveClose").click(function(){
		clearInterval(fiveInterval);
		collSymFive=1;
		if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
			$("#sevenCard").hide();
		}
		//clearInterval(sevenInterval);
		$("#fiveCard").hide();		
	});
	$("#fiveButton1").click(function(){
		clearInterval(fiveInterval);
		fiveInterval=setInterval("fiveRefresh();",fiveGap);
		clearInterval(sevenInterval);
	});
	$("#fiveButton2").click(function(){
		clearInterval(fiveInterval);
		clearInterval(sevenInterval);
	});
	$("#fiveButton3").click(function(){
		fiveRefresh();
	});
	$("#fiveButton4").click(function(){
		var fiveSetTime=prompt("请设定刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(fiveSetTime)==false)&&(fiveSetTime>0)){
			fiveGap=fiveSetTime;
			clearInterval(fiveInterval);
			fiveInterval=setInterval("fiveRefresh();",fiveGap);
			clearInterval(sevenInterval);
		}
	});

	//服务可用性模块moduleSix相关的操作
	sixInterval=setInterval("sixRefresh();",sixGap);
	$("#sixMin").click(function(){
		if (collSymSix==0) {
			clearInterval(sixInterval);
			collSymSix=1;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
				$("#sevenCard").hide();
			}
		} else {
			sixInterval=setInterval("sixRefresh();",sixGap);
			collSymSix=0;
			if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)<5) {
				$("#sevenCard").show();
			}
		}
		clearInterval(sevenInterval);
		$("#sixBody").toggle();
	});
	$("#sixClose").click(function(){
		clearInterval(sixInterval);
		collSymSix=1;
		if ((collSymOne+collSymTwo+collSymThree+collSymFour+collSymFive+collSymSix)>4) {
			$("#sevenCard").hide();
		}
		//clearInterval(sevenInterval);
		$("#sixCard").hide();		
	});
	$("#sixButton1").click(function(){
		clearInterval(sixInterval);
		sixInterval=setInterval("sixRefresh();",sixGap);
		clearInterval(sevenInterval);
	});
	$("#sixButton2").click(function(){
		clearInterval(sixInterval);
		clearInterval(sevenInterval);
	});
	$("#sixButton3").click(function(){
		sixRefresh();
	});
	$("#sixButton4").click(function(){
		var sixSetTime=prompt("请设定刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(sixSetTime)==false)&&(sixSetTime>0)){
			sixGap=sixSetTime;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
	});
	$("#sixRow1").click(function(){
		if ((rowOneSym==0)&&(rowTwoSym==0)&&(rowThreeSym==0)) {
			rowOneSym=1;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
			$("#sixDetail").show();
		}
		else if(rowOneSym==1){
			rowOneSym=0;
			$("#sixTitle").text("服务详情");
			$("#sixTableN1").text("");
			$("#sixTableN2").text("");
			$("#sixTableN3").attr("style","width: 0");
			$("#sixTableN3").children("span").text("0%");
			$("#sixTableN4").text("0");
			$("#sixTableN5").text("");
			$("#sixDetail").hide();
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
		else{
			if(rowTwoSym==1){
				rowOneSym=1;
				rowTwoSym=0;
				clearInterval(sixInterval);
				sixInterval=setInterval("sixRefresh();",sixGap);
				clearInterval(sevenInterval);
			}
			else{
				rowOneSym=1;
				rowThreeSym=0;
				clearInterval(sixInterval);
				sixInterval=setInterval("sixRefresh();",sixGap);
				clearInterval(sevenInterval);
			}
		}
	});
	$("#sixRow2").click(function(){
		if ((rowOneSym==0)&&(rowTwoSym==0)&&(rowThreeSym==0)) {
			rowTwoSym=1;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
			$("#sixDetail").show();
		}
		else if(rowOneSym==1){
			rowOneSym=0;
			rowTwoSym=1;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
		else if(rowTwoSym==1){
			rowTwoSym=0;
			$("#sixTitle").text("服务详情");
			$("#sixTableN1").text("");
			$("#sixTableN2").text("");
			$("#sixTableN3").attr("style","width: 0");
			$("#sixTableN3").children("span").text("0%");
			$("#sixTableN4").text("0");
			$("#sixTableN5").text("");
			$("#sixDetail").hide();
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
		else if(rowThreeSym==1){
			rowTwoSym=1;
			rowThreeSym=0;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
	});
	$("#sixRow3").click(function(){
		if ((rowOneSym==0)&&(rowTwoSym==0)&&(rowThreeSym==0)) {
			rowThreeSym=1;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
			$("#sixDetail").show();
		}
		else if(rowOneSym==1){
			rowOneSym=0;
			rowThreeSym=1;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
		else if(rowTwoSym==1){
			rowTwoSym=0;
			rowThreeSym=1;
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
		else if(rowThreeSym==1){
			rowThreeSym=0;
			$("#sixTitle").text("服务详情");
			$("#sixTableN1").text("");
			$("#sixTableN2").text("");
			$("#sixTableN3").attr("style","width: 0");
			$("#sixTableN3").children("span").text("0%");
			$("#sixTableN4").text("0");
			$("#sixTableN5").text("");
			$("#sixDetail").hide();
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sixGap);
			clearInterval(sevenInterval);
		}
	});

	//中央控制模块moduleSeven相关的操作
	$("#sevenMin").click(function(){
		$("#sevenBody").toggle();
	});
	$("#sevenClose").click(function(){
		$("#sevenCard").hide();		
	});
	$("#sevenButton1").click(function(){
		if (collSymOne==0) {
			clearInterval(oneInterval);
			if (oneSymbol==1) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap);
			}
			if (oneSymbol==2) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*60);
			}
			if (oneSymbol==3) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*1440);
			}
			if (oneSymbol==4) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*43200);
			}
			if (oneSymbol==5) {
				oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*518400);
			}
		} 
		if (collSymTwo==0) {
			clearInterval(twoInterval);
			twoInterval=setInterval("twoRefresh();",sevenGap);
		}
		if (collSymThree==0) {
			clearInterval(threeInterval);
			threeInterval=setInterval("threeRefresh();",sevenGap);
		}
		if (collSymFour==0) {
			clearInterval(fourInterval);
			fourInterval=setInterval("fourRefresh();",sevenGap);
		}
		if (collSymFive==0) {
			clearInterval(fiveInterval);
			fiveInterval=setInterval("fiveRefresh();",sevenGap);
		}
		if (collSymSix==0) {
			clearInterval(sixInterval);
			sixInterval=setInterval("sixRefresh();",sevenGap);
		}
		clearInterval(sevenInterval);
		sevenInterval=setInterval('timeRefresh("sevenTime");',sevenGap);
	});
	$("#sevenButton2").click(function(){
		if (collSymOne==0) {
			clearInterval(oneInterval);
		} 
		if (collSymTwo==0) {
			clearInterval(twoInterval);
		}
		if (collSymThree==0) {
			clearInterval(threeInterval);
		}
		if (collSymFour==0) {
			clearInterval(fourInterval);
		}
		if (collSymFive==0) {
			clearInterval(fiveInterval);
		}
		if (collSymSix==0) {
			clearInterval(sixInterval);
		}
		clearInterval(sevenInterval);
	});
	$("#sevenButton3").click(function(){
		if (collSymOne==0) {
			oneRefresh(oneSymbol);
		} 
		if (collSymTwo==0) {
			twoRefresh();
		}
		if (collSymThree==0) {
			threeRefresh();
		}
		if (collSymFour==0) {
			fourRefresh();
		}
		if (collSymFive==0) {
			fiveRefresh();
		}
		if (collSymSix==0) {
			sixRefresh();
		}
		timeRefresh("sevenTime");
	});
	$("#sevenButton4").click(function(){
		var sevenSetTime=prompt("请设定整体刷新间隔，单位为毫秒，默认值为1000","1000");
		if((isNaN(sevenSetTime)==false)&&(sevenSetTime>0)){
			sevenGap=sevenSetTime;
			if (collSymOne==0) {
				clearInterval(oneInterval);
				if (oneSymbol==1) {
					oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap);
				}
				if (oneSymbol==2) {
					oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*60);
				}
				if (oneSymbol==3) {
					oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*60*60);
				}
				if (oneSymbol==4) {
					oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*60*60*24);
				}
				if (oneSymbol==5) {
					oneInterval=setInterval("oneRefresh(oneSymbol);",sevenGap*60*60*24*30);
				}
			} 
			if (collSymTwo==0) {
				clearInterval(twoInterval);
				twoInterval=setInterval("twoRefresh();",sevenGap);
			}
			if (collSymThree==0) {
				clearInterval(threeInterval);
				threeInterval=setInterval("threeRefresh();",sevenGap);
			}
			if (collSymFour==0) {
				clearInterval(fourInterval);
				fourInterval=setInterval("fourRefresh();",sevenGap);
			}
			if (collSymFive==0) {
				clearInterval(fiveInterval);
				fiveInterval=setInterval("fiveRefresh();",sevenGap);
			}
			if (collSymSix==0) {
				clearInterval(sixInterval);
				sixInterval=setInterval("sixRefresh();",sevenGap);
			}
			clearInterval(sevenInterval);
			sevenInterval=setInterval('timeRefresh("sevenTime");',sevenGap);
		}
	});

	//操作说明模块moduleEight相关的操作
	$("#eightMin").click(function(){
		$("#eightBody").toggle();
	});
	$("#eightClose").click(function(){
		$("#eightCard").hide();		
	});
});