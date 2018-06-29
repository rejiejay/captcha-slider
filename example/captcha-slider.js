/*!
 * captcha-slider v1.0.0 https://github.com/rejiejay/captcha-slider
 * Authors rejiejay 454766952@qq.com
 * Licensed MIT 
 */
var CaptchaSlider = {
  param: { // 参数
    id:'captcha-slider',
    width: 310,
    height: 155,
  },

  /**
   * 回调函数
   * @return {Boolean} 是否成功
   */
   resolve: function() {},
   reject: function() {},
  
  element: {
    // sliderBackground: <canvas></canvas>,
    // objective: <canvas></canvas>,
    // block: <canvas></canvas>,
    // blockshadow: <canvas></canvas>,
    
    // dragContent: <div></div>,
    // dragMask: <div></div>,
    // dragHandle: <div></div>,
    // dragText: <div></div>,
  },
  my_x_axis: 0,
  target_x_axis: 100, // 目标位置

  matchOffset: 3, // 匹配 偏差范围

  /**
   * 初始化
   * @param {object} param 配置参数
   */
  init: function init(param) {
    var _this = this;
    this.param = {
      id: param.id ? param.id : 'captcha-slider',
      width: param.width ? param.width : 310,
      height: param.height ? param.height : 155,
    }

    this.build();

    return new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  },

  /**
   * 初始化 复用方法
   */
  build: function build() {
    
    this.my_x_axis = 0; // 重置

    // 创建 DOM 元素
    this.renderElement();

    // 创建 canvas
    this.initCanvas();
    this.initCanvasLocation();

    // 创建 drag
    this.initSliderDrag();
  },

  /**
   * 创建 Element 元素
   */
  renderElement: function renderElement() {
    var _this = this;
    var captchaElement = document.getElementById('' + this.param.id);

    var refreshIcon = [
      '<svg t="1530243424799" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6039" xmlns:xlink="http://www.w3.org/1999/xlink" ',
        'width="23" height="23">',
        '<path d="M55.935033 264.48948c0 0 85.897017-132.548409 221.81443-203.673173 135.916406-71.121743 303.368504-50.646859 413.187968 18.319527 109.819465 68.970415 146.791894 127.160016 146.791894 127.160016l94.59499-53.879895c0 0 19.576483-9.697092 19.576483 12.932142l0 338.379961c0 0 0 30.17399-22.837719 19.395191-19.210878-9.062571-226.959086-127.198289-292.424528-164.466828-35.950145-16.035251-4.365101-29.062068-4.365101-29.062068l91.284402-52.173738c0 0-52.068992-65.209619-128.278989-99.744682-81.576231-42.501826-157.948384-47.541735-251.497925-12.224097-61.002644 23.025054-132.823368 81.988166-184.553949 169.082716L55.935033 264.48948 55.935033 264.48948 55.935033 264.48948zM904.056909 711.697844c0 0-85.897017 132.550423-221.816444 203.671159-135.917413 71.12275-303.366489 50.651895-413.186961-18.315498-109.825508-68.972429-146.790886-127.165052-146.790886-127.165052L27.662591 823.768348c0 0-19.572454 9.703135-19.572454-12.932142L8.090137 472.459267c0 0 0-30.170968 22.831676-19.397205 19.211885 9.067607 226.965129 127.198289 292.430571 164.470856 35.950145 16.035251 4.366109 29.058039 4.366109 29.058039l-91.285409 52.175753c0 0 52.071006 65.206598 128.279996 99.744682 81.57321 42.498804 157.942341 47.540728 251.496918 12.222082 60.998616-23.026061 132.820346-81.983131 184.546898-169.082716L904.056909 711.697844 904.056909 711.697844 904.056909 711.697844zM904.056909 711.697844" p-id="6040" >',
        '</path>',
      '</svg>'
    ].join('');
    
    var dragIcon = [
      '<svg t="1530238656201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2557" xmlns:xlink="http://www.w3.org/1999/xlink" ',
        'width="23" height="23">',
        '<path d="M244.363636 556.939636h469.248l-184.762181 170.565819a34.909091 34.909091 0 1 0 47.36 51.29309l250.391272-231.121454a34.955636 34.955636 0 0 0 0-51.293091l-250.391272-231.121455a34.862545 34.862545 0 0 0-49.338182 1.95491 34.909091 34.909091 0 0 0 1.978182 49.338181l184.762181 170.565819H244.363636a34.909091 34.909091 0 1 0 0 69.818181" p-id="2558">',
        '</path>',
      '</svg>'
    ].join('');

    captchaElement.innerHTML = [
      // 拼图
      '<div id="captcha-slider-content" class="captcha-slider-content">',
        // 刷新
        '<div class="captcha-slider-refresh" id="slider-refresh"  style="left: ' + (this.param.width - 23 - 15) + 'px;">' + refreshIcon +'</div>',
        // canvas
        '<canvas width="' + this.param.width + '" height="' + this.param.height + '" id="captcha-slider-background" class="captcha-slider-background"></canvas>',
        '<canvas width="' + this.param.width + '" height="' + this.param.height + '" id="captcha-slider-objective" class="captcha-slider-objective captcha-slider-position"></canvas>',
        '<canvas width="' + this.param.width + '" height="' + this.param.height + '" id="captcha-slider-blockshadow" class="captcha-slider-blockshadow captcha-slider-position"></canvas>',
        '<canvas width="' + this.param.width + '" height="' + this.param.height + '" id="captcha-slider-block" class="captcha-slider-block captcha-slider-position"></canvas>',
      '</div>',
      // 滑块
      '<div class="captcha-slider-drag" style="width: ' + (this.param.width - 2) + 'px;" id="slider-drag-content">',
        '<div class="slider-drag-mask" id="drag-mask">',
          '<div class="slider-drag-handle flex-center" id="drag-handle">' + dragIcon +'</div>',
        '</div>',
        '<div class="slider-drag-text" id="drag-text">向右滑动滑块验证</div>',
      '</div> '
    ].join('');

    this.element.sliderBackground = document.getElementById('captcha-slider-background');
    this.element.objective = document.getElementById('captcha-slider-objective');
    this.element.block = document.getElementById('captcha-slider-block');
    this.element.blockshadow = document.getElementById('captcha-slider-blockshadow');

    this.element.dragContent = document.getElementById('slider-drag-content');
    this.element.dragMask = document.getElementById('drag-mask');
    this.element.dragHandle = document.getElementById('drag-handle');
    this.element.dragText = document.getElementById('drag-text');

    document.getElementById('slider-refresh').addEventListener('click', function () { // 点击图片重置
      _this.build();
    });
  },

  /**
   * 初始化 Canvas
   */
  initCanvas: function initCanvas() {
    var _this = this;

    var background_ctx = this.element.sliderBackground.getContext('2d');
    var objective_ctx = this.element.objective.getContext('2d');
    var block_ctx = this.element.block.getContext('2d');
    var blockshadow_ctx = this.element.blockshadow.getContext('2d');

    var PI = Math.PI;
    var block_width = 42;
    var block_radius = 10;
    
    /**
     * 生成随机数的方法
     * @param {number} min 下限
     * @param {number} max 上限
     * @return {number} 基于 min ~ max 之间随机数
     */
    var creatRandomBy = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 初始化 Y轴坐标
    var min_y_coordinate = block_radius * 2 + 15;
    var max_y_coordinate = this.param.height - block_width;
    var random_y_coordinate = creatRandomBy(min_y_coordinate, max_y_coordinate);

    // 初始化 Y轴坐标
    var min_x_coordinate = block_width + (block_radius * 2) + 15;
    var max_x_coordinate = this.param.width - block_width - (block_radius * 2) - 15;
    this.target_x_axis = creatRandomBy(min_x_coordinate, max_x_coordinate);
    var random_x_coordinate = this.target_x_axis;

    // 初始化 图片
    var imgElement = document.createElement('img');
    imgElement.onload = function() {
      background_ctx.drawImage(imgElement, 0, 0, _this.param.width, _this.param.height);
      block_ctx.drawImage(imgElement, 0, 0, _this.param.width, _this.param.height);
    };
    
    imgElement.src = 'http://p6ygud9kn.bkt.clouddn.com/captcha-slider/canvas%20%28' + creatRandomBy(1, 20) + '%29.jpg?imageView2/1/w/' + _this.param.width + '/h/' + _this.param.height + '/q/75|imageslim';

    /**
     * 绘制拼图的方法
     */
    function drawpuzzle(ctx, puzzle_width, puzzle_radius, x_coordinate, y_coordinate) {
      ctx.moveTo(x_coordinate, y_coordinate);
      ctx.lineTo(x_coordinate + puzzle_width/2, y_coordinate);
      ctx.arc(x_coordinate + puzzle_width/2, y_coordinate-puzzle_radius+2,  puzzle_radius, 0, 2*PI);
      ctx.lineTo(x_coordinate + puzzle_width/2, y_coordinate);
      ctx.lineTo(x_coordinate + puzzle_width, y_coordinate);
      ctx.lineTo(x_coordinate + puzzle_width, y_coordinate +puzzle_width/2);
      ctx.arc(x_coordinate + puzzle_width + puzzle_radius - 2, y_coordinate +puzzle_width/2, puzzle_radius, 0, 2*PI);
      ctx.lineTo(x_coordinate + puzzle_width, y_coordinate +puzzle_width/2);
      ctx.lineTo(x_coordinate + puzzle_width, y_coordinate +puzzle_width);
      ctx.lineTo(x_coordinate, y_coordinate + puzzle_width);
      ctx.lineTo(x_coordinate, y_coordinate);
    }
    
    /**
     * 绘制目标位置拼图
     */
    function drawObjective() {
      objective_ctx.beginPath();
      drawpuzzle(objective_ctx, block_width, block_radius, random_x_coordinate, random_y_coordinate);
      objective_ctx.fillStyle = '#fff';
      objective_ctx.fill();
    }

    /**
     * 绘制滑块
     */
    function drawBlock() {
      block_ctx.beginPath();
      drawpuzzle(block_ctx, block_width, block_radius, random_x_coordinate, random_y_coordinate);
      block_ctx.clip();
    }

    /**
     * 绘制滑块的阴影
     */
    function drawBlockshadow() {
      blockshadow_ctx.beginPath();
      blockshadow_ctx.shadowBlur = 20;
      blockshadow_ctx.shadowColor = "#fff";
      drawpuzzle(blockshadow_ctx, block_width, block_radius, random_x_coordinate, random_y_coordinate);
      blockshadow_ctx.fillStyle = '#fff';
      blockshadow_ctx.fill();
    }

    // 开始绘制 canvas
    drawObjective();
    drawBlock();
    drawBlockshadow();
  },
  
  /**
   * 绑定 Canvas 位置事件
   */
  initCanvasLocation: function initCanvasLocation() {
    var targetLeftStyle = this.my_x_axis - this.target_x_axis;

    this.element.block.style.left = targetLeftStyle + 'px';
    this.element.blockshadow.style.left = targetLeftStyle + 'px';
  },

  /**
   * 初始化 拖动
   */
  initSliderDrag: function initSliderDrag() {
    var _this = this;
    /**
     * 判断是否移动设备
     */
    var isMobiler = (function () {
      var isMobile = false;
  
      var myWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth;
  
      if (myWidth <= 768) { // 保底策略
        isMobile = true;
      }
  
      ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod'].map(function (terminal) {
        if (window.navigator.userAgent.indexOf(terminal) > 0) {
          isMobile = true;
        }
        return terminal;
      })
  
      return isMobile
    })();
    var succeedIcon = [
      '<svg t="1530238678016" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3369" xmlns:xlink="http://www.w3.org/1999/xlink" ',
        'width="24" height="24">',
        '<path d="M378.410667 850.450963C364.491852 850.450963 350.610963 845.293037 340.02963 834.939259L20.920889 523.529481C-0.279704 502.821926-0.279704 469.295407 20.920889 448.587852 42.121481 427.880296 76.48237 427.880296 97.682963 448.587852L378.410667 722.526815 925.75763 188.491852C946.958222 167.784296 981.319111 167.784296 1002.519704 188.491852 1023.720296 209.161481 1023.720296 242.688 1002.519704 263.395556L416.791704 834.939259C406.172444 845.293037 392.291556 850.450963 378.410667 850.450963L378.410667 850.450963Z" p-id="3370" ',
          'fill="#fff">',
        '</path>',
      '</svg>'
    ].join('');
    var failureIcon = [
      '<svg t="1530238694639" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4162" xmlns:xlink="http://www.w3.org/1999/xlink" ',
        'width="32" height="32">',
        '<path d="M733.952 336.333l-46.285-46.285L512 465.664 336.333 290.048l-46.285 46.285L465.664 512 290.048 687.667l46.285 46.285L512 558.336l175.667 175.616 46.285-46.285L558.336 512z" p-id="4163" ',
          'fill="#fff">',
        '</path>',
      '</svg>'
    ].join('');

    // 位移量
    var originX = 0;
    var originY = 0;
    var moveX = 0;
    var moveY = 0;

    // 定位成功
    var isMatch = false;

    /**
     * 拖动位置
     */
    var dragLocationModifier = function () {
      // 删除文字
      _this.element.dragText.innerHTML = '';

      // 添加激活状态
      _this.element.dragContent.classList.add('slider-drag-activate');

      _this.my_x_axis = moveX;
      _this.initCanvasLocation();
      _this.element.dragHandle.style.left = moveX + 'px';
      _this.element.dragMask.style.width = moveX + 'px';
    }

    var handleMouseMove = function (event) {
      // 位移量
      var mouseOffset = 0;
      if (isMobiler) { // 兼容移动端
        mouseOffset = event.changedTouches[0].clientX - originX;
      } else {
        mouseOffset = event.x - originX
      }

      // 移动到目标 范围
      if (
        mouseOffset > 0 &&  // 不能负数
        mouseOffset < (_this.param.width -  62) // 不能超过
      ) {
        moveX = mouseOffset;
        moveY = event.y - originY;
      }

      // 匹配目标
      if (
        mouseOffset >= (_this.target_x_axis - _this.matchOffset) && // 偏差
        mouseOffset <= (_this.target_x_axis + _this.matchOffset)
      ) {
        isMatch = true;
      } else {
        isMatch = false;
      }

      dragLocationModifier();
    };

    var handleMouseEnd = function () {
      _this.element.dragContent.classList.remove('slider-drag-activate');

      if (isMatch) { // 成功
        _this.element.dragContent.classList.add('slider-drag-succeed');
        _this.element.dragHandle.innerHTML = succeedIcon;
        _this.resolve(); // 回调
      } else {
        _this.element.dragContent.classList.add('slider-drag-failure');
        _this.element.dragHandle.innerHTML = failureIcon;
        _this.reject();

        setTimeout(function() {
          _this.build();
        }, 1000);
      }

      if (isMobiler) { // 兼容移动端
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseEnd);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseEnd);
      }
    };

    if (isMobiler) { // 兼容移动端
      this.element.dragHandle.addEventListener('touchstart', function (event) {
        // 原始坐标
        originX = event.changedTouches[0].clientX;
        originY = event.changedTouches[0].clientY;
  
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseEnd);
      }); 
    } else {
      this.element.dragHandle.addEventListener('mousedown', function (event) {
        // 原始坐标
        originX = event.x;
        originY = event.y;
  
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseEnd);
      }); 
    }
  }
}
