<?php
/**
 * Plugin Name: UK Schools on Map
 * Description: A custom plugin to display a map with school locations and search form.
 * Version: 1.1
 * Author: Syed Mashiur Rahman
 * Author URI: https://mashi-portfolio.vercel.app/
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue the Google Maps API and custom JavaScript
function custom_map_enqueue_scripts() {
    // Get the saved API key from the options table
    $google_maps_api_key = get_option('uk_schools_on_map_api_key', '');

    if (!empty($google_maps_api_key)) {
      
        // Enqueue the custom map script (newmap.js)
        wp_enqueue_script('custom-map-script', plugin_dir_url(__FILE__) . 'newmap.js', [], null, true);
        
        // Enqueue the Google Maps API
        wp_enqueue_script('google-maps-api', 'https://maps.googleapis.com/maps/api/js?key=' . $google_maps_api_key . '&callback=initMap&v=weekly&libraries=marker', [], null, true);

    }
}

// Register shortcode to display the map and form
function uk_schools_on_map_shortcode() {
    // Enqueue the scripts when shortcode is used
    custom_map_enqueue_scripts();

    // The HTML for the form and map
    ob_start();
    ?>
    <div class="address-container">
        <form id="postcode-form">
            <div class="postcode-form-row">
                <label class="postcode-form-label" for="postcode">Enter City or Postal Code:</label>
                <input placeholder="AB15" type="text" id="postcode" />
                <input type="submit" value="Search" />
            </div>
        </form>

        <!-- Div where the map will be displayed -->
        <div id="map"></div>

        <!-- Div where the address list will be shown -->
        <div id="address-list"></div>
    </div>
    <?php
    return ob_get_clean();
}

// Register the shortcode [uk_schools_on_map]
add_shortcode('uk_schools_on_map', 'uk_schools_on_map_shortcode');

// Enqueue CSS for the map and form styling
function uk_schools_on_map_enqueue_styles() {
    wp_enqueue_style('custom-map-styles', plugin_dir_url(__FILE__) . 'styles.css');
}
add_action('wp_enqueue_scripts', 'uk_schools_on_map_enqueue_styles');

// Admin Settings Page for API Key
function uk_schools_on_map_register_settings() {
    add_option('uk_schools_on_map_api_key', '');
    register_setting('uk_schools_on_map_options_group', 'uk_schools_on_map_api_key', 'uk_schools_on_map_callback');
}
add_action('admin_init', 'uk_schools_on_map_register_settings');

// Add API Key field and information page just below the Settings menu
function uk_schools_on_map_register_options_page() {
    add_menu_page(
        'UK Schools on Map Settings', // Page title
        'UK Schools on Map',          // Menu title
        'manage_options',             // Capability
        'uk_schools_on_map',          // Menu slug
        'uk_schools_on_map_options_page', // Callback function
        'dashicons-location',         // Icon (optional)
        80                            // Position, 80 ensures it's just below "Settings"
    );
}
add_action('admin_menu', 'uk_schools_on_map_register_options_page');

// Display the options page
function uk_schools_on_map_options_page() {
?>
    <div>
        <h1>UK Schools on Map - Settings</h1>
        <p>Use this page to configure the Google Maps API key for displaying UK schools on a map.</p>
        <form method="post" action="options.php">
            <?php settings_fields('uk_schools_on_map_options_group'); ?>
            <table>
                <tr valign="top">
                    <th scope="row"><label for="uk_schools_on_map_api_key">Google Maps API Key</label></th>
                    <td><input type="text" id="uk_schools_on_map_api_key" name="uk_schools_on_map_api_key" value="<?php echo get_option('uk_schools_on_map_api_key'); ?>" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>

        <h2>Plugin Information</h2>
        <p>This plugin allows you to display a map of UK schools with a search form for cities or postal codes.</p>
        <h3>Shortcode</h3>
        <p>Use the shortcode <code>[uk_schools_on_map]</code> to embed the map and search form on any page or post.</p>
    </div>
<?php
}
