declare const google: any;

class TxtOverlay extends google.maps.OverlayView {
	private pos_: google.maps.LatLng;
	private text_: string;
	private class_: string;
	private map_: google.maps.Map;
	private div_: HTMLElement | null;

	public constructor(pos: google.maps.LatLng, text: string, className: string, map: google.maps.Map) {
		super();
		this.pos_ = pos;
		this.text_ = text;
		this.class_ = className;
		this.map_ = map;
		this.div_ = null;
		this.setMap(map);
	}

	public onAdd = () => {
		var div = document.createElement('DIV');
		div.className = this.class_;
		div.innerHTML = this.text_;
		this.div_ = div;
		var overlayProjection = this.getProjection();
		var position = overlayProjection.fromLatLngToDivPixel(this.pos_);
		div.style.left = position.x + 'px';
		div.style.top = position.y + 'px';
		var panes = this.getPanes();
		panes.floatPane.appendChild(div);
	}
	
	public draw = () =>  {
		var overlayProjection = this.getProjection();
		var position = overlayProjection.fromLatLngToDivPixel(this.pos_);
		var div = this.div_;
		if (div) {
			div.style.left = position.x + 'px';
			div.style.top = position.y + 'px';
		}
	}
	
	public onRemove = () => {
		if (this.div_ && this.div_.parentNode) {
			this.div_.parentNode.removeChild(this.div_);
			this.div_ = null;
		}
	}
	
	public hide = () => {
		if (this.div_) {
			this.div_.style.visibility = "hidden";
		}
	}
	
	
	public show = () => {
		if (this.div_) {
			this.div_.style.visibility = "visible";
		}
	}
	
	public toggle = () => {
		if (this.div_) {
			if (this.div_.style.visibility === "hidden") {
				this.show();
			} else {
				this.hide();
			}
		}
	}
	
	public toggleDOM = () => {
		if (this.getMap()) {
			this.setMap(null);
		} else {
			this.setMap(this.map_);
		}
	}
}

export default TxtOverlay;