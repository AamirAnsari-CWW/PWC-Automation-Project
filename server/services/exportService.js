const path = require("path");
const fs = require("fs-extra");

const { EXPORTS_ROOT } = require("../config/storagePaths");
const HttpError = require("../utils/httpError");
const { getPreviewAssetPath } = require("./previewService");
const imageService = require("./imageService");
const textService = require("./textService");
const zipService = require("./zipService");

const sanitizeFileName = (value) => {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "banner-export";
};

const injectAdjustmentState = (html, compositionTransform, imageAdjustments, hiddenImages, shapeDefinitions, shapeAdjustments) => {
  const compositionState = JSON.stringify(compositionTransform || { x: 0, y: 0, scale: 1, rotation: 0 });
  const imageAdjustmentState = JSON.stringify(imageAdjustments || {});
  const hiddenImageState = JSON.stringify(hiddenImages || {});
  const shapeDefinitionState = JSON.stringify(shapeDefinitions || {});
  const shapeAdjustmentState = JSON.stringify(shapeAdjustments || {});
  const script = `<script>
window.__BANNER_COMPOSITION_TRANSFORM__=${compositionState};
window.__BANNER_IMAGE_ADJUSTMENTS__=${imageAdjustmentState};
window.__BANNER_HIDDEN_IMAGES__=${hiddenImageState};
window.__BANNER_SHAPE_DEFINITIONS__=${shapeDefinitionState};
window.__BANNER_SHAPE_ADJUSTMENTS__=${shapeAdjustmentState};
(function(){
  function findTarget(key){
    var imageName=key.indexOf(".")===-1?key:key.split(".")[0];
    var keyed=document.querySelector('[data-banner-image-key="'+key+'"]');
    var image=(keyed&&keyed.tagName==="IMG"?keyed:keyed&&keyed.querySelector("img"))||document.querySelector('img[src*="'+key+'"], img[src*="'+imageName+'"]');
    var layer=(keyed&&keyed.closest('div[id^="d"]'))||(image&&image.closest('div[id^="d"]'));
    if(image){image.dataset.bannerImageKey=key;}
    if(layer){layer.dataset.bannerImageKey=key;}
    return{image:image,layer:layer||image||document.getElementById(imageName)||document.getElementById(key)||document.querySelector("."+imageName)||document.querySelector("."+key)};
  }
  function baseNumber(el,key){
    if(!el)return 0;
    var dataKey="bannerBase"+key.charAt(0).toUpperCase()+key.slice(1);
    if(el.dataset[dataKey]===undefined){
      var computed=window.getComputedStyle(el);
      var raw=el.style[key]||computed[key]||"0";
      el.dataset[dataKey]=String(parseFloat(raw)||0);
    }
    return Number(el.dataset[dataKey]||0);
  }
  function baseTransform(el){
    if(!el)return "";
    if(el.dataset.bannerBaseTransform===undefined){
      var transform=el.style.transform||"";
      el.dataset.bannerBaseTransform=transform==="none"?"":transform;
    }
    return el.dataset.bannerBaseTransform||"";
  }
  function baseDisplay(el){
    if(!el)return "";
    if(el.dataset.bannerBaseDisplay===undefined){
      var display=el.style.display||window.getComputedStyle(el).display||"";
      el.dataset.bannerBaseDisplay=display==="none"?"":display;
    }
    return el.dataset.bannerBaseDisplay||"";
  }
  function apply(target,s,key){
    if(!target||!target.layer||!s)return false;
    if(key!=="mainbg.jpg"&&s.visible!==false&&Number(s.x||0)===0&&Number(s.y||0)===0&&Number(s.scale||1)===1&&Number(s.rotation||0)===0)return false;
    var x=Number(s.x||0);
    var y=Number(s.y||0);
    var scale=Number(s.scale||1);
    var rotation=Number(s.rotation||0);
    if(target.image){
      target.layer.style.display=s.visible===false?"none":baseDisplay(target.layer);
      target.layer.style.overflow="hidden";
      if(window.getComputedStyle(target.layer).position==="static"){target.layer.style.position="relative";}
      target.image.style.position="absolute";
      target.image.style.left="0";
      target.image.style.top="0";
      target.image.style.width=target.image.naturalWidth?target.image.naturalWidth+"px":"auto";
      target.image.style.height=target.image.naturalHeight?target.image.naturalHeight+"px":"auto";
      target.image.style.maxWidth="none";
      target.image.style.maxHeight="none";
      target.image.style.objectFit="initial";
      target.image.style.transformOrigin="top left";
      target.image.style.transform="translate("+x+"px, "+y+"px) scale("+scale+") rotate("+rotation+"deg)";
      return true;
    }
    var layer=target.layer;
    var scaleEl=target.image||target.layer;
    layer.style.display=s.visible===false?"none":baseDisplay(layer);
    layer.style.left=baseNumber(layer,"left")+x+"px";
    layer.style.top=baseNumber(layer,"top")+y+"px";
    scaleEl.style.transformOrigin="center center";
    scaleEl.style.transform=baseTransform(scaleEl)+" scale("+scale+") rotate("+rotation+"deg)";
    return true;
  }
  function normalizeShape(s){
    s=s||{};
    return{x:Number(s.x||0),y:Number(s.y||0),scale:Number(s.scale||1),rotation:Number(s.rotation||0),visible:s.visible!==false};
  }
  function shapeSelectors(key,definition){
    if(Array.isArray(definition)){return definition.concat('[data-shape="'+key+'"]');}
    if(typeof definition==="string"&&definition){return[definition,'[data-shape="'+key+'"]'];}
    return['[data-shape="'+key+'"]'];
  }
  function shapeTargets(key){
    var targets=[];
    shapeSelectors(key,window.__BANNER_SHAPE_DEFINITIONS__[key]).forEach(function(selector){
      document.querySelectorAll(selector).forEach(function(target){
        if(targets.indexOf(target)===-1){targets.push(target);}
      });
    });
    return targets;
  }
  function applyShape(key){
    var targets=shapeTargets(key);
    if(!targets.length)return false;
    var s=normalizeShape(window.__BANNER_SHAPE_ADJUSTMENTS__[key]);
    targets.forEach(function(target){
      target.style.display=s.visible?baseDisplay(target):"none";
      target.style.transformOrigin=target.style.transformOrigin||"center center";
      target.style.transform=baseTransform(target)+" translate("+s.x+"px, "+s.y+"px) scale("+s.scale+") rotate("+s.rotation+"deg)";
    });
    return true;
  }
  function applyAll(){
    apply(findTarget("mainbg.jpg"),window.__BANNER_COMPOSITION_TRANSFORM__,"mainbg.jpg");
    apply(findTarget("silo.png"),window.__BANNER_COMPOSITION_TRANSFORM__,"silo.png");
    Object.keys(window.__BANNER_IMAGE_ADJUSTMENTS__||{}).forEach(function(key){
      if(key==="mainbg.jpg"||key==="silo.png"){return;}
      apply(findTarget(key),window.__BANNER_IMAGE_ADJUSTMENTS__[key],key);
    });
    Object.keys(window.__BANNER_HIDDEN_IMAGES__||{}).forEach(function(key){
      var target=findTarget(key);
      if(target.layer){target.layer.style.display=window.__BANNER_HIDDEN_IMAGES__[key]?"none":"block";}
    });
    Object.keys(window.__BANNER_SHAPE_DEFINITIONS__||{}).forEach(applyShape);
  }
  window.addEventListener("load",applyAll);
  if("MutationObserver" in window){
    new MutationObserver(applyAll).observe(document.documentElement,{childList:true,subtree:true});
  }
  var attempts=0;
  var interval=setInterval(function(){
    applyAll();
    attempts+=1;
    if(attempts>160){clearInterval(interval);}
  },50);
})();
</script>`;

  return html.includes("</body>") ? html.replace("</body>", `${script}\n</body>`) : `${html}\n${script}`;
};

