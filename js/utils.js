function rebind(target, source) {
  var i = 1,
    n = arguments.length,
    method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

function clickcancel() {
  var event = d3.dispatch('click', 'dblclick');
  function cc(selection) {
      var down,
          tolerance = 5,
          last,
          wait = null;
      // euclidean distance
      function dist(a, b) {
          return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
      }
      selection.on('mousedown', function() {
          down = d3.pointer(document.body);
          last = +new Date();
      });
      selection.on('mouseup', function() {
          if (dist(down, d3.pointer(document.body)) > tolerance) {
              return;
          } else {
              if (wait) {
                  window.clearTimeout(wait);
                  wait = null;
                  event.dblclick(d3.event);
              } else {
                  wait = window.setTimeout((function(e) {
                      return function() {
                          event.click(e);
                          wait = null;
                      };
                  })(d3.event), 300);
              }
          }
      });
  };
  return rebind(cc, event, 'on');
}
var cc = clickcancel();

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})