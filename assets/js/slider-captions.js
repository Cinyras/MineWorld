$(document).ready(function () {
  $slider = $("#main-image-slider"); //Image Slider
  $captionBox = $(".imageCaption");

  var caption = $slider.find(".active").attr('data-content')

  $captionBox.text(caption);

  $slider.on('slid.bs.carousel', function (evt) {
    caption = $slider.find(".active").attr('data-content');
    $captionBox.text(caption);
  });
});
