(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{"+x9f":function(e,t,a){"use strict";var r=a("q1tI"),l=a.n(r),n=a("kmWS"),o=a("cD7S"),i=a.n(o),u=a("Nb3f"),c=a.n(u),s=a("G43+"),d=a("mkt2"),m=a("OGDC"),f=a("b6Qr"),h=a("Nihg");t.a=e=>{let{searchVal:t,setSearchVal:a,clickCallback:o,info:u}=e;const b=Object(r.useRef)(null);var p=()=>{let e=b.current.value.replaceAll('"',"").split(",").map(e=>e.trim().toUpperCase());console.log(e);let t={filter_symbols:[]};0!==e.length&&""!==e[0]&&(t={filter_symbols:e}),a(b.current.value),o(t)};return l.a.createElement(d.a,null,l.a.createElement(s.a,{component:"form",sx:{p:"6 16",m:1,display:"flex",alignItems:"center"}},l.a.createElement(n.c,{autoFocus:!0,sx:{ml:1,flex:1},style:{width:f.isMobile?200:400},placeholder:u.placeholder,inputProps:{"aria-label":"search-targets"},defaultValue:t,inputRef:b,onKeyDown:e=>{"Enter"===e.key&&(p(),e.preventDefault())}}),l.a.createElement(m.a,{type:"button",sx:{p:"10px"},"aria-label":"search",onClick:p},l.a.createElement(c.a,null))),"tooltip"in u?l.a.createElement(h.b,{arrow:!0,title:l.a.createElement("span",{style:{fontSize:"14px",whiteSpace:"pre-line",lineHeight:"20px",textAlign:"center"}},u.tooltip.text)},l.a.createElement(m.a,{onClick:()=>window.open(u.tooltip.link,"_blank")},l.a.createElement(i.a,{color:"action"}))):l.a.createElement(l.a.Fragment,null))}},KupQ:function(e,t,a){"use strict";a.r(t);var r=a("q1tI"),l=a.n(r),n=a("w8ma"),o=a("Bl7J"),i=a("ZuIi"),u=a("V3n9"),c=a("Gqia"),s=a("tFdz"),d=a("jJ2d"),m=a("qnxO"),f=a("WSAr"),h=a("/1FI"),b=a("+x9f"),p=a("zYSo"),E=a.n(p);a("jAbX");var P=e=>{let{loadingAnimeRef:t}=e;const{0:a,1:n}=Object(r.useState)({}),o=Object(r.useRef)({popModalWindow:null,popPureModal:null}),p=Object(r.useRef)({}),P=()=>{return(e=p.current,Object.keys(e).map(t=>"symbol"===t?Object(f.j)(e[t].text,130,t in a?a[t]:e[t].hide):"GurusCount"===t?{field:t,headerName:e[t].text,width:170,type:"number",hide:t in a?a[t]:e[t].hide}:"Close"===t||"PE"===t||"PB"===t?Object(f.h)(t,e[t].text,110,2,t in a?a[t]:e[t].hide):"Dividend"===t||"High52"===t||"Low52"===t||"PerfWeek"===t||"PerfMonth"===t||"PerfQuarter"===t||"PerfHalfY"===t||"PerfYear"===t||"PerfYTD"===t?Object(f.f)(t,e[t].text,150,t in a?a[t]:e[t].hide):"ShortFloat"===t?Object(f.i)(t,e[t].text,110,2,t in a?a[t]:e[t].hide):Object(f.d)(t,e[t].text,150,2,t in a?a[t]:e[t].hide))).reduce((e,t)=>(e.push(t),e),[]);var e},{0:g,1:x}=Object(r.useState)(P()),v=Object(s.a)({cachePolicy:"no-cache"}),j=Object(s.a)({cachePolicy:"no-cache"}),A=async(e,t)=>{const a=await t.get(e);return t.response.ok&&a?a:null},y=e=>{Promise.all([A("/norn-data/stock/stat.json",v),A("/norn-data/gurus/gurus-table.json",j)]).then(a=>{if(console.log(a),2===a.length&&null!==a[0]&&null!==a[1]){let t=a[1].data,r=a[1].manager_list,n=Object.keys(t).reduce((l,n,o)=>{let i=a[0][n],u={id:o,symbol:n,Close:null!=i&&"-"!==i.Close?i.Close:-Number.MAX_VALUE,PE:null!=i&&"-"!==i["P/E"]?i["P/E"]:Number.MAX_VALUE,PB:null!=i&&"-"!==i["P/B"]?i["P/B"]:Number.MAX_VALUE,Dividend:null!=i&&"-"!==i["Dividend %"]?i["Dividend %"]:-Number.MAX_VALUE,High52:null!=i&&"-"!==i["52W High"]?i["52W High"]:-Number.MAX_VALUE,Low52:null!=i&&"-"!==i["52W Low"]?i["52W Low"]:-Number.MAX_VALUE,PerfWeek:null!=i&&"-"!==i["Perf Week"]?i["Perf Week"]:-Number.MAX_VALUE,PerfMonth:null!=i&&"-"!==i["Perf Month"]?i["Perf Month"]:-Number.MAX_VALUE,PerfQuarter:null!=i&&"-"!==i["Perf Quarter"]?i["Perf Quarter"]:-Number.MAX_VALUE,PerfHalfY:null!=i&&"-"!==i["Perf Half Y"]?i["Perf Half Y"]:-Number.MAX_VALUE,PerfYear:null!=i&&"-"!==i["Perf Year"]?i["Perf Year"]:-Number.MAX_VALUE,PerfYTD:null!=i&&"-"!==i["Perf YTD"]?i["Perf YTD"]:-Number.MAX_VALUE,ShortFloat:null!=i&&"-"!==i["Short Float"]?i["Short Float"]:-Number.MAX_VALUE,GurusCount:0,GurusValue:0};r.forEach(e=>{u[e.name]=0});let c=0,s=0;return t[n].forEach(e=>{u[e.name]=e.value,c+=1,s+=e.value}),u.GurusCount=c,u.GurusValue=s,(0===e.filter_symbols.length||e.filter_symbols.includes(n))&&l.push(u),l},[]);p.current={symbol:{hide:!1,text:"Symbol"},Close:{hide:!1,text:"Price"},PE:{hide:!1,text:"P/E"},PB:{hide:!1,text:"P/B"},Dividend:{hide:!1,text:"Dividend %"},High52:{hide:!1,text:"52W High"},Low52:{hide:!1,text:"52W Low"},PerfWeek:{hide:!1,text:"Perf Week"},PerfMonth:{hide:!1,text:"Perf Month"},PerfQuarter:{hide:!1,text:"Perf Quarter"},PerfHalfY:{hide:!1,text:"Perf Half Y"},PerfYear:{hide:!1,text:"Perf Year"},PerfYTD:{hide:!1,text:"Perf YTD"},ShortFloat:{hide:!1,text:"Short Float"},GurusCount:{hide:!1,text:"Gurus Count"},GurusValue:{hide:!1,text:"Gurus Value"}},r.forEach(e=>{p.current[e.name]={hide:!1,text:e.name}}),w((e=>l.a.createElement(l.a.Fragment,null,l.a.createElement(c.a,{style:{margin:"10px 0px"}},"Data Reference: ",l.a.createElement(u.a,{href:h.k,target:"_blank",rel:"noreferrer noopener",style:{paddingRight:"15px"}},l.a.createElement("span",null,"Finviz")),l.a.createElement(u.a,{href:h.d,target:"_blank",rel:"noreferrer noopener",style:{paddingRight:"15px"}},l.a.createElement("span",null,"Dataroma")),l.a.createElement(u.a,{href:h.z,target:"_blank",rel:"noreferrer noopener",style:{paddingRight:"15px"}},l.a.createElement("span",null,"Zacks")),l.a.createElement(u.a,{href:h.n,target:"_blank",rel:"noreferrer noopener",style:{paddingRight:"15px"}},l.a.createElement("span",null,"Insider Monkey")),l.a.createElement("br",null),"More Gurus Activity: ",e.map(e=>(console.log(e),l.a.createElement(l.a.Fragment,null,l.a.createElement(u.a,{href:e.link,target:"_blank",rel:"noreferrer noopener",style:{paddingRight:"10px"}},l.a.createElement("span",null,e.name))," "))))))(r)),x(P()),M(n)}else o.current.popModalWindow(l.a.createElement("div",null,"Load some data failed"));t.current.setLoading(!1)}).catch(()=>{o.current.popModalWindow(l.a.createElement("div",null,"Can't get data")),t.current.setLoading(!1)})},{0:k,1:w}=Object(r.useState)(l.a.createElement(l.a.Fragment,null)),{0:C,1:M}=Object(r.useState)([]),{0:O,1:L}=Object(r.useState)("");return Object(r.useEffect)(()=>(y({filter_symbols:[]}),()=>{}),[]),l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:E.a.container},l.a.createElement("div",{className:E.a.showColumn},k),l.a.createElement("div",{className:E.a.table},l.a.createElement(i.a,{rows:C,columns:g,components:{NoRowsOverlay:m.a,Toolbar:()=>l.a.createElement(b.a,{searchVal:O,setSearchVal:L,clickCallback:y,info:{placeholder:"Filter symbols: AAPL, BAC, KSS, ..."}})},disableSelectionOnClick:!0,onColumnVisibilityChange:e=>{let t=a;t[e.field]=!e.isVisible,n(t)}}))),l.a.createElement(d.a,{modalWindowRef:o}))},g=a("3Y3G"),x=a("vrFN");t.default=()=>{const e=Object(r.useRef)({getLoading:null,setLoading:null});return l.a.createElement(n.a,{injectFirst:!0},l.a.createElement(x.a,null),l.a.createElement(o.a,null,l.a.createElement(P,{loadingAnimeRef:e})),l.a.createElement(g.a,{loadingAnimeRef:e}))}},Nb3f:function(e,t,a){"use strict";var r=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=r(a("jelL")),n=a("nKUr");t.default=(0,l.default)((0,n.jsx)("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"}),"Search")},cD7S:function(e,t,a){"use strict";var r=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=r(a("jelL")),n=a("nKUr");t.default=(0,l.default)((0,n.jsx)("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-6h2zm0-8h-2V7h2z"}),"Info")},jAbX:function(e,t,a){},mkt2:function(e,t,a){"use strict";a.d(t,"a",(function(){return h}));var r=a("wx14"),l=a("zLVn"),n=a("q1tI"),o=a("ALuu"),i=a("Vn7y"),u=a("aGM9"),c=a("7Cdf"),s=a("FltU"),d=a("nKUr");const m=["className","children"],f=Object(i.a)("div",{name:"MuiDataGrid",slot:"ToolbarContainer",overridesResolver:(e,t)=>t.toolbarContainer})(e=>{let{theme:t}=e;return{display:"flex",alignItems:"center",flexWrap:"wrap",padding:t.spacing(.5,.5,0)}}),h=n.forwardRef((function(e,t){const{className:a,children:n}=e,i=Object(l.a)(e,m),h=Object(s.a)(),b=(e=>{const{classes:t}=e;return Object(u.a)({root:["toolbarContainer"]},c.a,t)})(h);return n?Object(d.jsx)(f,Object(r.a)({ref:t,className:Object(o.a)(a,b.root),ownerState:h},i,{children:n})):null}))},zYSo:function(e,t,a){e.exports={container:"investmentGurus-module--container--1Nn47",showColumn:"investmentGurus-module--showColumn--1JNCh",table:"investmentGurus-module--table--1PNC9"}}}]);
//# sourceMappingURL=component---src-pages-investment-gurus-js-d3a11547609ca308c6c5.js.map