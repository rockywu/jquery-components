/**
 * 叠层翻页插件动画，基于jquery
 */
(function(window, $) {

  /**
   * 叠层插件
   * @param {String} elm 根元素选择器
   * @options {Object} options
   * {
   *  auto : false, //是否自动播放
   *  interval: 4000, //默认自动播放间隔时间
   *  layerNum: 3, //可展示元素数量
   *  change: function(index, el) {}, //切换时回调函数
   * }
   */
  function OverlaySwiper(elm, options) {
    var that = this;
    options = options || {}
    layerNum = options.layerNum || 3;
    var elm = $(elm);
    var children = elm.children()
    if(elm.length < 1 || children.length < layerNum || (layerNum !== 3 && layerNum !==5) ) {
      throw new Error("参数存在错误")
    }
    //如果children.length == layerNum时需要copy元素
    if(children.length === layerNum) {
      elm.append(children.clone())
      children = elm.children()
    }
    var childWidth = children.width();
    var scale = 0.8;
    var step = 0.4;
    var width = parseInt(childWidth * scale * step, 10);

    var indexArr = [];
    //设置元素索引
    children.each(function(k, v) {
      $(v).attr("ol-index", k)
      var params = {
        "-webkit-transform": "translate3d(" + (k) * width + "px,0,0) scale("+scale+")",
        "transform" : "translate3d(" + (k) * width + "px,0,0) scale("+scale+")",
        "opacity": 0,
        "z-index": 1,
        "-webkit-transform-origin": "0 50%",
        "transform-origin": "0 50%"
      }
      var tmp = parseInt(layerNum/2, 10) - 1;
      if(k == tmp) {
        params["opacity"] = 0.3
        params["z-index"] = 2
        params["-webkit-transform-origin"] = "0 50%"
        params["transform-origin"] = "0 50%"
      } else if(k == tmp + 1) {
        params["-webkit-transform"] = "translate3d(" + (k) * width + "px,0,0) scale(1)"
        params["transform"] = "translate3d(" + (k) * width + "px,0,0) scale(1)"
        params["opacity"] = 1
        params["z-index"] = 3;
      } else if(k == tmp + 2) {
        params["opacity"] = 0.3
        params["z-index"] = 2
        params["-webkit-transform-origin"] = "100% 50%"
        params["transform-origin"] = "100% 50%"
      }
      $(v).css(params)
      indexArr.push({
        selecter: "[ol-index="+k+"]",
        styles: params
      })
    });

    //定时器
    var timer = null
    options.interval = parseInt(options.interval, 10) || 4000
    var autoPlay = function () {
      if(options.auto !== true) {
        return;
      }
      if(timer) {
        clearInterval(timer)
      }
      timer = setInterval(function() {
        that.next();
      }, options.interval)
    }

    autoPlay();

    this.index = 0;

    //上一张切换
    function prev(children, indexArr){
      indexArr.push(indexArr[0]);
      indexArr.shift();
      $(children).each(function(i,e){
        if(indexArr[i].styles["z-index"] === 3) {
          that.index = i;
        }
        $(e).css(indexArr[i].styles)
      })
    }

    //下一张切换
    function next(children, indexArr){
      indexArr.unshift(indexArr[indexArr.length - 1]);
      indexArr.pop();
      $(children).each(function(i,e){
        if(indexArr[i].styles["z-index"] === 3) {
          that.index = i;
        }
        $(e).css(indexArr[i].styles)
      })
    }

    //设置调度函2
    this.next = function() {
      next(children, indexArr)
      if(options && typeof options.change == 'function') {
        options.change(that.index, children.get(that.index))
      }
      autoPlay()
    }

    //设置调度函数
    this.prev = function() {
      prev(children, indexArr)
      if(options && typeof options.change == 'function') {
        options.change(that.index, children.get(that.index))
      }
      autoPlay()
    }

    // 鼠标移入box时清除定时器
    elm.mouseover(function(){
      console.log("mouseover")
      clearInterval(timer);
    })

    // 鼠标移出box时开始定时器
    elm.mouseleave(function(){
      console.log("mouseleave")
      autoPlay()
    })

  }

  window.OverlaySwiper = OverlaySwiper;
})(window, window.jQuery)