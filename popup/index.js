window.onload = function () {
  // 获取所有的图片元素
  var images = document.getElementsByTagName("img");
  var outputArray = [];

  // 遍历所有的图片元素并输出它们的信息
  for (var i = 0; i < images.length; i++) {
    var imageInfo = {};

    // 输出图片URL
    imageInfo.url = images[i].src;

    // 输出图片尺寸信息
    imageInfo.size = images[i].width + "x" + images[i].height;

    // 输出图片内存大小
    imageInfo.memorySize = convertImageSize(images[i]);

    // 获取图片格式并存储到数组中
    getImageFormatFromImgElement(images[i])
      .then((format) => {
        imageInfo.format = format;
        outputArray.push(imageInfo);
        if (outputArray.length === images.length) {
          console.log(outputArray);
        }
      })
      .catch((error) => {
        imageInfo.format = "获取格式失败: " + error;
        outputArray.push(imageInfo);
        if (outputArray.length === images.length) {
          console.log(outputArray);
        }
      });
  }
};

// 计算图片大小
function convertImageSize(imageElement) {
  var sizeInBytes = 0;

  // 检查图片是否已加载
  if (imageElement.complete) {
    // 计算图片大小（假设每个像素占据 4 个字节）
    sizeInBytes = imageElement.naturalWidth * imageElement.naturalHeight * 4;

    // 动态选择最合适的单位
    var units = ["B", "KB", "MB", "GB"];
    var size = sizeInBytes;
    var unit = "B";

    while (size >= 1024 && units.length > 1) {
      size = size / 1024;
      size = size.toFixed(2);

      unit = units.shift();
    }

    return size + " " + unit;
  } else {
    return "图片尚未加载完成";
  }
}

// 获取图片格式
// 获取图片格式
function getImageFormatFromImgElement(imgElement) {
  return new Promise((resolve, reject) => {
    var imageUrl = imgElement.src;

    fetch(imageUrl, {
      method: "HEAD", // 发送HEAD请求以获取响应头而不是实际数据
    })
      .then((response) => {
        if (response.ok) {
          // 从响应头中获取Content-Type字段，即图片的MIME类型
          var contentType = response.headers.get("Content-Type");
          if (contentType) {
            var format = contentType.split("/").pop(); // 从MIME类型中获取格式
            console.log("Image format: " + format);
            resolve(format);
          } else {
            console.log("无法获取图片格式");
            reject("无法获取图片格式");
          }
        } else {
          console.log("网络请求失败");
          reject("网络请求失败");
        }
      })
      .catch((error) => {
        console.error("发生错误:", error);
        reject("发生错误:" + error);
      });
  });
}
