const defaultBangs = `{
	"!g": {"url": "https://www.google.com/search?q=", "desc": "Google"},
	"!y": {"url": "https://www.youtube.com/results?search_query=", "desc": "YouTube"},
	"!d": {"url": "https://duckduckgo.com/?q=", "desc": "Duck Duck Go"},
	"!so": {"url": "https://stackoverflow.com/search?q=", "desc": "StackOverflow"},
	"!w": {"url": "https://en.wikipedia.org/w/index.php?search=", "desc": "Wikipedia"},
	"!aw": {"url": "https://wiki.archlinux.org/index.php?search=", "desc": "ArchWiki"},
	"!go": {"url": "https://golang.org/pkg/", "desc": "Go Package Documentation"},
	"!mdn": {"url": "https://developer.mozilla.org/en-US/search?q=", "desc": "MDN Documentation"}
}`
const defaultBookmarks = `{
	"codegolf": "https://codegolf.stackexchange.com/",
	"cloudflare": "https://www.cloudflare.com/",
	"bert": "http://bert.stuy.edu/pbrooks/",
	"somafm": "https://somafm.com/",
	"wolframalpha": "https://www.wolframalpha.com/",
}`

window.onload = () => {
	Promise.all([browser.storage.sync.get("bangs"), browser.storage.sync.get("bookmarks")]).then(results => {
		document.querySelector("#bangs").value = results[0].bangs || defaultBangs
		document.querySelector("#bookmarks").value = results[1].bookmarks || defaultBookmarks
	})
	document.querySelector("form").addEventListener("submit", e => {
		e.preventDefault()
		const sBangs = document.querySelector("#bangs").value
		const sBookmarks = document.querySelector("#bookmarks").value
		let bookmarks = "", bangs = ""
		try {
			bangs = JSON.parse(sBangs)
		} catch(e) {
			alert("Error processing bangs: " + e)
		}
		try {
			bookmarks = JSON.parse(sBookmarks)
		} catch(e) {
			alert("Error processing bookmarks: " + e)
		}
		browser.storage.sync.set({bookmarks, bangs})
	})
}
