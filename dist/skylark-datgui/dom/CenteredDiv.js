/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["../dom/dom","../utils/common"],function(t,e){"use strict";return class{constructor(){this.backgroundElement=document.createElement("div"),e.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),t.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),e.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);const n=this;t.bind(this.backgroundElement,"click",function(){n.hide()})}show(){const t=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),e.defer(function(){t.backgroundElement.style.opacity=1,t.domElement.style.opacity=1,t.domElement.style.webkitTransform="scale(1)"})}hide(){const e=this,n=function(){e.domElement.style.display="none",e.backgroundElement.style.display="none",t.unbind(e.domElement,"webkitTransitionEnd",n),t.unbind(e.domElement,"transitionend",n),t.unbind(e.domElement,"oTransitionEnd",n)};t.bind(this.domElement,"webkitTransitionEnd",n),t.bind(this.domElement,"transitionend",n),t.bind(this.domElement,"oTransitionEnd",n),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"}layout(){this.domElement.style.left=window.innerWidth/2-t.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-t.getHeight(this.domElement)/2+"px"}}});
//# sourceMappingURL=../sourcemaps/dom/CenteredDiv.js.map
