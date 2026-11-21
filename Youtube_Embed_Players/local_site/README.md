## Multi-perspective YouTube Player w/ buttons
* prefix first option with '?' 
* concatenate multiple url options with '&'
* options that need paramaters should declare 'name=value'

Video options include:
| option name | &nbsp;parameters&nbsp; | description |
| ---: | :---: | :---: |
| allowfullscreen | - | enables the button to toggle this button within the player |
| showplayer | integer: 0-15 | Generates specified player generations based on the binary conversion of this value (see table below) |
| muteads | - | automatically detects if the play time in the video doesn't match up with the buffer time and mutes the output |

### Examples:
* [./videos.html?allowfullscreen](https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/local_site/videos.html?allowfullscreen)
* [./videos.html?allowfullscreen&showplayer=5&muteads](https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/local_site/videos.html?allowfullscreen&showplayer=5&muteads)
* [./videos.html?showplayer=6](https://charliethunkman.github.io/HTML-JS-CSS_Projects/Youtube_Embed_Players/local_site/videos.html?showplayer=6)

  |showPlayer|  - 	| HC 	| HC & WN | WN 	|
  | ---: 	 | ---:	| ---: 	| ---: 	| ---: 	|
  | 	-	 | NaN	| 1 	| 3 	| 2 	|
  | Music Q  | 4 	| 5 	| 7 	| 6		|
  | mQ & AU  | 12 	| 13 	| 15	| 14	|
  | Among Us | 8  	| 9 	| 11	| 10	|
