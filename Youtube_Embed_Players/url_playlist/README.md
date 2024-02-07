# HTML-JS-CSS_Projects
Instructions on how to customize your experience.

1) Visit the host site https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/url_playlist/video.html?

2) After the question mark in the URL, add in any of the following parameters, seperated by the `&` character if multiple:
	* `allowFullScreen` to enable the native fullscreen functionality
	* `list=` followed by the playlist ID on the youtube website or app. (34 characters long)
		*  To find this value, navigate to the desired playlist, click `Share` and `Copy Link`. Paste it on another tab and copy the `list` parameter up to the next `&` character.
  		*  For example, the default playlist "https://www.youtube.com/embed/videoseries?enablejsapi=1&fs=0&list=PLoSIOFPSXQoN9mz00ZrI1a7ZW5aqPFVq-&si=6h6TB8LnGt" only `list=PLoSIOFPSXQoN9mz00ZrI1a7ZW5aqPFVq-` is needed for the full parameter

### Examples:

https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/url_playlist/video.html?allowFullScreen&list=PLuXaDdOtKhFeu-eIaEG63-qVwt2DUO8tA
https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/url_playlist/video.html?list=PLuXaDdOtKhFeu-eIaEG63-qVwt2DUO8tA
https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/url_playlist/video.html?list=PLuXaDdOtKhFdgYYaZ5SmkxqHntujrS73k&allowFullScreen
