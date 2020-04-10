const defaultBangs = {
	"!g": {"url": "https://www.google.com/search?q=", "desc": "Google"},
	"!y": {"url": "https://www.youtube.com/results?search_query=", "desc": "YouTube"},
	"!d": {"url": "https://duckduckgo.com/?q=", "desc": "Duck Duck Go"},
	"!so": {"url": "https://stackoverflow.com/search?q=", "desc": "StackOverflow"},
	"!w": {"url": "https://en.wikipedia.org/w/index.php?search=", "desc": "Wikipedia"},
	"!aw": {"url": "https://wiki.archlinux.org/index.php?search=", "desc": "ArchWiki"},
	"!go": {"url": "https://golang.org/pkg/", "desc": "Go Package Documentation"},
	"!mdn": {"url": "https://developer.mozilla.org/en-US/search?q=", "desc": "MDN Documentation"}
}
const defaultBookmarks = {
	"codegolf": "https://codegolf.stackexchange.com/",
	"cloudflare": "https://www.cloudflare.com/",
	"bert": "http://bert.stuy.edu/pbrooks/",
	"somafm": "https://somafm.com/",
	"wolframalpha": "https://www.wolframalpha.com/",
}

//TODO: make smaller
function addBB(elSelector, inputs) {
	const newDiv = document.createElement("div")
	inputs.forEach(inputText => {
		const newInput = document.createElement("input")
		newInput.value = inputText
		newDiv.appendChild(newInput)
	})
	const removeButton = document.createElement("button")
	removeButton.innerHTML = "Remove"
	removeButton.addEventListener("click", function(){this.parentNode.remove()})
	newDiv.appendChild(removeButton)
	document.querySelector(elSelector).appendChild(newDiv)
}
window.onload = () => {
	Promise.all([browser.storage.sync.get("bangs"), browser.storage.sync.get("bookmarks")]).then(results => {
		Object.entries(results[0].bookmarks || defaultBookmarks).forEach(bookmark => {
			addBB("#bookmarks", bookmark)
		})
		Object.entries(results[1].bangs || defaultBangs).forEach(bang => {
			addBB("#bangs", [bang[0], bang[1].url, bang[1].desc])
		})
	})
	document.querySelector("#addBookmark").addEventListener("click", function(){
		addBB("#bookmarks", [this.parentNode.children[0].value, this.parentNode.children[1].value])
	})
	document.querySelector("#addBang").addEventListener("click", function(){
		addBB("#bangs", [this.parentNode.children[0].value, this.parentNode.children[1].value, this.parentNode.children[2].value])
	})
	document.querySelector("#submit").addEventListener("click", () => {
		const bookmarks = {}
		Array.from(document.querySelector("#bookmarks").children).forEach(bookmarkEl => {
			bookmarks[bookmarkEl.children[0].value] = bookmarkEl.children[1].value
		})
		const bangs = {}
		Array.from(document.querySelector("#bangs").children).forEach(bangEl => {
			bangs[bangEl.children[0].value] = {url: bangEl.children[1].value, desc: bangEl.children[2].value}
		})
		browser.storage.sync.set({bookmarks, bangs}).then(()=>alert("Success in saving settings")).catch(alert)
	})
}
