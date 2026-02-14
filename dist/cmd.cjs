var{defineProperty:v,getOwnPropertyNames:q,getOwnPropertyDescriptor:C}=Object,F=Object.prototype.hasOwnProperty;var y=new WeakMap,K=(n)=>{var e=y.get(n),t;if(e)return e;if(e=v({},"__esModule",{value:!0}),n&&typeof n==="object"||typeof n==="function")q(n).map((r)=>!F.call(e,r)&&v(e,r,{get:()=>n[r],enumerable:!(t=C(n,r))||t.enumerable}));return y.set(n,e),e};var S=(n,e)=>{for(var t in e)v(n,t,{get:e[t],enumerable:!0,configurable:!0,set:(r)=>e[t]=()=>r})};var E={};S(E,{showHelp:()=>W,Args:()=>O});module.exports=K(E);var w=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports),$=w((n,e)=>{var t=(s,i)=>s[++i]!=null&&s[i][0]!=="-",r=(s)=>{if(s==="true")return!0;if(s==="false")return!1;if(/^-?\d+(\.\d+)?$/.test(s))return Number(s);return s},u=(s,i,m)=>{let c=i.includes("-")?i.replace(/-([a-z])/g,(g,o)=>o.toUpperCase()):i;if(s.flags[i]=m,c!==i)s.flags[c]=m},z=(s,i,m)=>{let c=[],g=i;if(m!=null)return c.push(r(m)),{values:c,offset:0};while(t(s,g))c.push(r(s[++g]));return{values:c,offset:g-i}},b=(s={})=>{let{raw:i=process.argv.slice(2),alias:m={},array:c=[],boolean:g=[]}=s,o={args:{},flags:{},_:[],_tail:[]},A=(a,l)=>{let d=a.indexOf("="),p=a.startsWith("--no-"),f=a.slice(p?5:2,~d?d:void 0),h=~d?a.slice(++d):null;if(f=m[f]||f,p||g.includes(f))return u(o,f,!p),l;if(c.includes(f)){let{values:N,offset:U}=z(i,l,h);return u(o,f,(o.flags[f]||[]).concat(N)),l+U}return h=h!=null?r(h):t(i,l)?r(i[++l]):!0,u(o,f,h),l},H=(a,l)=>{if(a.length>2){for(let f of a.slice(1)){let h=m[f]||f;u(o,h,!0)}return l}let d=m[a[1]]||a[1];if(g.includes(d))return u(o,d,!0),l;if(c.includes(d)){let f=[],h=l;while(t(i,h))f.push(r(i[++h]));return u(o,d,(o.flags[d]||[]).concat(f)),h}let p=t(i,l)?r(i[++l]):!0;return u(o,d,p),l};for(let a=0;a<i.length;a++){let l=i[a];if(l==="--"){o._tail=i.slice(++a);break}if(l[0]==="-")a=l[1]==="-"?A(l,a):H(l,a);else o._.push(l)}let x=s.default||{};for(let a in x)if(!(a in o.flags))u(o,a,x[a]);let _=s.args||[];for(let a=0;a<_.length;a++){let l=_[a];if(l.startsWith("...")){o.args[l.slice(3)]=o._.slice(a);break}o.args[l]=o._[a]}return o};e.exports=b,b.default=b}),B=w((n,e)=>{var t=$(),r=t;e.exports=r}),k=B();class j{option={args:["method","...arguments"],alias:{h:"help",v:"version",o:"option"},array:["option"],boolean:["force"]};combine(n,e){return[...new Set([...n,...e])]}constructor(n={}){if(n.alias)Object.assign(this.option.alias,n.alias);if(n.array){let r=this.combine(this.option.array,n.array);this.option.array=r}if(n.boolean){this.option.boolean.push(n.boolean);let r=this.combine(this.option.boolean,n.boolean);this.option.boolean=r}let e=k(this.option),t=!1;if(e._tail.length>0)t=e._tail;if(delete e._,delete e._tail,t)e.tail={exec:t[0],command:t.slice(1).join(" ")};return e}}var O=j;function D(n,e={}){let t="";if(n.args.method===void 0){if(t+=`Usage:  <method> <command> [option]
`,e.methods!==void 0){t+=`
method:
`;for(let r in e.methods)t+="  "+e.methods[r]+`
`}}else{if(t+=`
method:
`,e.method===void 0)t+="  undefined";else{let r=Object.keys(e.method)[0];t+="  "+r+": "+e.method[r]+`
`}if(t+=`
command:
`,e.arguments===void 0)t+="  undefined";else{let r=Object.keys(e.arguments);for(let u in r)t+="  "+r[u]+": "+e.arguments[r[u]]+`
`}}if(n.args.method===void 0)t+=`
options:
`,t+=`  -h, --help		: show help
`,t+=`  -v, --version		: show version
`,t+=`  -o, --option		: array option
`,t+=`  --force		: force operation
`;console.log(t.trim())}var W=D;
