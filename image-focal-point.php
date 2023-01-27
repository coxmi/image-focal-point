<?php
/**
* Plugin Name: Image Focal Point
* Description: Set a focal point on images in the media library
* Version: 1.0
* Author: Michael Cox
* License: MIT
* License URI: https://mit-license.org/
*
*/


add_filter('attachment_fields_to_edit', function($fields, $post) {

	// add hidden x and y fields to attachment screen in media library

	$x = get_post_meta($post->ID, "x", true);
	$y = get_post_meta($post->ID, "y", true);
	$fields["x"] = [ "input" => "hidden", "value" => $x ];
	$fields["y"] = [ "input" => "hidden", "value" => $y ];

    // load the focal point selector UI
    // in js, triggering a change event on the hidden input will save to the wp database 

    $meta = wp_get_attachment_metadata($post->ID);
    if ($x) $meta['x'] = $x;
    if ($x) $meta['y'] = $y; 
    $meta['baseurl'] = trailingslashit(wp_upload_dir()['baseurl']) ?? "";
    $json = json_encode($meta, JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
    
    $html = "
		<style>
			.media-types-required-info {
				display:none;
			}
		</style>
		<script id='focalpoint-json-$post->ID' type='application/json'>$json</script>
		<script>
			if (window.focalpointLoad) window.focalpointLoad($post->ID)
		</script>
	";

    $fields['focalpoint'] = [
		'value' => '',
		'helps' => '',
		'label' => '',
		'input'  => 'html',
		'html'=> $html
	];

    return $fields;

}, 10, 2);


add_filter('attachment_fields_to_save', function($post, $attachment) {
	if (isset($attachment['x'])) update_post_meta($post['ID'], 'x', $attachment['x']);
	if (isset($attachment['y'])) update_post_meta($post['ID'], 'y', $attachment['y']);
	return $post;
}, 10, 2);


add_action('admin_enqueue_scripts', function() {	
	wp_enqueue_style('focalpoint-style', plugin_dir_url(__FILE__) . 'style.css');
	wp_enqueue_script('focalpoint-script', plugin_dir_url(__FILE__) . 'script.js');
});


add_filter('acf/format_value/type=image', function($value, $post_id, $field) {
    if (!is_array($value) || !isset($value['ID'])) return $value;
    $id = $value['ID'];
    $value['x'] = get_post_meta($id, 'x', true);
    $value['y'] = get_post_meta($id, 'y', true);
    return $value;
}, 20, 3);