import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString, Polygon } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { generateGuid } from './common';

let measureDraw = false;

/**
 * 量测
 * @param {*地图对象} map 
 * @param {*量测对象，线/面} type 
 * @param {*目前坐标系} proj 
 * @returns 
 */
function measureLengthOrArea(map, type, proj) {
    if (measureDraw) {
        map.removeInteraction();
        const toop = document.getElementById('meaOverlayHelp');
        toop.parentNode.removeChild(toop);
        return;
    }
    measureDraw = true;
    const measureVectorSource = new VectorSource();
    let measureVectorLayer = new VectorLayer({
        source: measureVectorSource,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: '#ffcc33',
                width: 2,
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#ffcc33',
                }),
            }),
        }),
    });
    /**
    * Currently drawn feature. 当前绘制的要素
    * @type {import("../src/ol/Feature.js").default}
    */
    let sketch;

    /**
     * The help tooltip element. 绘制时的提示框
     * @type {HTMLElement}
     */
    let helpTooltipElement;

    /**
     * Overlay to show the help messages. 提示框层
     * @type {Overlay}
     */
    let helpTooltip;

    /**
     * The measure tooltip element. 绘制后计算得出的长度/面积提示框
     * @type {HTMLElement}
     */
    let measureTooltipElement;

    /**
     * Overlay to show the measurement. 提示框层
     * @type {Overlay}
     */
    let measureTooltip;

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    let continuePolygonMsg = '点击地图继续画面,以双击结束';

    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    let continueLineMsg = '点击地图继续画线,以双击结束';
    let pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        let helpMsg = '点击地图开始绘图';
        if (sketch) {
            const geom = sketch.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = continueLineMsg;
            }
        }

        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove('hidden');
    }
    map.addLayer(measureVectorLayer);
    let pointermoveListener = map.on('pointermove', pointerMoveHandler);
    map.getViewport().addEventListener('mouseout', function () {
        helpTooltipElement.classList.add('hidden');
    });

    let draw;
    function addInteraction() {
        draw = new Draw({
            source: measureVectorSource,
            type: type,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.9)',
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
            }),
        });
        // map.addInteraction(draw);
        const guid = generateGuid();
        addInteractionToMap(map, draw);
        createMeasureTooltip(guid);
        createHelpTooltip();

        let listener;
        draw.on('drawstart', function (evt) {
            sketch = evt.feature;
            sketch.setId(guid);

            let tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                let geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom, proj);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom, proj);
                    tooltipCoord = geom.getLastCoordinate();
                }
                const innerHTML =
                    `<span  id=${guid}
                     class='removeMeasureInfo'></span>`
                measureTooltipElement.innerHTML = output + innerHTML;
                measureTooltip.setPosition(tooltipCoord);
                document.getElementById(guid).addEventListener('click', function () {
                    removeFeatureFromVectorLayer(map, guid, measureVectorLayer);
                    removeMeasureInfo(map, guid);
                })
            })
        }, this)
        draw.on('drawend', function () {
            document.getElementById(guid).style.display = 'block';
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measureTooltip.setOffset([0, -7]);
            sketch = null;
            measureTooltipElement = null;
            createMeasureTooltip();
            unByKey(listener);
            unByKey(pointermoveListener);
            // helpTooltipElement && helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            console.log(map, draw);
            removeInteractionFromMap(map, draw);
        })
    }

    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltip = new Overlay({
            id: 'meaOverlayHelp',
            element: helpTooltipElement,
            offset: [25, 0],
            positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
    }

    function createMeasureTooltip(guid) {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new Overlay({
            id: 'meaOverlayTool',
            element: measureTooltipElement,
            offset: [0, -25],
            positioning: 'bottom-center'
        });
        measureTooltip.set('guid', guid);
        map.addOverlay(measureTooltip);
    }

    addInteraction();
}
function formatLength(line, proj) {
    let length = getLength(line, { projection: proj });
    let output;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
        output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
}

function formatArea(polygon, proj) {
    let area = getArea(polygon, { projection: proj });
    let output;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' m<sup>2</sup>';
    }
    return output;
}
function removeFeatureFromVectorLayer(map, guid, layer) {
    if (!guid) return;
    let source = layer.getSource();
    let feature = layer.getSource().getFeatureById(guid);
    if (source && feature) {
        source.removeFeature(feature);
    }
}
function removeMeasureInfo(map, guid) {
    let temOverLayer = [];
    const overLayers = map.getOverlays();
    for (var j = 0; j < overLayers.getLength(); j++) {
        let tempArray = overLayers.getArray();
        if (tempArray[j].id) {
            if (tempArray[j].id.indexOf('meaOverlayTool') === 0) {
                if (tempArray[j].getProperties().guid === guid) {
                    temOverLayer.push(tempArray[j]);
                }
            }
        }
        removeOverlayFromMap(map, temOverLayer);
    }
}
/**
   * 添加地图交互
   * @param interaction 地图交互
   */
function addInteractionToMap(map, interaction) {
    if (!interaction) {
        return;
    }
    if (interaction instanceof Array) {
        interaction.forEach(item => {
            try {
                map.addInteraction(item);
            } catch (e) {
                console.error(e);
            }
        });
    } else {
        try {
            map.addInteraction(interaction);
        } catch (e) {
            console.error(e);
        }
    }
}
/**
 * 移除地图交互
 * @param interaction 地图交互
 */
function removeInteractionFromMap(map, interaction) {
    if (!interaction) {
        return;
    }
    if (interaction instanceof Array) {
        interaction.forEach(item => {
            try {
                map.removeInteraction(item);
            } catch (e) {
                console.error(e);
            }
        });
    } else {
        try {
            map.removeInteraction(interaction);
        } catch (e) {
            console.error(e);
        }
    }
}

/**
 * 从地图移除叠加层
 * @param overlays 叠加层
 */
function removeOverlayFromMap(map, overlays) {
    if (!overlays) {
        return;
    }
    if (overlays.length) {
        overlays.forEach((overlay) => {
            try {
                map.removeOverlay(overlay);
            } catch (e) {
                console.error(e);
            }
        });
    } else {
        try {
            map.removeOverlay(overlays);
        } catch (e) {
            console.error(e);
        }
    }
}


/**
* 设置全图
* @param coord
* @param zoom
*/
function setFullExtent(map, coord, zoom) {
    // map.getView().fit(this.stationExtent)
    if (coord && zoom) {
        setCenter(map, coord, false);
        map.getView().setZoom(zoom);
    } else {
        // if (offlineMapOnly) {
        //     fitMapToLayerExtent(offlineLayerNames, offlineLayerUrl);
        // } else {
        setCenter(map, [113.356899, 22.977328], false);
        map.getView().setZoom(9);
        // }
    }
}

/**
  * 设置地图中心点
  * @param coord 中心点坐标
  * @param enableAnimation 是否启用动画
  * @param duration 动画间隔
  */
function setCenter(map, coord, enableAnimation, duration) {
    if (enableAnimation) {
        map.getView().animate({
            zoom: map.getView().getZoom()
        }, {
            center: coord
        }, {
            duration: duration
        });
    } else {
        map.getView().setCenter(coord);
    }
    map.updateSize();
}

function updateSize(map) {
    map.updateSize();
}

export {
    setFullExtent,
    setCenter,
    updateSize,
    measureLengthOrArea,
    addInteractionToMap,
    removeInteractionFromMap,
    // deleteLayerFromMeasure,
    removeOverlayFromMap
}
