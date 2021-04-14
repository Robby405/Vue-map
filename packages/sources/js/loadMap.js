import 'ol/ol.css';
import Map from 'ol/Map';
import { Group } from 'ol/layer';
import { defaults as defaultControls } from 'ol/control'
import { defaults as defaultInteractions } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
// import { WKT } from 'ol/format';

class MapClass {
    constructor(container, layerPointType, projection, authKey, options) {
        //坐标系
        this.proj = projection;
        //地图容器
        this.container = container;

        this.tiandituLayer = new TileLayer({
            id: 'baseMap',
            name: '天地图路网',
            zIndex: 0,
            source: new XYZ({
                attributions: [],
                title: '天地图路网',
                wrapX: false,
                url: `https://t6.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${authKey}`
            })
        })

        this.tiandituLayersGroup = new Group({
            layers: [this.tiandituLayer]
        })

        //矢量图层类型
        this.map = new Map({
            controls: // [overviewMapControl]
                defaultControls({
                    attribution: false,
                    zoom: false,
                    rotate: false
                }).extend([
                    
                ]),
            interactions: defaultInteractions().extend([]),
            target: container,
            layers: [
                this.tiandituLayersGroup
            ],
            view: new View({
                ...options.view
            })
        });
    }
}

export {
    MapClass,
}