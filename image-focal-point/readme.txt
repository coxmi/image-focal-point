=== Image Focal Point ===
Contributors: coxmi
Donate link: https://coxmichael.co.uk/
Tags: media-library, focal-point, images, image
Requires at least: 6.0
Tested up to: 6.9
Stable tag: 1.0.0
Requires PHP: 7.0
License: MIT
License URI: https://opensource.org/licenses/MIT
Select a focal point for images in your media library.

== Description ==

Image Focal Point

WordPress plugin to select a focal point for images in your media library.

In your theme, get the focal point position by calling `get_post_meta` with your attachment’s `$id`:

<?php
  $x = get_post_meta($attachmentId, "x", true);
  $y = get_post_meta($attachmentId, "y", true);
?>

The values returned are percentages from the left and top edges of the image, so you can use them in `object-position` or `background-position`:

<?php
  $focalpoint = "${x}% ${y}%";
?>
<img style="object-position:<?php echo $focalpoint ?>">

