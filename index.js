const clockString = () => new Date().toLocaleDateString(undefined, {"hour": "numeric", "minute": "numeric", "month": "long", "weekday": "long", "day": "numeric", "year": "numeric"})
let stopComplete = false

let bookmarks = {
	"codegolf": "https://codegolf.stackexchange.com/",
	"cloudflare": "https://www.cloudflare.com/",
	"bert": "http://bert.stuy.edu/pbrooks/",
	"somafm": "https://somafm.com/",
	"wolframalpha": "https://www.wolframalpha.com/",
}
let bangs = {
	"!g": {url: "https://www.google.com/search?q=", desc: "Google"},
	"!y": {url: "https://www.youtube.com/results?search_query=", desc: "YouTube"},
	"!d": {url: "https://duckduckgo.com/?q=", desc: "Duck Duck Go"},
	"!so": {url: "https://stackoverflow.com/search?q=", desc: "StackOverflow"},
	"!w": {url: "https://en.wikipedia.org/w/index.php?search=", desc: "Wikipedia"},
	"!aw": {url: "https://wiki.archlinux.org/index.php?search=", desc: "ArchWiki"},
	"!go": {url: "https://golang.org/pkg/", desc: "Go Package Documentation"},
	"!mdn": {url: "https://developer.mozilla.org/en-US/search?q=", desc: "MDN Documentation"}
}
Promise.all([browser.storage.sync.get("bangs"), browser.storage.sync.get("bookmarks")]).then(results => {
	console.log(results)
	if (results[0].bangs) bangs = results[0].bangs
	if (results[1].bookmarks) bookmarks = results[1].bookmarks
	setupAutocompleteElements()
})

function setupAutocompleteElements() {
	const bookmarksElement = document.getElementById("bookmarks")
	Object.keys(bookmarks).forEach(bookmark => {
		setupElement(bookmarksElement, bookmark, bookmark)
	})
	const bangsElement = document.getElementById("bangs")
	Object.keys(bangs).forEach(bang => {
		setupElement(bangsElement, `${bang} - ${bangs[bang].desc}`, bang)
	})
}

window.onload = () => {
	const date = document.getElementById("date")
	date.innerText = clockString()
	setInterval(() => date.innerText = clockString(), 60000)

	const searchInput = document.getElementById("search")
	searchInput.focus()
	searchInput.setAttribute("data-value", "Search")
	searchInput.addEventListener("input", e => {
		autocomplete(searchInput, Object.keys(bookmarks).concat(Object.keys(bangs)))
	})
	searchInput.addEventListener("keydown", e => {
		if (e.key === "Escape") {
			e.preventDefault()
			stopComplete = true
			searchInput.setAttribute("data-value", "")
		} else if (e.key === "Enter") {
			e.preventDefault()
			search(searchInput.innerText + searchInput.getAttribute("data-value"))
		} else if (e.key === "ArrowDown") {
			const correctElements = Array.from(document.querySelectorAll("#autocorrectResults span"))
				.filter(e => e.style.display === "block")
			if (correctElements.length > 0) {
				correctElements[0].focus()
			}
		}
	})
	searchInput.addEventListener("keyup", e => e.preventDefault())
}
function setupElement(parent, innerHTML, dv) {
	const newElement = document.createElement("span")
	newElement.setAttribute("class", "autocomplete")
	newElement.setAttribute("data-value", dv)
	newElement.setAttribute("tabindex", "0")
	newElement.innerHTML = innerHTML
	const search = document.getElementById("search")
	newElement.addEventListener("keydown", function(ev){ //need this
		if (ev.key === "ArrowDown") {
			const nextElements = getElements(false, this)
			if (nextElements.length > 1) {
				nextElements[1].focus()
			} else {
				search.focus()
			}
		} else if (ev.key === "ArrowUp") {
			const prevElements = getElements(true, this)
			if (prevElements.length > 0) {
				prevElements[prevElements.length - 1].focus()
			} else {
				search.focus()
			}
		} else if (ev.key === "Enter") {
			ev.preventDefault()
			if (bookmarks[this.getAttribute("data-value")]) {
				window.location.href = bookmarks[this.getAttribute("data-value")]
			} else { //must be bang, if changes change this
				search.innerHTML = this.getAttribute("data-value") + " "
				search.focus()
				const sel = window.getSelection()
				const range = document.createRange()
				range.setStart(search, 1)
				range.collapse(true)
				sel.removeAllRanges()
				sel.addRange(range)
				search.setAttribute("data-value", "")
			}
		}
	})
	parent.appendChild(newElement)
}
function getElements(beforeOrAfter, currElement) { //after = false, before = true
	return Array.from(document.querySelectorAll("#autocorrectResults span"))
		.filter(e => {
			if (e.style.display !== "block") return false
			if (e.getAttribute("data-value") === currElement.getAttribute("data-value")) {
				beforeOrAfter = !beforeOrAfter
			}
			if (beforeOrAfter) return true
		})
}

function search(term) {
	if (bookmarks[term.toLowerCase()]) {
		window.location.href = bookmarks[term.toLowerCase()]
		return
	} else {
		const prefix = term.toLowerCase().split(" ")[0]
		if (Object.keys(bangs).includes(prefix)) {
			window.location.href = bangs[prefix].url + encodeURIComponent(term.split(" ")[1])
			return
		}
		window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(term)
	}
}

function autocomplete(element, terms) {
	if (!stopComplete) {
		let gotTerm = false
		document.querySelectorAll(".autocomplete").forEach(e => e.style.display = "none")
		const value = element.innerText.toLowerCase()
		if (value.length > 0) {
			terms.forEach(e => {
				if (value === e.substring(0, value.length)) {
					gotTerm = true
					element.setAttribute("data-value", e.substring(value.length))
					document.querySelector(`.autocomplete[data-value="${e}"]`).style.display = "block"
				}
			})
		}
		if (!gotTerm) {
			element.setAttribute("data-value", "")
		}
	}
}


