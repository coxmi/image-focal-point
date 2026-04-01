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

WordPress plugin to select a focal point for images in your media library.

Stores x and y position values (as percentages) on media attachments.

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/image-focal-point` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Usage ==

Get focal point values in your theme using `get_post_meta`:

`$x = get_post_meta($attachmentId, "x", true);`
`$y = get_post_meta($attachmentId, "y", true);`

The values are percentages from the left and top edges of the image.

Use them with CSS `object-position` or `background-position`:

`$focalpoint = "$x% $y%";`

Apply in markup:

`<img style="object-position: <?php echo esc_attr($focalpoint); ?>">`


== Frequently Asked Questions ==

== Changelog ==
Initial release

== Upgrade Notice ==

== Screenshots ==

1. Focal point selection UI