var width;
var height;
var rTxtNum = 1;
var wsTxtNum = 1;
var rStatImgNum = 1;
var rImgNum = 1;
var rSpriteNum = 1;
var scrlData = [];
var cTxtTopNum = 1;
var cTxtBotNum = 1;

function setModuleProps(w, h) {
  width = w;
  height = h;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - F R A M E   M O D U L E S - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// ======================================================================================================
// D E B U G
// ======================================================================================================
// Description: Adds colored border to the selected div. Color can be chosen by the user. 
// ------------------------------------------------------------------------------------------------------
// Params = [div, color]
// .call(debug, [d2, "red"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: The color parameter can be simple colors such as "red", "blue", "green" etc.. or you can use a 
//       hex value to set the desired color.

function debug(div, colr) {
  var dg = new TimelineMax();
  dg.set(div, {borderStyle:"solid", borderWidth:1, borderColor:colr}, 0);
}

// ======================================================================================================
// O V E R L A Y   I M A G E
// ======================================================================================================
// Description: Adds an overlay image you can use to help position elements in your ad.
// ------------------------------------------------------------------------------------------------------
// Params = [div, image, opacity]
// .call(overlay_img, [overlay, "../img/trace.png", 0.5], null, tDelay)
// ------------------------------------------------------------------------------------------------------

function overlay_img(div, img, opac) {
  var si = new TimelineMax();
  div.innerHTML = "<img src=" + img + "></img>"

  // Set Props
  si.set(div, {opacity:opac, display:"block"}, 0);

}

// ======================================================================================================
// S T A T I C   T E X T
// ======================================================================================================
// Description: Adds static text to your banner.
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position]
// .call(static_text, [d1, ban_1_Txt[0], "NHG75", 16, colorArry[0], "center"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The text "position" parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

function static_text(div, val, styl, size, colr, pos) {
    var st = new TimelineMax();
    st.set(div, {className:("+=" + styl)}, 0);
    st.set(div, {fontSize:size}, 0);
    st.set(div, {overflow:"hidden"}, 0);


    div.innerHTML = val;
    align_text(div, pos);

    // Set text color
    st.set(div, {color:colr});
}

// ======================================================================================================
// S T A T I C   I M A G E
// ======================================================================================================
// Description: Adds an image to your banner.
// ------------------------------------------------------------------------------------------------------
// Params = [div, image, scale(enter 1 for 1x, 2 for 2x), dimensions, position]
// .call(static_img, [d1, ban_1_Imgs[0], 1, [300, 250], "center"], null, tDelay)
// ------------------------------------------------------------------------------------------------------

function static_img(div, img, scl, dim, pos) {
  var si = new TimelineMax();
  si.set(div, {overflow:"hidden"}, 0);

  var imgDiv = "<div id='staticImg" + rStatImgNum + "'><img src=" + img + "></div></div>";
  div.innerHTML = imgDiv;
  // div.innerHTML = "<img src=" + img + "></div>";

  var rImg = eval("staticImg" + rStatImgNum);
  rStatImgNum++;

  // Set scale if 2x
  if(scl === 2) {
    si.set(rImg, {scale:0.5, transformOrigin:"left top"}, 0);
    // si.set(div, {scale:0.5, transformOrigin:"left top"}, 0);
  }

  // Set position
  if(pos === "center") {
    si.set(div, {left:0, top:0}, 0);
  } else {
    si.set(div, {left:pos[0], top:pos[1]}, 0);
  }

  // Set dimensions
  if(dim != null) {
    si.set([div], {width:dim[0], height:dim[1]});
  }

  // Animate
  si.set(div, {display:"block"}, 0);

}

// ======================================================================================================
// T E X T   S L I D E   I N
// ======================================================================================================
// Description: Adds text to your banner, then animates it sliding in from the side you dictate.
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text position, text color, speed]
// .call(slide_in_text, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.6, "up"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

