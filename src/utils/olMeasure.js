import {Draw} from 'ol/interaction'
import Tooltip from 'ol-ext/overlay/Tooltip'
import * as olSource from 'ol/source'
import * as olLayer from 'ol/layer'
import * as olStyle from 'ol/style'
export class olMeasure{
    constructor(map) {
        this.map=map;
        this.source = new olSource.Vector();
        this.measureLayer=new olLayer.Vector({
            source:this.source,
            style: new olStyle.Style({
                fill: new olStyle.Fill({
                    color: 'rgba(255,255,255,0.2)'
                }),
                stroke: new olStyle.Stroke({
                    color: '#e21e0a',
                    width: 2
                }),
                image: new olStyle.Circle({
                    radius: 5,
                    fill: new olStyle.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        })
        this.map.addLayer(this.measureLayer)
        this.drawLine = new Draw({ type: 'LineString' });
        this.drawPoly = new Draw({ type: 'Polygon' });
        this.tooltip=new Tooltip()
        this.map.addInteraction(this.drawLine)
        this.map.addInteraction(this.drawPoly)
        this.map.addOverlay(this.tooltip);
        this.drawLine.on('drawstart', this.tooltip.setFeature.bind(this.tooltip));
        this.drawLine.on(['change:active','drawend'], this.drawEndHandle.bind(this));
        this.drawPoly.on('drawstart', this.tooltip.setFeature.bind(this.tooltip));
        this.drawPoly.on(['change:active','drawend'], this.drawEndHandle.bind(this));
    }
    measureArea(){
        this.drawLine.setActive(false);
        this.drawPoly.setActive(true);
    }
    measureLength(){
        this.drawLine.setActive(true);
        this.drawPoly.setActive(false);
    }

    drawEndHandle(evt){
        let sketch=evt.feature;
        if(sketch){
            this.tooltip.removeFeature();
            this.source.addFeature(sketch);

        }
    }
    removeFeatures(){
        this.source.clear()
    }
}
