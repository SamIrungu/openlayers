goog.provide('ol.control.Navigation');

goog.require('ol.control.Control');


/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {boolean|undefined} opt_autoActivate
 */
ol.control.Navigation = function(opt_autoActivate) {

    goog.base(this, opt_autoActivate);

    /**
     * Activate this control when it is added to a map.  Default is true.
     *
     * @type {boolean} autoActivate
     */
    this.autoActivate_ =
        goog.isDef(opt_autoActivate) ? opt_autoActivate : true;
    
};
goog.inherits(ol.control.Navigation, ol.control.Control);

/** @inheritDoc */
ol.control.Navigation.prototype.activate = function() {
    var active = goog.base(this, 'activate');
    if (active) {
        var events = this.getMap().getEvents();
        events.register("drag", this.moveMap, this);
        events.register("scroll", this.zoomMap, this);
    }
    return active;
};

/** @inheritDoc */
ol.control.Navigation.prototype.deactivate = function() {
    var inactive = goog.base(this, 'deactivate');
    if (inactive) {
        var events = this.getMap().getEvents();
        events.unregister("drag", this.moveMap, this);
        events.unregister("scroll", this.zoomMap, this);
    }
    return inactive;
};

/**
 * @param {Object} evt
 */
ol.control.Navigation.prototype.moveMap = function(evt) {
    this.getMap().moveByPx(evt.deltaX, evt.deltaY);
    return false;
};

/**
 * @param {Event} evt
 */
ol.control.Navigation.prototype.zoomMap = function(evt) {
    var map = this.getMap(),
        delta = ((evt.deltaY / 3) | 0);
    if (Math.abs(delta) === 0) {
        return;
    }

    var currentZoom = /** @type {number} */ (map.getZoom()),
        newZoom = currentZoom - delta;
    newZoom = Math.max(newZoom, 0);
    newZoom = Math.min(newZoom, map.getNumZoomLevels());
    if (newZoom === currentZoom) {
        return;
    }
    var xy = map.getEvents().getPointerPosition(evt),
        size = map.getSize(),
        newRes  = map.getResolutionForZoom(newZoom),
        zoomPoint = map.getLocForPixel(xy),
        newCenter = new ol.Loc(
            zoomPoint.getX() + (size.width/2 - xy.x) * newRes,
            zoomPoint.getY() - (size.height/2 - xy.y) * newRes
        );
    map.zoomTo(newZoom, newCenter);

    evt.preventDefault();
    return false;
};

ol.control.addControl('navigation', ol.control.Navigation);