function slide_in_text(div, val, styl, size, colr, pos, speed, dir) {
  var ts = new TimelineMax();
  ts.set(div, {className:("+=" + styl)}, 0);
  ts.set(div, {className:("+=gpu")}, 0);
  ts.set(div, {fontSize:size}, 0);
  var startPos = 0;

  if(dir === "left") {
    startPos = -width - 5;
  } else if(dir === "right") {
    startPos = width + 5;
  } else if(dir === "up") {
    startPos = height + 5;
  } else if(dir === "down") {
    startPos = -height - 5;
  }

  div.innerHTML = val;
  align_text(div, pos);

  // Set text color
  ts.set(div, {color:colr});

  // Animate
  if(dir === "left" || dir === "right") {
  ts.set(div, {display:"block"}, 0)
    ts.from(div, speed, {x:startPos, ease:Power3.easeOut}, 0);
  } else if(dir === "up" || dir === "down") {
    ts.from(div, speed, {y:startPos, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// I M A G E   S L I D E   I N
// ======================================================================================================
// Description: Adds an image to your banner, then animates it sliding in from the side you dictate.
// ------------------------------------------------------------------------------------------------------
// Params = [div, image, scale(enter 1 for 1x, 2 for 2x), speed, slide direction, position]
// .call(slide_in_img, [d1, ban_1_Imgs[0], 1, "center", 0.6, "left"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note:  The "position" is optional, but if entered, it must be an array of the following values [left, top].
//        If ignored, the image will sit top left. Use this paremeter for special imagry that's not full frame.
//
//        The "slide direction" option can be one of 4 types, "up", "down", "left", or "right".

function slide_in_img(div, img, scl, pos, speed, dir) {
  var sli = new TimelineMax();
  var startPos = 0;

  if(dir === "left") {
    startPos = -width - 5;
  } else if(dir === "right") {
    startPos = width + 5;
  } else if(dir === "up") {
    startPos = height + 5;
  } else if(dir === "down") {
    startPos = -height - 5;
  }

  if(pos === "center") {
    sli.set(div, {left:0, top:0}, 0);
  } else {
    sli.set(div, {left:pos[0], top:pos[1]}, 0);
  }

  if(scl === 2) {
    sli.set(div, {className:("+=abs-pos-retina")}, 0);
    // add background image
    sli.set(div, {scale:0.5, transformOrigin:"left top", backgroundImage:'url(' + img + ')'});
  } else {
    // add background image
    sli.set(div, {width:width, height:height, backgroundImage:'url(' + img + ')'});
  }

  // Animate
  if(dir === "left" || dir === "right") {
    sli.set(div, {display:"block"}, 0)
    sli.from(div, speed, {x:startPos, ease:Power3.easeOut}, 0);
  } else if(dir === "up" || dir === "down") {
    sli.from(div, speed, {y:startPos, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// T Y P E  W R I T E R   A N I M
// ======================================================================================================
// Description: Adds text to your banner, then animates it by typing it out letter by letter. 
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position, speed]
// .call(typewriter, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.35], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The "text position" parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].
// 
// IMPORTANT NOTE:  Typing animation only works on one line. To animate multiple lines of typing, use two or more 
//                  calls to this frame module and adjust the vertical posiitioning of the text to create your text 
//                 block. Also, add a delay to your "tDelay" variable to animate one line at a time.

function typewriter(div, val, styl, size, colr, pos, speed) {
  var tw = new TimelineMax();
  tw.set(div, {className:("+=" + styl)}, 0);
  tw.set(div, {fontSize:size}, 0);

  div.innerHTML = val;
  align_text(div, pos);

  // Set text color
  tw.set(div, {color:colr});

  var txtBase = val.substr(0, 1);

  val = String(val);

  tw.set(div, {innerHTML:txtBase}, 0)
    .to(div, speed, {text:val, ease:Linear.easeNone});
}

// ======================================================================================================
// W O R D  W R I T E R   A N I M
// ======================================================================================================
// Description: Adds text to your banner, then animates it by typing it out one word at a time. 
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position, speed, delimiter]
// .call(wordwriter, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.35, " "], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The "text position" parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].
// 
// IMPORTANT NOTE:  Typing animation only works on one line. To animate multiple lines of typing, use two or more 
//                  calls to this frame module and adjust the vertical posiitioning of the text to create your text 
//                 block. Also, add a delay to your "tDelay" variable to animate one line at a time.

function wordwriter(div, val, styl, size, colr, pos, speed, del) {
  var ww = new TimelineMax();
  ww.set(div, {className:("+=" + styl)}, 0);
  ww.set(div, {fontSize:size}, 0);

  div.innerHTML = val;
  align_text(div, pos);

  // Set text color
  ww.set(div, {color:colr});

  // NOTE: This takes care of text where ther first word has a "-" in it
  var txtBase;
  if(val.indexOf("-") !== -1) {
    txtBase = val.slice(0, val.indexOf("-"));
  } else {
    txtBase = val.slice(0, val.indexOf(del));
  }

  ww.set(div, {innerHTML:txtBase}, 0)
    .to(div, speed, {autoAlpha:1, text:{value:val,  delimiter:del}, ease:Linear.easeNone});
}

// ======================================================================================================
// T E X T   R E V E A L   A N I M
// ======================================================================================================
// Description: Adds text to your banner, then animates it in your chosen direction. Text animates in from 
//              outside a parent div of the same size as the text you've added.
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position, speed, direction]
// .call(text_reveal, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.35, "up"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

function renderTextReveal(div, val, pos) {
  div._textRevealValue = String(val);

  // Create new div for text
  var txtDiv = "<div id='revealTxt" + rTxtNum + "' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  div.innerHTML = txtDiv;

  var rTxt = eval("revealTxt" + rTxtNum);
  rTxtNum++;

  var txtW = rTxt.clientWidth + 3;
  var txtH = rTxt.clientHeight + 3;
  
  // Set widht and height of div then set alignment
  TweenMax.set(div, {width:(Number(txtW) + 3), height:(Number(txtH) + 1)});
  align_text(div, pos);

  return {txt: rTxt, txtW: txtW, txtH: txtH};
}

function updateTextReveal(div, val, pos) {
  if(typeof div === "string") {
    div = document.getElementById(div) || document.querySelector("." + div);
  }

  if(!div) {
    return false;
  }

  if(pos === undefined && div._textRevealPos === undefined) {
    div.textContent = val;
    div._textRevealValue = String(val);
    return true;
  }

  if(div._textRevealValue === String(val)) {
    return true;
  }

  if(pos === undefined) {
    pos = div._textRevealPos;
  }

  renderTextReveal(div, val, pos);
  return true;
}

window.updateTextReveal = updateTextReveal;

function text_reveal(div, val, styl, size, colr, pos, speed, dir) {
  var tr = new TimelineMax();
  tr.set(div, {className:("+=" + styl)}, 0);
  tr.set(div, {fontSize:size}, 0);
  tr.set(div, {overflow:"hidden"}, 0);
  div._textRevealPos = pos;

  var reveal = renderTextReveal(div, val, pos);
  var rTxt = reveal.txt;
  var txtW = reveal.txtW;
  var txtH = reveal.txtH;

  // Set text color
  tr.set(div, {color:colr});

  // Set direction text moves
  if(dir === "up") {
    txtW = txtH;
  } else if(dir === "down") {
    txtW = -txtH;
  } else if(dir === "left") {
    txtH = txtW;
  } else if(dir === "right") {
    txtH = -txtW;
  }

  // Animation
  tr.set(div, {display:"block"}, 0);
  // tr.set(rTxt, {className:("+=gpu")}, 0);

  if(dir === "up" || dir === "down") {
    tr.from(rTxt, speed, {y:txtW, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }

  if(dir === "left" || dir === "right") {
    tr.from(rTxt, speed, {x:txtH, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// I M A G E   R E V E A L   A N I M
// ======================================================================================================
// Description: Adds an image to your banner, then animates it in your chosen direction. The image animates 
//              in from outside a parent div of the same size that is set in the dimensions property.
// ------------------------------------------------------------------------------------------------------
// Params = [div, image, scale, dimensions, position, speed, direction]
// .call(image_reveal, [d1, ban_1_Imgs[0], 1, [100, 100], [20, 20], 0.35, "up"], null, tDelay)
// ------------------------------------------------------------------------------------------------------

function image_reveal(div, img, scl, dim, pos, speed, dir) {
  var ir = new TimelineMax();
  // ir.set(div, {className:("+=gpu")}, 0);
  ir.set(div, {overflow:"hidden"}, 0);

  var imgDiv = "<div id='revealImg" + rImgNum + "'><img src=" + img + "></div></div>";
  div.innerHTML = imgDiv;

  var rImg = eval("revealImg" + rImgNum);
  rImgNum++;

  // Set position
  ir.set(div, {left:pos[0], top:pos[1]}, 0);

  // Set scale if 2x
  if(scl === 2) {
    ir.set(rImg, {scale:0.5, transformOrigin:"left top"}, 0);
  }

  // Set dimensions
  if(dim != null) {
    ir.set([div], {width:dim[0], height:dim[1]});
  }

  // Animate
  ir.set(div, {display:"block"}, 0);

  // Set direction text moves
  if(dir === "up") {
    imgX = dim[1];
  } else if(dir === "down") {
    imgX = -dim[1];
  } else if(dir === "left") {
    imgY = dim[0];
  } else if(dir === "right") {
    imgY = -dim[0];
  }

  // // Animation
  if(dir === "up" || dir === "down") {
    ir.from(rImg, speed, {y:imgX, ease:Power3.easeOut}, 0);
  }

  if(dir === "left" || dir === "right") {
    ir.from(rImg, speed, {x:imgY, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// T E X T   D I V   O P E N   A N I M
// ======================================================================================================
// Description: Adds text to your banner, then animates it in your chosen direction by expanding it's 
//              container div to reveal the text
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position, speed, direction]
// .call(text_div_open, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", 0.35, "up"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

function text_div_open(div, val, styl, size, colr, pos, speed, dir) {
  var tr = new TimelineMax();
  tr.set(div, {className:("+=" + styl)}, 0);
  tr.set(div, {fontSize:size}, 0);
  tr.set(div, {overflow:"hidden"}, 0);

  // Create new div for text
  var txtDiv = "<div id='revealTxt" + rTxtNum + "' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  div.innerHTML = txtDiv;

  var rTxt = eval("revealTxt" + rTxtNum);
  rTxtNum++;

  var txtW = rTxt.clientWidth + 3;
  var txtH = rTxt.clientHeight + 3;
  
  // Set widht and height of div then set alignment
  tr.set(div, {width:(Number(txtW) + 3), height:(Number(txtH) + 1)}, 0);
  align_text(div, pos);

  // Set text color
  tr.set(div, {color:colr});

  // Set direction text moves
  if(dir === "up") {
    txtW = txtW;
  } else if(dir === "down") {
    txtW = -txtW;
  } else if(dir === "left") {
    txtH = txtH;
  } else if(dir === "right") {
    txtH = -txtH;
  }

  // Animation
  tr.set(div, {display:"block"}, 0);
  // tr.set(rTxt, {className:("+=gpu")}, 0);

  if(dir === "down") {
    tr.from(div, speed, {height:0, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }
  
  if(dir === "up") {
    tr.from(div, speed, {y:txtH, height:0, z:-100, force3D:false, ease:Power3.easeOut}, 0);
    tr.from(rTxt, speed, {y:-txtH, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }

  if(dir === "left") {
    tr.from(div, speed, {x:txtW, width:0, z:-100, force3D:false, ease:Power3.easeOut}, 0);
    tr.from(rTxt, speed, {x:-txtW, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }

  if(dir === "right") {
    tr.from(div, speed, {width:0, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// T E X T   Z O O M   A N I M
// ======================================================================================================
// Description: Adds text to your banner, then animates it in from your chosen scale. Text fades in as it animates.
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position, speed, starting scale, starting opacity]
// .call(text_zoom, [d1, ban_1_Txt[0], "NHG75", 90, colorArry[0], "center", 0.35, 0, 0], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The "text position" parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].
//
//        The "starting scale" parameter dictates the starting scale of your text. To scale up, make the value 
//        less than 1, to scale down, make the value greater than one. The text always fades in during the animation.*

function text_zoom(div, val, styl, size, colr, pos, speed, scale, opac) {
  var btz = new TimelineMax();
  btz.set(div, {className:("+=" + styl)}, 0);
  btz.set(div, {fontSize:size}, 0);
  // btz.set(div, {className:("+=gpu")}, 0);

  div.innerHTML = val;
  align_text(div, pos);

  // Set text color
  btz.set(div, {color:colr});

  btz.set(div, {display:"block"}, 0)
     .from(div, speed, {scale:scale, autoAlpha:opac, force3D:false, ease:Power3.easeOut}, 0)
     // .set(div, {className:"-=gpu"}, 0.55)
     ;

}

// ======================================================================================================
// C L I P P E D   T E X T
// ======================================================================================================
// Description: Adds text to your banner, and allows you to modify its parent div so only part of the text
//              is showing.
// ------------------------------------------------------------------------------------------------------
// Params = [div, text, text style, text size, text color, text position, speed, direction]
// .call(clip_text, [d1, ban_1_Txt[0], "NHG75", 26, colorArry[0], "center", "top", 10], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: 	The text position parameter can be set to "center" to center text both horizontally and vertically,
// 				to set custom x and y positions for the text use an array such as [10, 100], or [10, "center"].

function clip_text_anim(div, val, styl, size, colr, pos, speed, dir, cut, dist) {
  var ct = new TimelineMax();
  ct.set(div, {className:("+=" + styl)}, 0);
  ct.set(div, {fontSize:size}, 0);

  // Create new div for text
  var txtDiv1Holder = "<div id='clipTxt" + cTxtTopNum + "HolderTop' style='position: absolute; overflow:hidden'></div>";
  var txtDiv1 = "<div id='clipTxtTop" + cTxtTopNum + "' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  div.innerHTML = txtDiv1Holder;
  var cTxtHolderTop = eval("clipTxt" + cTxtTopNum + "HolderTop");
  cTxtHolderTop.innerHTML = txtDiv1;
  var cTxtTop = eval("clipTxtTop" + cTxtTopNum);
  var cTxtTopW = eval("clipTxtTop" + cTxtTopNum).clientWidth;
  var cTxtTopH = eval("clipTxtTop" + cTxtTopNum).clientHeight;
  ct.set(cTxtHolderTop, {width:cTxtTopW + 3, height:cTxtTopH + 1}, 0);

  // Create new div for text
  var txtDiv2Holder = "<div id='clipTxt" + cTxtBotNum + "HolderBot' style='position: absolute; overflow:hidden'></div>";
  var txtDiv2 = "<div id='clipTxtBot" + cTxtBotNum + "' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  div.innerHTML+= txtDiv2Holder;
  var cTxtHolderBot = eval("clipTxt" + cTxtBotNum + "HolderBot");
  cTxtHolderBot.innerHTML = txtDiv2;
  var cTxtBot = eval("clipTxtBot" + cTxtBotNum);
  ct.set(cTxtBot, {y:-(cTxtTopH - cut)}, 0);
  
  // // Set widht and height of div then set alignment
  ct.set(div, {width:cTxtTopW + 3, height:cTxtTopH + 1}, 0);
  align_text(div, pos);

  // Set text color
  ct.set(div, {color:colr});
  
  var cTxtHolderTop = eval("clipTxt" + cTxtTopNum + "HolderTop");
  var cTxtHolderTop = eval("clipTxt" + cTxtTopNum + "HolderTop");

  ct.set(cTxtHolderTop, {height:(cTxtTopH - (cut - 1))}, 0);
  ct.set(cTxtHolderBot, {width:cTxtTopW + 3, height:cTxtTopH + 1}, 0);
  ct.set(cTxtHolderBot, {y:(cTxtTopH - cut), height:(cTxtTopH - (cTxtTopH - cut))}, 0);
  // Set text and enclosing dicv properties
  if(dir == "LR") {
    ct.from(cTxtHolderTop, speed, {x:-dist, ease:Power3.easeOut}, 0);
    ct.from(cTxtHolderBot, speed, {x:dist, ease:Power3.easeOut}, 0);
  } else {
    ct.from(cTxtHolderTop, speed, {x:dist, ease:Power3.easeOut}, 0);
    ct.from(cTxtHolderBot, speed, {x:-dist, ease:Power3.easeOut}, 0);
  }

  cTxtTopNum++;
  cTxtBotNum++;

}

// ==================================================================================================================================================================================================================================================================================================================
// ======================================================================================================
// W I N D O W   S H A D E   T E X T   A N I M
// ======================================================================================================

function window_shade(div, val, styl, size, colr, pos, speed, dir) {
  var tr = new TimelineMax();
  tr.set(div, {className:("+=" + styl)}, 0);
  tr.set(div, {fontSize:size}, 0);
  tr.set(div, {overflow:"hidden"}, 0);

  // Create new div for text
  var txtDiv1 = "<div id='wShadeTxt" + wsTxtNum + "' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  div.innerHTML = txtDiv1;
  var wsTxt1 = eval("wShadeTxt" + wsTxtNum);
  wsTxtNum++;

  var txtDiv2 = "<div id='wShadeTxt" + wsTxtNum + "' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  div.innerHTML+= txtDiv2;
  var wsTxt2 = eval("wShadeTxt" + wsTxtNum);
  wsTxtNum++;

  // var txtDiv3 = "<div id='wShadeTxt" + wsTxtNum + "_3' style='position: absolute;  white-space: nowrap;'><p>" + val + "</p></div>";
  // div.innerHTML+= txtDiv3;
  // var wsTxt3 = eval("wShadeTxt" + wsTxtNum + "_3");
  // wsTxtNum++;











  var txtW = wsTxt2.clientWidth + 3;
  var txtH = wsTxt2.clientHeight + 3;



  
  
  // Set widht and height of div then set alignment
  tr.set(div, {width:(Number(txtW) + 3), height:(Number(txtH) + 1)}, 0);
  align_text(div, pos);

  // Set text color
  tr.set(div, {color:colr});

  // Set direction text moves
  if(dir === "up") {
    txtW = txtW;
  } else if(dir === "down") {
    txtW = -txtW;
  } else if(dir === "left") {
    txtH = txtH;
  } else if(dir === "right") {
    txtH = -txtH;
  }

  // Animation
  tr.set(div, {display:"block"}, 0);
  // tr.set(rTxt, {className:("+=gpu")}, 0);



  

  if(dir === "up" || dir === "down") {
    tr.staggerFrom([wShadeTxt1, wShadeTxt2], speed, {y:txtW, z:-100, force3D:false, ease:Power3.easeOut}, 0.15, 0);
  }

  if(dir === "left" || dir === "right") {
    tr.from(wsTxt1, speed, {x:txtH, z:-100, force3D:false, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// S P R I T E   A N I M
// ======================================================================================================
// Description: Animates a film strip style sprite sheet. Sprites can be animated both forward and backward and 
//              in a horizontal and vertical aspect ratio.
// ------------------------------------------------------------------------------------------------------
// Params = [div, image, length / height of sprite, position[x, y], window[w, h], speed, frames, play direction, sprite aspect ratio]
// .call(sprite_anim, [d1, ban_1_Imgs[0], 19200, [0, 0], [300, 250], 1.5, 64, "reverse", "horizontal"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// Note: The "length / height of sprite" parameter should be the longest side of the sprite sheet image you are trying to animate
// The "window" parameter is the visable area of the animation. It's best to make this the width and height of a single frame of your sprite
// The "play direction" parameter is to choose wether the sprite plays forward or backward
// The "sprite aspect ratio" parameter is used to dictate the aspect ratio of your sprite

function sprite_anim(div, img, imgSize, pos, dim, speed, frames, dir, aspect) {
  var sa = new TimelineMax();
  sa.set(div, {overflow:"hidden"}, 0);
  sa.set(div, {left:pos[0], top:pos[1], width:(dim[0] - 1), height:(dim[1] - 1)})

  // Create new div for sprite img
  var imgDiv = "<img id='spriteAnim" + rSpriteNum + "' src=" + img + "></div>";
  div.innerHTML = imgDiv;
  
  var rSprite = eval("spriteAnim" + rSpriteNum);
  rSpriteNum++;
  

  if(aspect === "horizontal") {

    if(dir === "forward") {

      // Set dist and frame vars
      var moveDist = (imgSize - dim[0]);
      var framesMove = frames - 1;

      // Anim
      sa.to(rSprite, speed, {x:-moveDist, ease:SteppedEase.config(framesMove)});

    } else {

      // Set dist and frame vars
      var moveDist = (imgSize - dim[0]);
      var framesMove = frames - 1;
      
      // Anim
      sa.set(rSprite, {x:-moveDist});
      sa.to(rSprite, speed, {x:0, ease:SteppedEase.config(framesMove)});

    }

  } else {

    if(dir === "forward") {

      // Set dist and frame vars
      var moveDist = (imgSize - dim[1]);
      var framesMove = frames - 1;

      // Anim
      sa.to(rSprite, speed, {y:-moveDist, ease:SteppedEase.config(framesMove)});

    } else {

      // Set dist and frame vars
      var moveDist = (imgSize - dim[1]);
      var framesMove = frames - 1;
      
      // Anim
      sa.set(rSprite, {y:-moveDist});
      sa.to(rSprite, speed, {y:0, ease:SteppedEase.config(framesMove)});

    }

  }
  
}

// ======================================================================================================
// A D D   A N I M A T E D   C H E C K   M A R K   L O G O
// ======================================================================================================
// Description:  Adds Verizon logo check mark and animates it in as if it's being drawn in. 
// ------------------------------------------------------------------------------------------------------
// Params = [div, image dimensions [w, h], position [x, y], speed]
// .call(logo_check, [d1, [24, 30], [15, 205], 0.5], null, tDelay)
// ------------------------------------------------------------------------------------------------------

function logo_check(div, dim, pos, speed) {
  var cml = new TimelineMax();
  cml.set(div, {overflow:"hidden"}, 0);
  
  var origW = 24;
  var origH = 30;
  var img = "<svg id='check'><defs><style>.cls-1 {fill: #EE0000; fill-rule: evenodd;}</style></defs><polygon id='Fill-1-Copy' class='cls-1' points='19.56 0 8.61 24.17 4.47 15 0 15 6.79 30 10.41 30 24 0 19.56 0'/></svg>";
 
  // Create check mark objs
  var checkLeft = "<div id='check_left' style='position:absolute; overflow:hidden; backgroundSize:contain;'>" + img + "</div>";
  var checkRight = "<div id='check_right' style='position:absolute; overflow:hidden; backgroundSize:contain;'></div>";
  var checkRightMark = "<div id='check_right_mark' style='position:absolute; overflow:hidden; backgroundSize:contain;'>" + img + "</div>";

  // Add check mark parts to main div
  div.innerHTML = checkLeft;
  div.innerHTML += checkRight;
  check_right.innerHTML += checkRightMark;
  
  // debug(check_left, "blue")
  // debug(check_right, "red")
  // debug(div, "green")

  // Set vars
  var leftSize = origW * 0.33;
  var heightSize = origW * 1.25;
  var newScale;

  if(dim[0] != origW) {
    newScale = dim[0] / origW;
  } else {
    newScale = 1.01; // Strange Chrome bug fix
  }
  
  // Set DIV props
  cml.set(check_left, {width:leftSize, height:heightSize}, 0);
  cml.set([check_right, check_right_mark], {width:origW, height:heightSize}, 0);
  cml.set(div, {display:"block", left:pos[0], top:pos[1], width:origW, height:origH}, 0);
  cml.set(div, {scale:newScale, transformOrigin:"top left", }, 0);

  // Animation
  cml.from(check_left, speed, {height:0}, speed);
  cml.from(check_right, speed, {y:heightSize, force3D:false, ease:Strong.easeOut}, speed+speed);
  cml.from(check_right_mark, speed, {y:-heightSize, force3D:false, ease:Strong.easeOut}, speed+speed);
}

// ======================================================================================================
// R E V E R S E   R E V E A L   A N I M A T I O N 
// ======================================================================================================
// Description:  This module will reverse reveal any object that has ben created using the Text Reveal, Image Reveal, and Animated Check Mark modules. 
// ------------------------------------------------------------------------------------------------------
// Params = [div, image, direction]
// .call(reverse_reveal, [d1, 0.5, "left"], null, tDelay)
// ------------------------------------------------------------------------------------------------------
// The "direction" option can be one of 4 types, "up", "down", "left", or "right".

function reverse_reveal(div, speed, dir) {
  var cmo = new TimelineMax();
  var chkParts = div.childNodes;

  var dWidth = div.clientWidth;
  var dHeight = div.clientHeight;

  var posX;
  var posY;
  
  // Set direction text moves
  if(dir === "up") {
    // posY = -dim[1];
    posY = -(dHeight + 1);
  } else if(dir === "down") {
    // posY = dim[1];
    posY = (dHeight + 1);
  } else if(dir === "left") {
    // posX = -dim[0];
    posX = -(dWidth + 1);
  } else if(dir === "right") {
    // posX = dim[0];
    posX = (dWidth + 1);
  }

  // // Animation
  if(dir === "up" || dir === "down") {
    cmo.to(chkParts, speed, {y:posY, ease:Power3.easeOut}, 0);
  }

  if(dir === "left" || dir === "right") {
    cmo.to(chkParts, speed, {x:posX, ease:Power3.easeOut}, 0);
  }

}

// ======================================================================================================
// C R E A T E   S C R O L L I N G   L E G A L   T O O L T I P
// ======================================================================================================
// Description:  Adds a scrolling legal tooltip to your banner. 
// ------------------------------------------------------------------------------------------------------
// Params = [tooltip, image, legal text, text style, text size, dimensions [w, h]], position [x, y], arrow on, arrow position, buffer array [x, y], arrow position offset]
// .call(auto_tooltip, [tooltip, ban_1_Txt[8], "NHG55ROMEN", 8, true, [141, 104], [140, 140], "bottom", [0, 0], 0], null, tDelay)
// ------------------------------------------------------------------------------------------------------
function auto_tooltip(div, txt, styl, size, dim, pos, arwOn, arwPos, arwPos2, offset, arrowOffset) {
  var stp = new TimelineMax();
  stp.set(div, {className:("+=" + styl)}, 0);
  stp.set(div, {fontSize:size}, 0);
  stp.set(div, {display:"block"});

  // debug(div, "blue");

  // ------------------------------------------------------------------------------------------------------
  // Spacing Vars
  var txtLeftSpacing = 10,
      txtRightSpacing = 10,
      txtTopSpacing = 10,
      txtBotSpacing = 10,
      scrlLeftSpacing = 10,
      scrlRightSpacing = 11,
      scrlTopSpacing = 5;

  // Arrow Vars
  var arrwTop = 0,
      arrwLeft = 0,
      arrwDims = 8,
      arrwSize = 6, // How far the arrow graphics sticks out past the main tooltip
      arrwRotate = 0;

  // Active Buffer Vars
  var topBuff = 0,
      leftBuff = 0,
      rightBuff = 0,
      bottomBuff = 0;

  // Text W - H Buffer Vars
  var txtHeightBuff = 0, 
      txtWidthBuff = 0,
      txtScrollBuff = 5; // Adds a few pixels to text height for scroll distange purposes

  // Close X Buffer Vars
  var closeDims = 6,
      closeWBuff = 6,
      closeXBuff = 10,
      closeBtnDims = 12;

  // Scrollbar Vars
  var scrlWidth = 4;

  // ------------------------------------------------------------------------------------------------------
  // Set Arrow buffers
  if(arwOn) {

    // Arrow on TOP
    if(arwPos === "top") { 
      topBuff = arrwSize;
      txtHeightBuff = arrwSize;
      
      // Set arrow secondary position
      if(arwPos2 === "left") { 
        arrwLeft = arrwSize + arrowOffset;
      } else {
        arrwLeft = dim[0] - ((arrwSize + arrowOffset) + arrwDims);
      }

    }

    // Arrow on LEFT
    if(arwPos === "left") { 
      leftBuff = arrwSize; 
      txtWidthBuff = arrwSize;
      arrwRotate = -90;
      
      // Set arrow secondary position
      if(arwPos2 === "top") { 
        arrwTop = arrwSize + arrowOffset;
      } else {
        arrwTop = dim[1] - ((arrwSize + arrowOffset) + arrwDims);
      }
    }

    // Arrow on RIGHT
    if(arwPos === "right") { 
      arrwLeft = dim[0] - arrwDims;
      rightBuff = arrwSize;
      txtWidthBuff = arrwSize;
      arrwRotate = 90;
      
      // Set arrow secondary position
      if(arwPos2 === "top") { 
        arrwTop = arrwSize + arrowOffset;
      } else {
        arrwTop = dim[1] - ((arrwSize + arrowOffset) + arrwDims);
      }
    }

    // // Arrow on BOTTOM
    if(arwPos === "bottom") {
      bottomBuff = arrwSize;
      txtHeightBuff = arrwSize;
      arrwTop = dim[1] - arrwDims;
      arrwRotate = 180;
      
      // Set arrow secondary position
      if(arwPos2 === "left") { 
        arrwLeft = arrwSize + arrowOffset;
      } else {
        arrwLeft = dim[0] - ((arrwSize + arrowOffset) + arrwDims);
      }
    }

  }

  // ------------------------------------------------------------------------------------------------------
  // Create Tooltip Elements
  var arrow = "<svg id='arrow' style='position:absolute; top:" + arrwTop + "px; left:" + arrwLeft + "px; width:" + arrwDims + "px; height:" + arrwDims + "px; transform: rotate(" + arrwRotate + "deg);'> <defs> <style> .cls-2a, .cls-2b { fill: #ffffff; } .cls-2b { stroke: #000; stroke-width: 0.5px; fill-rule: evenodd; } </style> </defs> <rect class='cls-2a' x='0.08' y='6' width='8' height='1'/> <path id='tooltip_box' data-name='tooltip box' class='cls-2b' d='M8.87,7.25,5,1.45,1.13,7.25' transform='translate(-0.92 -1)'/> </svg>"
  var closeX = "<svg id='close' style='position:absolute; top:" + (closeXBuff + topBuff) + "px; left:" + (Number(dim[0]) - (closeWBuff + closeXBuff + rightBuff)) + "px; width:" + closeDims + "px; height:" + closeDims + "px;'> <polygon id='close' points='6 0.29 5.71 0 3 2.71 0.29 0 0 0.29 2.71 3 0 5.71 0.29 6 3 3.29 5.71 6 6 5.71 3.29 3 6 0.29'/> </svg>";
  var imgDiv = "<div id='tooltipImg' style='position:relative; top:" + topBuff + "px; left:" + leftBuff + "px; width:" + (dim[0] - (leftBuff + rightBuff)) + "px; height:" + (dim[1] - (topBuff + bottomBuff)) + "px; background-color:#fff; border:0.5px solid black; display:block;'></div>";
  var txtHolder = "<div id='legalTextHolder' style='position:absolute; overflow:hidden;'></div>";
  var txtDiv = "<div id='legalText' style='position:absolute; text-align:left'>" + txt + "</div>";
  var thumbBkg = "<div id='scrlWdgtBKG' style='position:absolute;'></div>";
  var thumb = "<div id='scrlWdgt' style='position:absolute;'></div>";
  var closeBtn = "<div id='close_btn'></div>"
    
  // Add Elements to Main Div
  div.innerHTML = imgDiv;
  div.innerHTML+= closeX;
  div.innerHTML+= txtHolder;
  legalTextHolder.innerHTML+= txtDiv;
  div.innerHTML+= thumbBkg;
  div.innerHTML+= thumb;
  div.innerHTML+= closeBtn;

  // Add Arrow
  if(arwOn) {
    div.innerHTML+= arrow;
  }

  // ------------------------------------------------------------------------------------------------------
  // Set Text Holder and text box props
  var txtHolderWidth = dim[0] - (35 + txtWidthBuff);
  var txtHolderHeight = dim[1] - ((txtTopSpacing + txtBotSpacing) + txtHeightBuff);
  stp.set(legalTextHolder, {left:(txtLeftSpacing + leftBuff + offset[0]), top:(10 + topBuff + offset[1]), width:txtHolderWidth, height:txtHolderHeight}, 0);
  
  // Set legal text width
  stp.set(legalText, {width:txtHolderWidth}, 0);

  // Set scroll widget vars
  var scrlTxtH = legalText.clientHeight + txtScrollBuff;
  var txtScaleDiff = txtHolderHeight / scrlTxtH;

  // ------------------------------------------------------------------------------------------------------
  // Set Scroll Bar ON / OFF Toggle
  if(legalText.clientHeight  > (txtHolderHeight)) {

    scrlON = true;

    // Set Scroll Bar Vars
    var wdgtTop = (txtTopSpacing + closeDims + scrlTopSpacing) + topBuff;
    var wdgtTrackHeight = txtHolderHeight - (closeDims + scrlTopSpacing);
    var wdgtHeight = wdgtTrackHeight * txtScaleDiff;
    var scrollOffset = (scrlTxtH - txtHolderHeight) / (wdgtTrackHeight - wdgtHeight);

    if(arwPos === "right") {
      leftBuff = arrwSize; 
    } else {
      leftBuff = 0; 
    }
    
    // Set scroll widget props
    stp.set(scrlWdgtBKG, {right:(scrlRightSpacing + leftBuff), top:wdgtTop, width:scrlWidth, height:wdgtTrackHeight, display:"block", backgroundColor:"#F6F6F6"}, 0);
    stp.set(scrlWdgt, {right:(scrlRightSpacing + leftBuff), top:wdgtTop, width:scrlWidth, height:wdgtHeight, display:"block", backgroundColor:"#DAD8D8", cursor:"pointer"}, 0);

    stp.set(legalText, {className:("+=set_scroll")}, 0);

    // Activate Mouse Wheel Scroll
    scrlData = [scrlTxtH, txtHolderHeight, wdgtTop, wdgtTrackHeight];
    legalText.addEventListener('scroll', resetScrollPos);

    // Activate Scollbar Drag
    dragElement(document.getElementById("scrlWdgt"), wdgtHeight, wdgtTop, wdgtTrackHeight, scrollOffset);

  }

  // Set legal text height ( set after above variables are calcualted )
  stp.set(legalText, {height:txtHolderHeight}, 0);

  // Set close button props
  stp.set(close_btn, {left:(dim[0] - (((scrlLeftSpacing + scrlRightSpacing + scrlWidth) - closeDims) + rightBuff)), top:(((txtTopSpacing - (closeBtnDims - closeDims) / 2)) + topBuff), width:closeBtnDims, height:closeBtnDims}, 0);
  
  // Set Tooltip Position
  stp.set(div, {left:pos[0], top:pos[1], width:dim[0], height:(dim[1] + txtHeightBuff), display:"none"}, 0);

  // Activate Toolip Controls
  stp.call(tooltipControlsON, [], 0)

}

function resetScrollPos () {

  var scrlTxtH = scrlData[0];
  var txtHolderHeight = scrlData[1];
  var wdgtTop = scrlData[2];
  var wdgtTrackHeight = scrlData[3];

  var scrlPerc = legalText.scrollTop / ((scrlTxtH - txtHolderHeight) - 5);
  scrlWdgt.style.top = (wdgtTop + ((wdgtTrackHeight - scrlWdgt.clientHeight) * scrlPerc)) + "px";
  
}

// Make the DIV element draggable:
function dragElement(elmnt, elemHeight, trackTop, trackHeight, scrollOffset) {
  var pos1 = 0;
  var pos2 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    
    e = e || window.event;
    e.preventDefault();

    // get the mouse cursor position at startup:
    pos2 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    legalText.removeEventListener('scroll', resetScrollPos);

    // calculate the new cursor position:
    pos1 = pos2 - e.clientY;
    pos2 = e.clientY;

    elmnt.style.top = (elmnt.offsetTop - pos1) + "px";
    
    // Stop at top of scroll channel
    if(elmnt.offsetTop < trackTop) {
      elmnt.style.top = trackTop + "px";
    }

    // Stop at bottom of scroll channel
    if(elmnt.offsetTop > (trackTop + (trackHeight - elemHeight))) {
      elmnt.style.top = (trackTop + (trackHeight - elemHeight)) + "px";
    }
    
    legalText.scrollTop = ((elmnt.offsetTop - trackTop) * scrollOffset);
    
    
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    legalText.addEventListener('scroll', resetScrollPos);
  }
}

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
//  - - - - - - - - - - - - - -    H E L P E R   F U N C T I O N S   - - - - - - - - - - - - - - - - - -
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// C E N T E R   T E X T
// ------------------------------------------------------------------------------------------------------
function align_text(div, pos) {
  var ct = new TimelineMax();

  
  var txtXPos = ((width - div.clientWidth) / 2 + 3);
  var txtYPos = ((height - div.clientHeight) / 2);

  if(pos != "center") {
    if(pos[0] != "center") { txtXPos = pos[0]; }
    if(pos[1] != "center") { txtYPos = pos[1]; }
  }

  ct.set(div, {left:txtXPos, top:txtYPos}, 0);

}

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
