# Captcha Slider

基于Canvas实现拖动滑块验证

html5 Canvas drag captcha slider jigsaw

## 例子 Demo

[demo](https://www.rejiejay.cn/github/captcha-slider)

![图片](https://github.com/rejiejay/captcha-slider/blob/master/demo.png)

## 使用 Usage

引入组件.  
Import components.  

``` 

<link rel="stylesheet" type="text/css" href="./captcha-slider.css">
<script src="./captcha-slider.js"></script>

```

开始使用.  
Usage.  

``` 

<div id="captcha-slider" class="captcha-slider"></div>

<script>

    CaptchaSlider.init({
        id: 'captcha-slider',
        width: 310,
        height: 155,
    })
    .then(function (succeed) {
        ...
    }, function (error) {
        ...
    });
    
</script>

```

## 图片 Image

图片存储在[七牛云](https://www.qiniu.com/)上面, 大家可以在代码里面自行替换掉.

Picture is stored in [qiniu](https://www.qiniu.com/). You can replace it in the JavaScript Code.


## 感谢 Contribution

此项目参考前辈的代码, 十分感谢前辈们的分享!

This project refers to the code of the older generation and is very grateful to the older generation for sharing!

> [js+canvas实现滑动拼图验证码功能](http://m.php.cn/article/398849.html)、[canvas滑动验证码](https://github.com/yeild/jigsaw)

## License
MIT