const replaceEditableImages = async (workingDirectory, images) => {
  await Promise.all(
    Object.entries(images || {}).map(async ([imageName, imageValue]) => {
      const uploadedImagePath = await imageService.resolveUploadedImagePath(imageValue);

      if (!uploadedImagePath) {
        throw new HttpError(400, `Uploaded image for ${imageName} was not found. Please upload it again before export.`);
      }

      await fs.copy(uploadedImagePath, path.join(workingDirectory, imageName));
    })
  );
};

const createExport = async (project) => {
  const sourceIndexPath = await getPreviewAssetPath(project.templateId, project.size, "index.html");
  const sourceDirectory = path.dirname(sourceIndexPath);
  const exportName = sanitizeFileName(project.name);
  const exportId = `${exportName}-${Date.now()}`;
  const workingDirectory = path.join(EXPORTS_ROOT, exportId, "package");
  const zipPath = path.join(EXPORTS_ROOT, exportId, `${exportName}.zip`);
  const indexPath = path.join(workingDirectory, "index.html");

  await fs.copy(sourceDirectory, workingDirectory);
  await replaceEditableImages(workingDirectory, project.images);

  const html = await fs.readFile(indexPath, "utf8");
  const updatedTextHtml = textService.replaceEditableText(html, project.texts);
  const exportedHtml = injectAdjustmentState(
    updatedTextHtml,
    project.compositionTransform || project.background,
    project.imageAdjustments,
    project.hiddenImages,
    project.shapeDefinitions,
    project.shapeAdjustments
  );

  await fs.writeFile(indexPath, exportedHtml);
  await zipService.createZipFromDirectory(workingDirectory, zipPath);

  return {
    fileName: `${exportName}.zip`,
    zipPath,
  };
};

module.exports = {
  createExport,
};
