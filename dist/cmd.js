var _=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports),A=_((s,e)=>{var t=(o,a)=>o[++a]!=null&&o[a][0]!=="-",l=(o)=>{if(o==="true")return!0;if(o==="false")return!1;if(/^-?\d+(\.\d+)?$/.test(o))return Number(o);return o},u=(o,a,m)=>{let c=a.includes("-")?a.replace(/-([a-z])/g,(g,i)=>i.toUpperCase()):a;if(o.flags[a]=m,c!==a)o.flags[c]=m},k=(o,a,m)=>{let c=[],g=a;if(m!=null)return c.push(l(m)),{values:c,offset:0};while(t(o,g))c.push(l(o[++g]));return{values:c,offset:g-a}},b=(o={})=>{let{raw:a=process.argv.slice(2),alias:m={},array:c=[],boolean:g=[]}=o,i={args:{},flags:{},_:[],_tail:[]},j=(r,n)=>{let d=r.indexOf("="),p=r.startsWith("--no-"),f=r.slice(p?5:2,~d?d:void 0),h=~d?r.slice(++d):null;if(f=m[f]||f,p||g.includes(f))return u(i,f,!p),n;if(c.includes(f)){let{values:W,offset:z}=k(a,n,h);return u(i,f,(i.flags[f]||[]).concat(W)),n+z}return h=h!=null?l(h):t(a,n)?l(a[++n]):!0,u(i,f,h),n},O=(r,n)=>{if(r.length>2){for(let f of r.slice(1)){let h=m[f]||f;u(i,h,!0)}return n}let d=m[r[1]]||r[1];if(g.includes(d))return u(i,d,!0),n;if(c.includes(d)){let f=[],h=n;while(t(a,h))f.push(l(a[++h]));return u(i,d,(i.flags[d]||[]).concat(f)),h}let p=t(a,n)?l(a[++n]):!0;return u(i,d,p),n};for(let r=0;r<a.length;r++){let n=a[r];if(n==="--"){i._tail=a.slice(++r);break}if(n[0]==="-")r=n[1]==="-"?j(n,r):O(n,r);else i._.push(n)}let v=o.default||{};for(let r in v)if(!(r in i.flags))u(i,r,v[r]);let x=o.args||[];for(let r=0;r<x.length;r++){let n=x[r];if(n.startsWith("...")){i.args[n.slice(3)]=i._.slice(r);break}i.args[n]=i._[r]}return i};e.exports=b,b.default=b}),H=_((s,e)=>{var t=A(),l=t;e.exports=l}),y=H();class w{option={args:["method","...arguments"],alias:{h:"help",v:"version",o:"option"},array:["option"],boolean:["force"]};combine(s,e){return[...new Set([...s,...e])]}constructor(s={}){if(s.alias)Object.assign(this.option.alias,s.alias);if(s.array){let l=this.combine(this.option.array,s.array);this.option.array=l}if(s.boolean){this.option.boolean.push(s.boolean);let l=this.combine(this.option.boolean,s.boolean);this.option.boolean=l}let e=y(this.option),t=!1;if(e._tail.length>0)t=e._tail;if(delete e._,delete e._tail,t)e.tail={exec:t[0],command:t.slice(1).join(" ")};return e}}var N=w;function U(s,e){let t="";if(s.args.method===void 0){if(t+=`Usage:  <method> <command> [option]
`,e.methods!==void 0){t+=`
method:
`;for(let l in e.methods)t+="  "+e.methods[l]+`
`}}else{if(t+=`
method:
`,e.method===void 0)t+="  undefined";else{let l=Object.keys(e.method)[0];t+="  "+l+": "+e.method[l]+`
`}if(t+=`
command:
`,e.arguments===void 0)t+="  undefined";else{let l=Object.keys(e.arguments);for(let u in l)t+="  "+l[u]+": "+e.arguments[l[u]]+`
`}}if(s.args.method===void 0)t+=`
options:
`,t+=`  -h, --help		: show help
`,t+=`  -v, --version		: show version
`,t+=`  -o, --option		: array option
`,t+=`  --force		: force operation
`;console.log(t.trim())}var q=U;export{q as showHelp,N as Args};
