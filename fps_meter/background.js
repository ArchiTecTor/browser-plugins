console.log('background loaded');
browser.browserAction.onClicked.addListener((tab)=>{
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    browser.tabs.sendMessage(tab.id, {"message": "clicked_browser_action"});
	});
	console.log('clicked button');
});
