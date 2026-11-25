// Lets an embedded call-out poster (diagram.js) resize its own iframe.
// diagram.js posts { type: 'microsim-resize', height } to the parent page; this
// listener finds the iframe that sent it and sets its height. Pages without the
// message keep the static height attribute.
window.addEventListener('message', function (event) {
  if (!event.data || event.data.type !== 'microsim-resize') return;
  var iframes = document.querySelectorAll('iframe');
  for (var i = 0; i < iframes.length; i++) {
    if (iframes[i].contentWindow === event.source) {
      iframes[i].style.height = event.data.height + 'px';
      break;
    }
  }
});
