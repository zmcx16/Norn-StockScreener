(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{"1P7g":function(e,t,a){e.exports={container:"pcrSummary-module--container--2JpDB",showColumn:"pcrSummary-module--showColumn--3L-nv",table:"pcrSummary-module--table--38sJ-"}},"4cdY":function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var l=a("hszt"),n=a("wcMh"),o=a("J+eN"),r=a("b+jq"),s=a("Ao2N"),i=Object(l.a)({chartName:"LineChart",GraphicalChild:n.a,axisComponents:[{axisType:"xAxis",AxisComp:o.a},{axisType:"yAxis",AxisComp:r.a}],formatAxisMap:s.b})},gXcX:function(e,t,a){"use strict";a.r(t);var l=a("q1tI"),n=a.n(l),o=a("w8ma"),r=a("Bl7J"),s=a("ZuIi"),i=a("OGDC"),u=a("DbNq"),d=a.n(u),c=a("tFdz"),m=a("wd/R"),h=a.n(m),_=a("ps87"),p=a("0d+u"),P=a("y9N3"),C=a("J+eN"),f=a("b+jq"),b=a("nJDY"),O=a("Yjvw"),E=a("wcMh"),V=a("2Ovm"),A=a("4cdY");var I=e=>{let{title:t,data:a}=e;return n.a.createElement("div",{style:{width:window.innerWidth-80+"px",height:window.innerHeight-80+"px",maxWidth:"1200px",maxHeight:"800px"}},n.a.createElement("h3",null,t),n.a.createElement(_.a,{width:"100%",height:"32%"},n.a.createElement(p.a,{data:a,syncId:"StockAndPCRDataChart",margin:{top:5,right:30,left:20,bottom:5}},n.a.createElement(P.a,{strokeDasharray:"3 3"}),n.a.createElement(C.a,{dataKey:"Date",tickFormatter:e=>h()(e).format("MM/DD/YYYY")}),n.a.createElement(f.a,{yAxisId:"left",domain:["auto","auto"]}),n.a.createElement(f.a,{yAxisId:"right",orientation:"right",domain:["auto","auto"]}),n.a.createElement(b.a,null),n.a.createElement(O.a,{wrapperStyle:{bottom:-5}}),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"left",type:"monotone",name:"Close Price",dataKey:"close",stroke:"#8884d8",dot:!1}),n.a.createElement(V.a,{yAxisId:"right",name:"Volume",dataKey:"volume",fill:"#82ca9d"}))),n.a.createElement(_.a,{width:"100%",height:"32%"},n.a.createElement(p.a,{data:a,syncId:"StockAndPCRDataChart",margin:{top:5,right:30,left:20,bottom:5}},n.a.createElement(P.a,{strokeDasharray:"3 3"}),n.a.createElement(C.a,{dataKey:"Date",tickFormatter:e=>h()(e).format("MM/DD/YYYY")}),n.a.createElement(f.a,{yAxisId:"left",domain:["auto","auto"]}),n.a.createElement(f.a,{yAxisId:"right",orientation:"right",domain:["auto","auto"]}),n.a.createElement(b.a,null),n.a.createElement(O.a,{wrapperStyle:{bottom:-5}}),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"left",type:"monotone",name:"PCR OpenInterest",dataKey:"PCR_OpenInterest",stroke:"#FF8042"}),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"right",type:"monotone",name:"PCR Volume",dataKey:"PCR_Volume",stroke:"#00C49F"}))),n.a.createElement(_.a,{width:"100%",height:"32%"},n.a.createElement(A.a,{data:a,syncId:"StockAndPCRDataChart",margin:{top:5,right:30,left:20,bottom:5}},n.a.createElement(P.a,{strokeDasharray:"3 3"}),n.a.createElement(C.a,{dataKey:"Date",tickFormatter:e=>h()(e).format("MM/DD/YYYY")}),n.a.createElement(f.a,{yAxisId:"left",domain:["auto","auto"]}),n.a.createElement(f.a,{yAxisId:"right",orientation:"right",domain:["auto","auto"]}),n.a.createElement(b.a,null),n.a.createElement(O.a,null),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"left",type:"monotone",name:"Calls Total OI",dataKey:"Calls_TotalOI",stroke:"#FF8042"}),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"left",type:"monotone",name:"Puts Total OI",dataKey:"Puts_TotalOI",stroke:"#2828FF"}),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"right",type:"monotone",name:"Calls Total Vol",dataKey:"Calls_TotalVol",stroke:"#00C49F"}),n.a.createElement(E.a,{connectNulls:!0,yAxisId:"right",type:"monotone",name:"Puts Total Vol",dataKey:"Puts_TotalVol",stroke:"#8C8C00"}))))},x=a("jJ2d"),y=a("qnxO"),L=a("+x9f"),R=a("/1FI"),g=a("WSAr"),M=a("1P7g"),w=a.n(M);a("jAbX");var T=e=>{let{loadingAnimeRef:t}=e;const{0:a,1:o}=Object(l.useState)({}),r=Object(l.useRef)({popModalWindow:null,popPureModal:null}),u={hide:!1,text:"Price"},m={hide:!1,text:"PCR (OI)"},_={hide:!1,text:"OI-1W(%)"},p={hide:!1,text:"OI-1M(%)"},P={hide:!1,text:"Calls OI"},C={hide:!1,text:"Puts OI"},f={hide:!1,text:"PCR (Vol)"},b={hide:!1,text:"Vol-1W(%)"},O={hide:!1,text:"Vol-1M(%)"},E={hide:!1,text:"Calls Vol"},V={hide:!1,text:"Puts Vol"},A={hide:!1,text:"P/E"},M={hide:!1,text:"P/B"},T={hide:!1,text:"Dividend %"},k={hide:!1,text:"52W High"},N={hide:!1,text:"52W Low"},j={hide:!1,text:"Perf Week"},Y={hide:!1,text:"Perf Month"},D={hide:!1,text:"Perf Quarter"},W={hide:!1,text:"Perf Half Y"},v={hide:!1,text:"Perf Year"},X={hide:!1,text:"Perf YTD"},U={hide:!1,text:"Chart"},F=async(e,t)=>{const a=await t.get(e);return t.response.ok&&a?a:null},S=e=>{console.log(e),Promise.all([F("/norn-data/stock/historical-quotes/"+e+".json",K),F("/norn-data/options/pcr/historical-by-symbol/"+e+".json",B)]).then(t=>{if(console.log(t),2===t.length&&null!==t[0]&&null!==t[1]){let a=new Date(Date.now()-31536e6);t[1].length>0&&(a=new Date(t[1][t[1].length-1].update_time));let l={};const o=function(e,n,o,r,s,i){void 0===s&&(s=null),void 0===i&&(i=null),!e||Array.isArray(e)?(t[1].forEach(e=>{e.data.PCR_OpenInterest=parseInt(100*e.data.PCR_OpenInterest,10)/100,e.data.PCR_Volume=parseInt(100*e.data.PCR_Volume,10)/100}),e.forEach(e=>{let t=Date.parse(new Date(Date.parse(e[n])).toLocaleDateString());t<a||(t in l||(l[t]={}),l[t][o]=null===s?e[r]:null===i?e[r][s]:e[r][s][i])})):console.log("data is not array")};o(t[0],"Date","close","Close"),o(t[0],"Date","volume","Volume"),o(t[1],"update_time","PCR_OpenInterest","data","PCR_OpenInterest"),o(t[1],"update_time","PCR_Volume","data","PCR_Volume"),o(t[1],"update_time","Calls_TotalOI","data","calls","totalOpenInterest"),o(t[1],"update_time","Calls_TotalVol","data","calls","totalVolume"),o(t[1],"update_time","Puts_TotalOI","data","puts","totalOpenInterest"),o(t[1],"update_time","Puts_TotalVol","data","puts","totalVolume"),console.log(l);let s=[],i=["close","volume","PCR_OpenInterest","PCR_Volume","Calls_TotalOI","Calls_TotalVol","Puts_TotalOI","Puts_TotalVol"];Object.keys(l).sort().forEach(e=>{let t={Date:h()(parseInt(e)).format("MM/DD/YYYY")};i.forEach(a=>{a in l[e]&&(t[a]=l[e][a])}),s.push(t)}),console.log(s);const u=e+" Chart";r.current.popModalWindow(n.a.createElement(I,{title:u,data:s}))}else r.current.popModalWindow(n.a.createElement("div",null,"Load some data failed"))}).catch(()=>{r.current.popModalWindow(n.a.createElement("div",null,"Can't draw stock price & pcr chart"))})};function H(e,t,a,l,o,r){void 0===r&&(r=null);let s={field:e,headerName:t,width:a,type:"number",renderCell:e=>"-"===e.value||e.value===-Number.MAX_VALUE||e.value===Number.MAX_VALUE||null===e.value||void 0===e.value||"Infinity"===e.value||"NaN"===e.value?n.a.createElement("span",null,"-"):n.a.createElement("span",{style:{fontWeight:500,color:parseFloat(e.value)<=.7?"green":parseFloat(e.value)>=1?"red":""}},e.value.toFixed(l)),hide:o};return null!=r&&(s.description=r),s}const K=Object(c.a)({cachePolicy:"no-cache"}),B=Object(c.a)({cachePolicy:"no-cache"}),J=(e,a)=>{Promise.all([F("/norn-data/stock/stat.json",K),F("/norn-data/options/pcr/stat.json",B)]).then(l=>{if(2===l.length&&null!==l[0]&&null!==l[1]){let t=Object.keys(l[1].data).reduce((t,a,n)=>{let o=l[0][a],r=l[1].data[a],s={id:n,symbol:a,close:null!=o&&"-"!==o.Close?o.Close:-Number.MAX_VALUE,PCR_OpenInterest_Latest:"-"!==r.PCR_OpenInterest_Latest?r.PCR_OpenInterest_Latest:-Number.MAX_VALUE,PCR_OpenInterest_Week:"-"!==r.PCR_OpenInterest_Week?r.PCR_OpenInterest_Week:-Number.MAX_VALUE,PCR_OpenInterest_Month:"-"!==r.PCR_OpenInterest_Month?r.PCR_OpenInterest_Month:-Number.MAX_VALUE,PCR_Volume_Latest:"-"!==r.PCR_Volume_Latest?r.PCR_Volume_Latest:-Number.MAX_VALUE,PCR_Volume_Week:"-"!==r.PCR_Volume_Week?r.PCR_Volume_Week:-Number.MAX_VALUE,PCR_Volume_Month:"-"!==r.PCR_Volume_Month?r.PCR_Volume_Month:-Number.MAX_VALUE,Calls_LatestTotalOI:"-"!==r.Calls_LatestTotalOI?r.Calls_LatestTotalOI:-Number.MAX_VALUE,Calls_LatestTotalVol:"-"!==r.Calls_LatestTotalVol?r.Calls_LatestTotalVol:-Number.MAX_VALUE,Puts_LatestTotalOI:"-"!==r.Puts_LatestTotalOI?r.Puts_LatestTotalOI:-Number.MAX_VALUE,Puts_LatestTotalVol:"-"!==r.Puts_LatestTotalVol?r.Puts_LatestTotalVol:-Number.MAX_VALUE,PE:null!=o&&"-"!==o["P/E"]?o["P/E"]:Number.MAX_VALUE,PB:null!=o&&"-"!==o["P/B"]?o["P/B"]:Number.MAX_VALUE,dividend:null!=o&&"-"!==o["Dividend %"]?o["Dividend %"]:-Number.MAX_VALUE,high52:null!=o&&"-"!==o["52W High"]?o["52W High"]:-Number.MAX_VALUE,low52:null!=o&&"-"!==o["52W Low"]?o["52W Low"]:-Number.MAX_VALUE,perfWeek:null!=o&&"-"!==o["Perf Week"]?o["Perf Week"]:-Number.MAX_VALUE,perfMonth:null!=o&&"-"!==o["Perf Month"]?o["Perf Month"]:-Number.MAX_VALUE,perfQuarter:null!=o&&"-"!==o["Perf Quarter"]?o["Perf Quarter"]:-Number.MAX_VALUE,perfHalfY:null!=o&&"-"!==o["Perf Half Y"]?o["Perf Half Y"]:-Number.MAX_VALUE,perfYear:null!=o&&"-"!==o["Perf Year"]?o["Perf Year"]:-Number.MAX_VALUE,perfYTD:null!=o&&"-"!==o["Perf YTD"]?o["Perf YTD"]:-Number.MAX_VALUE};return(0===e.filter_symbols.length||e.filter_symbols.includes(a))&&t.push(s),t},[]);console.log(t),q(t),a&&S(t[0].symbol)}else r.current.popModalWindow(n.a.createElement("div",null,"Load some data failed"));t.current.setLoading(!1)}).catch(()=>{r.current.popModalWindow(n.a.createElement("div",null,"Can't get data")),t.current.setLoading(!1)})},{0:Q,1:q}=Object(l.useState)([]),{0:z,1:G}=Object(l.useState)("");return Object(l.useEffect)(()=>{let e={filter_symbols:[]},t=!1;if("undefined"!=typeof window){const a=new URLSearchParams(window.location.search);let l=a.get("symbol");l&&(e={filter_symbols:[l]}),t="true"===a.get("showChart")}return J(e,t),()=>{}},[]),n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:w.a.container},n.a.createElement("div",{className:w.a.table},n.a.createElement(s.a,{rows:Q,columns:[Object(g.j)("Symbol",130,"symbol"in a&&a.symbol),Object(g.g)("close",u.text,110,"close"in a?a.close:u.hide,null,"yahoo"),H("PCR_OpenInterest_Latest",m.text,110,2,"PCR_OpenInterest_Latest"in a?a.PCR_OpenInterest_Latest:m.hide,"Put-Call Ratio (Open Interest)"),Object(g.f)("PCR_OpenInterest_Week",_.text,110,"PCR_OpenInterest_Week"in a?a.PCR_OpenInterest_Week:_.hide,"Put-Call Ratio (Open Interest) 1 Week Changed (%)"),Object(g.f)("PCR_OpenInterest_Month",p.text,110,"PCR_OpenInterest_Week"in a?a.PCR_OpenInterest_Month:p.hide,"Put-Call Ratio (Open Interest) 1 Month Changed (%)"),Object(g.d)("Calls_LatestTotalOI",P.text,110,2,"Calls_LatestTotalOI"in a?a.Calls_LatestTotalOI:P.hide,"Calls Total Open Interest"),Object(g.d)("Puts_LatestTotalOI",C.text,110,2,"Puts_LatestTotalOI"in a?a.Puts_LatestTotalOI:C.hide,"Puts Open Total Interest"),H("PCR_Volume_Latest",f.text,110,2,"PCR_Volume_Latest"in a?a.PCR_Volume_Latest:f.hide,"Put-Call Ratio (Volume)"),Object(g.f)("PCR_Volume_Week",b.text,110,"PCR_Volume_Week"in a?a.PCR_Volume_Week:b.hide,"Put-Call Ratio (Volume) 1 Week Changed (%)"),Object(g.f)("PCR_Volume_Month",O.text,110,"PCR_Volume_Month"in a?a.PCR_Volume_Month:O.hide,"Put-Call Ratio (Volume) 1 Month Changed (%)"),Object(g.d)("Calls_LatestTotalVol",E.text,110,2,"Calls_LatestTotalVol"in a?a.Calls_LatestTotalVol:E.hide,"Calls Total Volume"),Object(g.d)("Puts_LatestTotalVol",V.text,110,2,"Puts_LatestTotalVol"in a?a.Puts_LatestTotalVol:V.hide,"Puts Total Volume"),Object(g.h)("PE",A.text,110,2,"PE"in a?a.PE:A.hide),Object(g.h)("PB",M.text,110,2,"PB"in a?a.PB:M.hide),Object(g.f)("dividend",T.text,150,"dividend"in a?a.dividend:T.hide),Object(g.f)("high52",k.text,150,"high52"in a?a.high52:k.hide),Object(g.f)("low52",N.text,150,"low52"in a?a.low52:N.hide),Object(g.b)("perfWeek",j.text,150,2,"perfWeek"in a?a.perfWeek:j.hide,500),Object(g.b)("perfMonth",Y.text,150,2,"perfMonth"in a?a.perfMonth:Y.hide,500),Object(g.b)("perfQuarter",D.text,150,2,"perfQuarter"in a?a.perfQuarter:D.hide,500),Object(g.b)("perfHalfY",W.text,150,2,"perfHalfY"in a?a.perfHalfY:W.hide,500),Object(g.b)("perfYear",v.text,150,2,"perfYear"in a?a.perfYear:v.hide,500),Object(g.b)("perfYTD",X.text,150,2,"perfYTD"in a?a.perfYTD:X.hide,500),{field:"Chart",headerName:U.text,width:130,renderCell:e=>n.a.createElement(i.a,{size:"small","aria-haspopup":"true",onClick:()=>{S(e.row.symbol)}},n.a.createElement(d.a,{color:"primary",style:{fontSize:40}})),hide:"Chart"in a?a.Chart:U.hide}],components:{NoRowsOverlay:y.a,Toolbar:()=>n.a.createElement(L.a,{searchVal:z,setSearchVal:G,clickCallback:e=>{J(e,!1)},info:{placeholder:"Filter symbols: AAPL, BAC, KSS, ...",tooltip:{text:R.u,link:R.y}}})},disableSelectionOnClick:!0,onColumnVisibilityChange:e=>{let t=a;t[e.field]=!e.isVisible,o(t)}}))),n.a.createElement(x.a,{modalWindowRef:r}))},k=a("3Y3G"),N=a("vrFN");t.default=()=>{const e=Object(l.useRef)({getLoading:null,setLoading:null});return n.a.createElement(o.a,{injectFirst:!0},n.a.createElement(N.a,null),n.a.createElement(r.a,null,n.a.createElement(T,{loadingAnimeRef:e})),n.a.createElement(k.a,{loadingAnimeRef:e}))}}}]);
//# sourceMappingURL=component---src-pages-options-pcr-js-945d7f12208531c7ff68.js.map