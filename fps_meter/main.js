'use strict';

class RingFIFO{

	constructor(size){
		this.length = size;
		this.size = size;
		this.__buffer = new Array(size+1);
		this.__buffer.fill(0);
		this.__cursor_pos = -1;
		console.log(this.__buffer[0], this.__buffer[size]);
	}

	add(val){
		let pos = (this.__cursor_pos + 1) % (this.size + 1);
        this.__buffer[pos] = val;
        this.__cursor_pos = pos;
	}

	get(index){
		let start = (this.__cursor_pos - this.size + 1) % (this.size + 1);
        return this.__buffer[(start + index) % (this.size + 1)];
	}
}

class FPSWidget{

	constructor(width, height){
		this.widget = document.createElement("canvas");
		this.widget2 = document.createElement("canvas");
		this.widget2.classList.add("fps-widget");
		this.enabled = false;
		this.context = this.widget.getContext("2d");
		this.context2 = this.widget2.getContext("2d");
		this.context.strokeStyle = '#ffffff';
		
		this.widget.width = width;
		this.widget.height = height;
		this.widget2.width = width;
		this.widget2.height = height;
		this.width = width;
		this.height = height;
		this.stack = new RingFIFO(width);
		this.lastDate = 0;
		document.body.appendChild(this.widget2);
	}

	toggle(){
		if (this.enabled) {
			this.widget2.classList.remove("enabled");
			this.enabled = false;
			console.log('fps disabled');
		}
		else{
			this.widget2.classList.add("enabled");
			this.enabled = true;
			console.log('fps enabled');
			this.lastDate = Date.now();
			this.frame = 0;
			this.draw();
		}
	}

	calcFPS(t) {
		this.frame++;
		let currentDate = Date.now();
		let currentTime = currentDate - this.lastDate;
		
		if (currentTime >= 100) {
			let result = Math.floor(this.frame / (currentTime/1000));
			this.stack.add(result);
		  	this.lastDate = Date.now();
		  	this.frame = 0;
		}
	}

	draw(){
		if (this.enabled){
			window.requestAnimationFrame((t) => {
				this.calcFPS(t);
				this.context.fillStyle = '#000000';
				this.context.fillRect(0,0, this.width, this.height);
				this.context.fillStyle = '#ffffff';
				this.context.beginPath();
				this.context.strokeStyle = '#ffffff';
				for(let i = 0; i < this.width; i++){
					this.context.moveTo(i, this.height);
					this.context.lineTo(i, this.height - this.stack.get(i));
				}
				this.context.closePath();
				this.context.fillText(this.stack.get(this.width - 1) + " fps", 10, 10);
				this.context.stroke();
				this.context2.drawImage(this.widget, 0, 0);
				this.draw();

			});
		}
	}
}

let fps = new FPSWidget(50, 100);

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message === "clicked_browser_action") {
		fps.toggle();
	}
});