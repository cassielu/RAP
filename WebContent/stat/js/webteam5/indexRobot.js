! function() {
  /**
   * configurations
   */
  var selfId = '{{id}}';


  var ev = document.createEvent('HTMLEvents');
  var homeBtn = $('#navigation .bbl-history[href="/home"]');
  var first = true;

  ev.initEvent('click', true, true);
  setInterval(checker, 60 * 1000);

  function checker() {
    if (first) {
      console.log('first loading...');
      first = false;
      main();
    } else {
      if (window.__length__ === 0) {
        console.log("robot reloading...");
        homeBtn.get(0).dispatchEvent(ev);
        main();
      } else {
        console.log('check finished, process is undergoing...');
      }
    }
  }

  function main() {
    var LaiWang = {
      autoVoice: function() {

        var msgs = ['今天好冷啊~', '额...T  .T', 'piu~piu~~', ':)', '>. <', 'd- m-b|||'];

        var send = function(arr) {
          console.log(arr.length);
          window.__length__ = arr.length;
          var item = arr.shift();
          if (item) {
            $.ajax({
              url: '/score/add/' + item.appId + '/' + item.id + '.json',
              type: 'POST',
              data: {
                scoreType: Math.round(Math.random() * 5) + 1,
                uidAppItemOwner: item.uid
              },
              complete: function() {
                $.ajax({
                  url: '/comment/add/' + item.appId + '/' + item.id + '/' +
                    item.uid + '.xhtml',
                  type: 'POST',
                  data: {
                    content: msgs[Math.round(Math.random() * (msgs.length -
                      1))]
                  },
                  complete: function() {
                    setTimeout(function() {
                      send(arr);
                    }, 5000 + Math.random() * 5000);
                  }
                });
              }
            });
          }
        };

        var readList = function() {
          var lis = document.getElementById('wall').childNodes;
          var a = [];
          for (var i = lis.length - 1, li; i >= 0; i--) {
            li = lis[i];
            if (li && li.tagName && li.tagName == 'LI') {
              var anchors = li.getElementsByTagName('a');
              var sent = false;
              for (var j = anchors.length - 1, anchor; j >= 0; j--) {
                anchor = anchors[j];
                if (anchor.getAttribute('data-uid') == selfId) {
                  sent = true;
                  break;
                }
              }
              if (!sent) {
                a.push({
                  uid: li.getAttribute('data-uid'),
                  id: li.getAttribute('data-id'),
                  appId: li.getAttribute('data-app-id')
                });
              }
            }
          }
          send(a);
        };
        var loadMore = function(flag) {
          var node = document.getElementById('wall-wrapper');
          var e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          var last = node.lastChild;
          while (last.nodeType != 1) {
            last = last.previousSibling;
          }
          last.dispatchEvent(e);
          if (flag < 5) {
            setTimeout(function() {
              loadMore(flag + 1);
            }, 5000);
          } else {
            readList();
          }
        };


        loadMore(0);
      }
    };

    LaiWang.autoVoice();
  }

}();