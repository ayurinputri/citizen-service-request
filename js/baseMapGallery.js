/*global baseMapLayers,map,dojo,esri,hideShareAppContainer,hideAddressContainer,hideBaseMapLayerContainer,isTablet */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true */
/*
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */

//Animate base map panel with wipe-in and wipe-out animation
function showBaseMaps() {
    hideShareAppContainer();
    hideAddressContainer();
    var cellHeight = isTablet ? 100 : 115;
    if (dojo.coords("divLayerContainer").h > 0) {
        hideBaseMapLayerContainer();
    } else {
        dojo.byId('divLayerContainer').style.height = Math.ceil(baseMapLayers.length / 2) * cellHeight + "px";
        dojo.replaceClass("divLayerContainer", "showContainerHeight", "hideContainerHeight");
    }
}

function hideMapLayers() {
    var i, layer;

    for (i = 0; i < baseMapLayers.length; i++) {
        layer = map.getLayer(baseMapLayers[i].Key);
        if (layer) {
            layer.hide();
        }
    }
}

//Toggle Basemap
function changeBaseMap(spanControl) {
    var key, i, layer;

    hideMapLayers();
    key = spanControl.getAttribute('layerId');

    for (i = 0; i < baseMapLayers.length; i++) {
        dojo.removeClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
        if (dojo.isIE) {
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginTop = "0px";
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginLeft = "0px";
            dojo.byId("spanBaseMapText" + baseMapLayers[i].Key).style.marginTop = "0px";
        }
        if (baseMapLayers[i].Key === key) {
            dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
            if (dojo.isIE) {
                dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginTop = "-5px";
                dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginLeft = "-5px";
                dojo.byId("spanBaseMapText" + baseMapLayers[i].Key).style.marginTop = "5px";
            }

            layer = map.getLayer(baseMapLayers[i].Key);
            layer.show();
        }
    }
}

//Create elements to toggle the maps
function createBaseMapElement(baseMapLayerInfo) {
    var divContainer, imgThumbnail, spanBaseMapText;

    divContainer = document.createElement("div");
    divContainer.className = "baseMapContainerNode";
    imgThumbnail = document.createElement("img");
    imgThumbnail.src = baseMapLayerInfo.ThumbnailSource;
    imgThumbnail.className = "basemapThumbnail";
    imgThumbnail.id = "imgThumbNail" + baseMapLayerInfo.Key;
    imgThumbnail.setAttribute("layerId", baseMapLayerInfo.Key);
    imgThumbnail.onclick = function () {
        changeBaseMap(this);
        showBaseMaps();
    };
    spanBaseMapText = document.createElement("span");
    spanBaseMapText.id = "spanBaseMapText" + baseMapLayerInfo.Key;
    spanBaseMapText.className = "basemapLabel";
    spanBaseMapText.innerHTML = baseMapLayerInfo.Name;
    divContainer.appendChild(imgThumbnail);
    divContainer.appendChild(spanBaseMapText);
    return divContainer;
}

//Create layer on map
function createBaseMapLayer(layerURL, layerId, isVisible) {
    var layer = new esri.layers.ArcGISTiledMapServiceLayer(layerURL, {
        id: layerId,
        visible: isVisible
    });
    return layer;
}

//Create base-map components
function createBaseMapComponent() {
    var i, layerList, layerInfo;

    for (i = 0; i < baseMapLayers.length; i++) {
        map.addLayer(createBaseMapLayer(baseMapLayers[i].MapURL, baseMapLayers[i].Key, (i === 0) ? true : false));
    }
    layerList = dojo.byId('layerList');
    for (i = 0; i < Math.ceil(baseMapLayers.length / 2); i++) {
        document.createElement("tr");

        if (baseMapLayers[(i * 2)]) {
            layerInfo = baseMapLayers[(i * 2)];
            layerList.appendChild(createBaseMapElement(layerInfo));
        }

        if (baseMapLayers[(i * 2) + 1]) {
            layerInfo = baseMapLayers[(i * 2) + 1];
            layerList.appendChild(createBaseMapElement(layerInfo));
        }
    }
    dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[0].Key), "selectedBaseMap");
    if (dojo.isIE) {
        dojo.byId("imgThumbNail" + baseMapLayers[0].Key).style.marginTop = "-5px";
        dojo.byId("imgThumbNail" + baseMapLayers[0].Key).style.marginLeft = "-5px";
        dojo.byId("spanBaseMapText" + baseMapLayers[0].Key).style.marginTop = "5px";
    }
}
