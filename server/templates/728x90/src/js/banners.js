// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// B A N N E R   V A R S
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// --- SET TOTAL #s OF DIVS NEEDED ----
var totalDivs = 200;

// --- CHOOSE ONE ----
var adType = "standard";
// var adType = "dynamic";

// --- CHOOSE ONE ----
var adPlatform = "DoubleClick";
// var adPlatform = "Sizmek";

// --- SET TO TRUE or FALSE ----
var dyanmicText = false;

// --- CHOOSE ONE ----
var fonts = ["NHG75"];
// var fonts = [ 'NHG75'];

// --- SHOW TOOLTIP BUTTONS ---
var showTooltipBtns = false;

// --- SET TOOLTIP PROPERTIES ---
var tooltip_position = [213, 155]; // [x, y]
var tooltip_dimensions = [46, 12]; // [w, h]

// JS FF / FEATURE SNIFFER
function ff_sniffer() {
  var ff_support;
  try {
    ff_support = CSS.supports("(-moz-appearance: none)");
    return ff_support;
  } catch (err) {
    ff_support = false;
    return ff_support;

  } finally {

  }
}



// ======================================================================================================
// F R A M E   C O N T E N T   D A T A
// ======================================================================================================

var colorArry = ["#000", "#fff", "#f6f6f6"];

// B A N N E R   1  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var ban_1_Txt = [""];

var ban_1_Imgs = ["../img/logo_white.svg", "../img/mainbg.jpg"];

// B A N N E R   2  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var ban_2_Txt = [];
var ban_2_Imgs = [];

// ======================================================================================================
// B A N N E R   T I M E L I N E S
// ======================================================================================================

function banner_1() {
  var logo_black = d191;
  var check_mark = d192;
  var width = 728;
  var height = 90;

  var timeline = new TimelineMax();
  var tDelay = 0;
  var wrapper = document.getElementById("wrapper");

  timeline
    // .call(overlay_img, [overlay, "../overlays/2.jpg", 0.5], null, tDelay)

    .set(wrapper, { backgroundColor: "#ffffff" }, tDelay -= 0.09)
    .call(static_img, [logo_black, "../img/logo_white.svg", 1, [75, 63], [1, 1], 0], null, tDelay)
    .set([logo_black], { className: "+= gpu" }, tDelay)
    .set(d190, {fontFamily: "Arial, sans-serif", x: 540, y: 72, textAlign: "left", zIndex: 999, opacity: 0.7})
    .call(text_reveal, [d190, "Humans depicted in this image are AI-generated", "NHG75", 8, "#FFFFFF", 0.6, ""], null, tDelay)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Add main image at tDelay + 0.3s
    .call(static_img, [d1, "../img/mainbg.jpg", 1, [width, height], 0], null, tDelay + 0.3)
    .call(static_img, [d6, "../img/silo.png", 1, null, [0, 0]], null)
    .set(d1, { width: width, height: height, scale: 2.12, x: -349, y: 36 }, tDelay + 0.3)
    // .set(d6, { x: -214, y: 18 }, tDelay + 0.3)
    .to([d1], 2.15, { width: width, height: height, scale: 1.19, x: 60, y: 8, ease: "0.42, 0, 0.58, 1", }, tDelay + 0.6)
    .to([d6], 2.15, { width: width, height: height, scale: 1.19, x: 60, y: 8, ease: "0.42, 0, 0.58, 1", }, "<-=2.15")

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    .call(text_reveal, [d2, "We unite tech and industry expertise", "NHG75", 14, "#FFFFFF", 0.6, ""], null, tDelay + 0.8)
    .set(d2, { x: 95, y: 16, opacity: 0, letterSpacing: "-0.3px" }, tDelay)
    .to(d2, 0.3, { x: 100, y: 11, opacity: 1, ease: "0.2, 0.83, 0.31, 1", }, tDelay + 1)

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .call(text_reveal, [d4, "so you can", "NHG75", 44, "#FFFFFF", 0.6, ""], null, tDelay + 1)
    .set(d4, { letterSpacing: "-1.5px" }, tDelay)
    .fromTo(d4, 0.9, { scale: 2, x: 0, y: 25, opacity: 0 }, { scale: 1, x: 99, y: 20, opacity: 1, ease: "0.42, 0, 0.58, 1" }, tDelay + 1.5)

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .call(() => { wrapper.classList.add("active"); }, null, null, tDelay + 1.5)
    .call(text_reveal, [d5, "outthink, outpace, and outperform", "NHG75", 14, "#FFFFFF", 0.6, ""], null, tDelay + 2.5)
    .set(d5, { x: 95, y: 70, opacity: 0, letterSpacing: "-0.17px" }, tDelay + 2.5)
    .to(d5, 0.3, { x: 100, y: 65, opacity: 1, ease: "0.2, 0.83, 0.31, 1", }, tDelay + 2.5)

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .call(static_img, [d8, "../img/cta.png", 1, [51, 42], [13, 62], 0], null, tDelay + 3.5)
    .set([d8], { className: "+= gpu" }, tDelay);

  // Log duration of timeline

}

