// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// V A R S
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var dcDCOExitURL;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// P A R S E   S I Z M E K   D Y A N M I C   D A T A
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function setSizmekData() {

  conceptNum = adkit.getSVData("conceptNum");

  if(dyanmicText == true) {

    banTxt = eval("ban_" + conceptNum + "_Txt");

    for(var i = 0; i < banTxt.length; i++){
      banTxt[i] = adkit.getSVData(banTxt[i]);
    }

  }

  banImgs = eval("ban_" + conceptNum + "_Imgs");

  for(var i = 0; i < banImgs.length; i++){
    banImgs[i] = adkit.getSVData(banImgs[i]);
  }

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// P A R S E   D O U B L E C L I C K   D Y A N M I C   D A T A
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function setDoubleClickData() {

// ======================================================================================================
// IMPORT BANNER DATA
// ======================================================================================================
  Enabler.setProfileId(10435589);
  var devDynamicContent = {};

  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1 = [{}];
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0]._id = 0;
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].conceptNum = 1;
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_f2_bg = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_f2_bg.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_f2_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113650522_c1_f2_bg.jpg";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_f9_bg = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_f9_bg.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_f9_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113654319_c1_f9_bg.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy1 = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy1.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy1.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113639836_c1_ef_copy1.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy2 = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy2.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy2.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113643356_c1_ef_copy2.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy3 = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy3.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c1_ef_copy3.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113646907_c1_ef_copy3.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f1_bg = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f1_bg.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f1_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113707308_c2_f1_bg.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f2_bg = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f2_bg.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f2_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113710695_c2_f2_bg.jpg";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f3_bg = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f3_bg.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_f3_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113713627_c2_f3_bg.jpg";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy1 = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy1.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy1.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113657268_c2_ef_copy1.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy2 = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy2.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy2.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113700781_c2_ef_copy2.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy3 = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy3.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_ef_copy3.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113704003_c2_ef_copy3.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_legal_rollover = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_legal_rollover.Type = "file";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].c2_legal_rollover.Url = "https://s0.2mdn.net/ads/richmedia/studio/24136700/24136700_20190405113716879_legal_rollover.png";
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].clickthrough = {};
  devDynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].clickthrough.Url = "http://www.verizon.com";
  Enabler.setDevDynamicContent(devDynamicContent);

	// ======================================================================================================
  // SET BANNER DATA
	// ======================================================================================================
  var conceptNum = dynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].conceptNum;
  dcDCOExitURL = dynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0].clickthrough.Url;

  if(dyanmicText === true) {

    // Set dynamic text
    banTxt = eval("ban_" + conceptNum + "_Txt");

    for(var i = 0; i < banTxt.length; i++){

      banTxt[i] = eval("dynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0]." + banTxt[i] + ".Url");

    }

  }

  // Set dynamic images
  banImgs = eval("ban_" + conceptNum + "_Imgs");

  for(var i = 0; i < banImgs.length; i++){

    banImgs[i] = eval("dynamicContent.VZW_MEGA_DCO_Test_Build_Sheet1[0]." + banImgs[i] + ".Url");

  }




}
