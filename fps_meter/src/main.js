'use strict';

class RingFIFO {

	constructor(size) {
		this.length = size;
		this.size = size;
		this.__buffer = new Array(size + 1);
		this.__buffer.fill(0);
		this.__cursor_pos = -1;
	}

	push(val) {
		let pos = (this.__cursor_pos + 1) % (this.size + 1);
		this.__buffer[pos] = val;
		this.__cursor_pos = pos;
	}

	get(index) {
		let start = this.__cursor_pos - this.size;
		if (start < 0) {
			start = this.size + 1 + start;
		}
		return this.__buffer[(start + index) % (this.size + 1)];
	}
}

class FPSWidget {

	constructor(width, height, graphSize) {
		this.widget = document.createElement("canvas");
		this.widget2 = document.createElement("canvas");
		this.widget2.classList.add("fps-widget");
		this.enabled = false;
		this.context = this.widget.getContext("2d");
		this.context2 = this.widget2.getContext("2d");
		this.widget.width = width;
		this.widget.height = height;
		this.widget2.width = width;
		this.widget2.height = height;
		this.width = width;
		this.height = height;
		this.kx = width / graphSize;
		this.context.strokeStyle = '#ffffff';
		this.context.lineWidth = 1;
		let fontSize = Math.floor(this.height / 3.5);
		this.context.font = 'bold ' + fontSize + 'px serif';
		this.context.textAlign = 'center';
		this.stack = new RingFIFO(graphSize);
		this.lastDate = 0;
		document.body.appendChild(this.widget2);
	}

	toggle() {
		if (this.enabled) {
			this.widget2.classList.remove("enabled");
			this.enabled = false;
			console.log('fps widget disabled');
		}
		else {
			this.widget2.classList.add("enabled");
			this.enabled = true;
			console.log('fps widget enabled');
			this.lastDate = Date.now();
			this.frame = 0;
			this.loop();
		}
	}

	calcFPS(t) {
		this.frame++;
		let currentDate = Date.now();
		let currentTime = currentDate - this.lastDate;
		if (currentTime >= 50) {
			let result = Math.floor(this.frame / (currentTime / 1000));
			this.lastDate = Date.now();
			this.frame = 0;
			this.stack.push(result);
		}
	}

	loop() {
		if (this.enabled) {
			window.requestAnimationFrame((t) => {
				this.calcFPS(t);
				this.loop();
				this.draw();
			});
		}
	}

	draw() {
		this.context.fillStyle = 'white';
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.strokeStyle = 'black';
		this.context.beginPath();
		this.context.fillStyle = 'black';
		let l = this.stack.length;
		let kx = this.kx;
		let stack = this.stack;
		let x, y;
		let h = this.height;
		for (let i = 0; i < l; i++) {
			x = Math.floor(i * kx);
			y = Math.floor(stack.get(i));
			this.context.moveTo(x, h - y);
			this.context.lineTo(x, h);
		}
		let last_x = Math.floor(l * kx);
		this.context.moveTo(last_x, h - y);
		this.context.lineTo(last_x, h);
		this.context.stroke();
		this.context.fillText(this.stack.get(l - 1) + " f", Math.floor(h / 2), Math.floor(this.width / 3));
		this.context2.drawImage(this.widget, 0, 0);
	}
}

let fps = new FPSWidget(100, 100, 30);

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === "clicked_browser_action") {
		fps.toggle();
	}
});