function banner_2() {

}

// ======================================================================================================
// D A D   F A C E   F U N C T I O N S
// ======================================================================================================

// // FACE ANIMATIONS

// ======================================================================================================
// A N I M A T I O N   C O M P L E T E
// ======================================================================================================

function tooltipControlsON() {
  detailsTL = new TimelineMax();

  detailsTL.set(
    details_btn, {
    left: tooltip_position[0],
    top: tooltip_position[1],
    width: tooltip_dimensions[0],
    height: tooltip_dimensions[1],
    display: "block",
    autoAlpha: 1,
  },
    0
  );

  detailsTL.set(tooltip, {
    opacity: 0,
    display: "none"
  });

  if (showTooltipBtns) {
    detailsTL.call(debug, [details_btn, "red"]);
  }

  close_btn.addEventListener(
    "click",
    function () {

      detailsTL.set(this, {
        display: "none"
      });
      detailsTL.to(tooltip, 0.25, {
        autoAlpha: 0,
        display: "none"
      });
      detailsTL.set(details_btn, {
        display: "block"
      });
    },
    false
  );

  details_btn.addEventListener(
    "click",
    function () {

      detailsTL.set(close_btn, {
        display: "block"
      });
      detailsTL.to(tooltip, 0.25, {
        autoAlpha: 1,
        display: "block"
      });
      detailsTL.set(this, {
        display: "none"
      });
    },
    false
  );

  click_through.onmouseover = function () { };
  click_through.onmouseout = function () { };
}

