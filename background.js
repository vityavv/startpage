// Massive thanks to https://github.com/deadmund/Custom-New-Tab/blob/master/cnt-main-bg-script.js
browser.tabs.onCreated.addListener(nt => {
	console.log(nt.url, nt.openerTabId)
	if (nt.url === "about:newtab" && (typeof nt.openerTabId) === "undefined") {
		browser.tabs.create({openerTabId: nt.id, url: "index.html", active: true})
		browser.tabs.remove(nt.id)
	}
})