/*

  ======================================================================================================
  ------------------------------------------------------------------------------------------------------
  F R A M E   M O D U L E S  -  D O C U M E N T A T I O N
  ------------------------------------------------------------------------------------------------------
  ======================================================================================================
  The documentation below lists all available preprogrammed modules. Each module has a description of what
  it does, a list of it's parameters, the code you will use to implement each module and additional notes
  if needed.

  To implement the selected module, copy the code that begins with ".call(".


  ======================================================================================================
  O V E R L A Y   I M A G E
  Description: Adds an overlay image you can use to help position elements in your ad.

  Params = [div, image, opacity]
  ------------------------------------------------------------------------------------------------------
  .call(overlay_img, [overlay, "../img/trace.png", 0.5], null, tDelay)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  S T A T I C   T E X T
  Description: Adds static text to your banner.

  Params = [div, text, text style, text size, text color, text position]
  ------------------------------------------------------------------------------------------------------
  .call(static_text, [d1, ban_1_Txt[0], "NHG75", 16, colorArry[0], "center"], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The text "position" parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

  ======================================================================================================
  S T A T I C   I M A G E
  Description: Adds an image to your banner.

  Params = [div, image, scale(enter 1 for 1x, 2 for 2x), dimensions, position]
  ------------------------------------------------------------------------------------------------------
  .call(static_img, [d1, ban_1_Imgs[0], 1, [300, 250], "center"], null, tDelay)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  T E X T   S L I D E   I N
  Description: Adds text to your banner, then animates it sliding in from the side you dictate.

  Params = [div, text, text style, text size, text position, text color, speed]
  ------------------------------------------------------------------------------------------------------
  .call(slide_in_text, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.6, "up"], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

  ======================================================================================================
  I M A G E   S L I D E   I N
  Description: Adds an image to your banner, then animates it sliding in from the side you dictate.

  Params = [div, image, scale(enter 1 for 1x, 2 for 2x), speed, slide direction, position]
  ------------------------------------------------------------------------------------------------------
  .call(slide_in_img, [d1, ban_1_Imgs[0], 1, "center", 0.6, "left"], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note:  The "position" is optional, but if entered, it must be an array of the following values [left, top].
        If ignored, the image will sit top left. Use this parameter for special imagery that's not full frame.

        The "slide direction" option can be one of 4 types, "up", "down", "left", or "right".

  ======================================================================================================
  T Y P E  W R I T E R   A N I M
  Description: Adds text to your banner, then animates it by typing it out letter by letter.

  Params = [div, text, text style, text size, text color, text position, speed]
  ------------------------------------------------------------------------------------------------------
  .call(typewriter, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.35], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The "text position" parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

  IMPORTANT NOTE:  Typing animation only works on one line. To animate multiple lines of typing, use two or more
                  calls to this frame module and adjust the vertical positioning of the text to create your text
                  block. Also, add a delay to your "tDelay" variable to animate one line at a time.

  ======================================================================================================
  W O R D  W R I T E R   A N I M
  Description: Adds text to your banner, then animates it by typing it out one word at a time.

  Params = [div, text, text style, text size, text color, text position, speed, delimiter]
  ------------------------------------------------------------------------------------------------------
  .call(wordwriter, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.35, " "], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The "text position" parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

  IMPORTANT NOTE:  Typing animation only works on one line. To animate multiple lines of typing, use two or more
                  calls to this frame module and adjust the vertical positioning of the text to create your text
                  block. Also, add a delay to your "tDelay" variable to animate one line at a time.

  ======================================================================================================
  T E X T   R E V E A L   A N I M
  Description: Adds text to your banner, then animates it in your chosen direction. Text animates in from
              outside a parent div of the same size as the text you've added.

  Params = [div, text, text style, text size, text color, text position, speed, direction]
  ------------------------------------------------------------------------------------------------------
  .call(text_reveal, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.5, "up"], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

  ======================================================================================================
  I M A G E   R E V E A L   A N I M
  Description: Adds an image to your banner, then animates it in your chosen direction. The image animates
              in from outside a parent div of the same size that is set in the dimensions property.

  Params = [div, image, scale, dimensions, position, speed, direction]
  ------------------------------------------------------------------------------------------------------
  .call(image_reveal, [d1, ban_1_Imgs[0], 1, [100, 100], [20, 20], 0.5, "up"], null, tDelay)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  T E X T   D I V   O P E N   A N I M
  Description: Adds text to your banner, then animates it in your chosen direction by expanding it's
  container div to reveal the text

  Params = [div, text, text style, text size, text color, text position, speed, direction]
  ------------------------------------------------------------------------------------------------------
  .call(text_div_open, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.5, "up"], null, tDelay)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  R E V E R S E   R E V E A L   A N I M
  Description:  This module will reverse reveal any object that has ben created using the Text Reveal,
  Image Reveal, and Animated Check Mark modules.

  Params = [div, image, direction]
  ------------------------------------------------------------------------------------------------------
  .call(reverse_reveal, [d1, 0.5, "left"], null, tDelay)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  T E X T   Z O O M   A N I M
  Description: Adds text to your banner, then animates it in from your chosen scale. Text fades in as it animates.

  Params = [div, text, text style, text size, text color, text position, speed, starting scale]
  ------------------------------------------------------------------------------------------------------
  .call(text_zoom, [d1, ban_1_Txt[0], "NHG75", 90, colorArry[0], "center", 0.35, 0], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The "text position" parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

        The "starting scale" parameter dictates the starting scale of your text. To scale up, make the value
        less than 1, to scale down, make the value greater than one. The text always fades in during the animation.



  ======================================================================================================
  C L I P P E D   T E X T
  Description: Adds text to your banner, and allows you to modify its parent div so only part of the text
              is showing.
  Params = [div, text, text style, text size, text color, text position, speed, direction, cut distance, move distance]
  ------------------------------------------------------------------------------------------------------
  .call(clip_text_anim, [d1, ban_1_Txt[0], "NHG75", 82, colorArry[1], "center", 1.5, "LR", 39, 40], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
          to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].


  ======================================================================================================
  S P R I T E   A N I M
  Description: Animates a film strip style sprite sheet. Sprites can be animated both forward and backward and
              in a horizontal and vertical aspect ratio.

  Params = [div, image, length / height of sprite, position[x, y], window[w, h], speed, frames, play direction, sprite aspect ratio]
  ------------------------------------------------------------------------------------------------------
  .call(sprite_anim, [d1, ban_1_Imgs[0], 19200, [0, 0], [300, 250], 1.5, 64, "reverse", "horizontal"], null, tDelay)
  ------------------------------------------------------------------------------------------------------
  Note: The "length / height of sprite" parameter should be the longest side of the sprite sheet image you are trying to animate
  The "window" parameter is the visible area of the animation. It's best to make this the width and height of a single frame of your sprite
  The "play direction" parameter is to choose wether the sprite plays forward or backward
  The "sprite aspect ratio" parameter is used to dictate the aspect ratio of your sprite, vertical or horizontal.

  ======================================================================================================
  A D D   A N I M A T E D   C H E C K   M A R K   L O G O
  Description:  Adds logo check mark and animates it in as if it's being drawn in.

  Params = [div, image dimensions [w, h], position [x, y], speed]
  ------------------------------------------------------------------------------------------------------
  .call(logo_check, [d1, [24, 30], [15, 205], 0.5], null, tDelay)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  A U T O   L E G A L   T O O L T I P
  ======================================================================================================
  Description:  Adds a smart legal tooltip to your banner.

  Params = [tooltip, image, legal text, text style, text size, dimensions [w, h]], position [x, y], arrow on, arrow position, buffer array [x, y], arrow position offset]
  ------------------------------------------------------------------------------------------------------
  .call(auto_tooltip, [tooltip, ban_1_Txt[8], "NHG55ROMEN", 8, [130, 82], [50, 167], true, "top", "left", [0, 0], 0], null, tDelay)
  ------------------------------------------------------------------------------------------------------




  ======================================================================================================
  ------------------------------------------------------------------------------------------------------
  H E L P E R   C O D E  -  D O C U M E N T A T I O N
  ------------------------------------------------------------------------------------------------------
  ======================================================================================================

  ======================================================================================================
  B A C K G R O U N D   C O L O R   S W A P S
  Description: Use the following line of code to swap the color of the background.

  ------------------------------------------------------------------------------------------------------
  .set(wrapper, {backgroundColor:colorArry[0]})
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  T U R N   O F F   D I V S   A T   E N D   O F   F R A M E
  Description: Use the following line of code to turn off the chosen divs before the next frame. Use the
               delay setting to dictate the length of the frame.

  ------------------------------------------------------------------------------------------------------
  .set(d1, {display:"none"}, tDelay+=1.3)
  ------------------------------------------------------------------------------------------------------

  Additional: Use an array to turn off multiple divs at once.
  ------------------------------------------------------------------------------------------------------
  .set([d1, d2, d3], {display:"none"}, tDelay+=1.3)
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  S E E   T O O L T I P   B U T T O N S
  Description: To see the hotspot to activate and close the tooltip, change the variable "showTooltipBtns"
               listed below to TRUE, then replay the banner. This will put a red border around the tooltip
               open button and a blue border around the tooltip close button. Once satisfied with the
               positioning and sizing of the tooltip buttons, change the variable "showTooltipBtns" back
               to FALSE.

  ------------------------------------------------------------------------------------------------------
  var showTooltipBtns = false;
  ------------------------------------------------------------------------------------------------------

  ======================================================================================================
  S E T   T O O L T I P   B U T T O N  P R O P E R T I E S
  Description: To set the size and position of the tooltip open button, modify the following
               variables listed above.

  ------------------------------------------------------------------------------------------------------
  // --- SET TOOLTIP PROPERTIES ---
  var tooltip_position    = [13, 157];  // [x, y]
  var tooltip_dimensions  = [78, 12];   // [w, h]
  ------------------------------------------------------------------------------------------------------

// ======================================================================================================
// D E B U G
// Description: Adds colored border to the selected div. Color can be chosen by the user.

// Params = [div, color]
// ------------------------------------------------------------------------------------------------------
// .call(debug, [d2, "red"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: The color parameter can be simple colors such as "red", "blue", "green" etc.. or you can use a
//       hex value to set the desired color.

*/
