Cal Single Page App Status 
============

* pagination
  - change offset = 0 to be no offset
  - Found 25 events containing "ride". 
  -> Page 1 of 25+ events containing "ride". 

* fix the menu display -- try as tabs
* add pedalp info
* pedalp image should show whenever it appears in the week


[ ] pagination: 10 or 20 per page.  - i wonder if pagination might be able to be generic (re: search): ex. give page a count, and let shortcuts handle it. ( or a shared function )


### Favorites

[ ] sorting: time when favorited, event date;
    maybe those could be new buttons under the top bar of buttons on a new row.
[ ] filtering: show all, show future
[ ] an empty page should provide information about favoriting

[ ] a disclaimer about opening each one to see the latest information. * could maybe replace the current disclaimer? )
[ ] TODO: some sort of animation / popup when when favorite status changes
    -- maybe like some little ghost text that say "saved!" "removed!" and fades out -- hovers about the shortcut; but doesn't harm the layout --
    position relative or something.

[ ] handle errors on writing to local store; and simulate test it.
[ ] show a count of favorites over the icon?
[ ] show favored items on the cal list somehow?
[ ] future: server helper to quick update favorite status

##  Tasks:

* try an on-press popup, maybe covering the full scrolling view, for shortcut buttons. 
* export testing; maybe isn't working on the site? or in preview? or something?
* record all todos, tbds,s fixmes, etc.

* test the full event `contact` field. todo: find some real events that use it ( makeFake never sets it. )

* include this change: https://github.com/shift-org/shift-docs/pull/866
  ( Fallback error message if events request doesn't include JSON )

* are events earlier in the day than "now" are missing? ( seems to be working -- but could it scroll to "now" by default. )

* consider replacing "id" and "caldaily_id" with "seriesId" and "singleId" on fetch.

### Search
* expand search with max / offset

* TBD: search returns each caldaily; would it make more sense to have a new view that's a ride/series; and then on that page show all the times. ( and/ or group all the instances of that on the page )

### Styles 
* reduce the size of the shift logo ( ex. could it be a background image so that the gear can be behind/overlapping the button row )
* tbd: better header to indicate which subview ( favorites, search, etc. )
* too much space at top in chrome. http://localhost:3080/events/20691/breakfast-on-the-bridges
* should have a max width or something for desktop on details page
* how does it look if someone has their font size increased or decreased?
* TBD: should whole summary be clickable ( safety would only be clickable on details then )
* setup aria tags and info
* TBD: should the 'shift' logo link to anywhere? ( and what about when it shifts to pedalp )

## Future Tasks:
* event details context: show "TODAY" above time if its today; 
  some sort of "this event has passed" if its more than an hour ago
  "starting soon" if its near, or  "X days from now"

* implement favorites: button on list page shows your favorites; button on item page adds/removes to favorites. ( maybe you could use local storage for both queries and favorites )

* add "reoccur" links for each event ( might need server data for this )
* consider: a "featured events" page that shows the time / date / extra info that can include the menu's text, but also show when those events are.
* reuse the app somehow for preview event?
* consider redirecting existing urls to the single page app and trimming the old views.
* timeout/error for data fetches?
* consider blocking quick nav (left/right), etc. while loading.
* improve loading animation ( maybe don't hide the previous data while loading )
* server: consider linked lists for single events?
* server: consider a more focused "overview" endpoint; maybe with days grouped already.
* better communication if there is no next/prev event ( this would be a very rare edge case issue )
* todo: improve event details next/prev return point.
    currently you always return to the original week you came from
    shiftEvent could be smart, knowing when you've swapped weeks; updating calStart.
    ( noting that the 'start' can be any day of the week; so week is not always sunday )
    [ if return point is "now" shouldn't need to add start to it 
* todo: read https://vuejs.org/guide/best-practices/accessibility#semantic-forms for the toolbar.

* bikefun: lets you browse rides at a location
* bikefun: resources page with links to external sites 
* bikefun: cal reminders 

* hand it around for beta testing?
* add API_VERSION to data queries

Benefits:
----
* Modern javascript, no more jquery.
* Fewer production dependencies ( only: dayjs, vuejs, vue-router ), uses npm to manage versions, vite packs all dependencies into a single bundle.
* Separated from hugo, and easier to understand.
* More tailored to mobile displays; more app like; a defined place for "search" and "favorites"

Size Comparison
---
(  `npm run preview`, using http://localhost:3080/events/20691/breakfast-on-the-bridges )
vue:
* events: 8 requests, 298 kB transferred, 296 kB resources
* details: 8 requests, 326 kB transferred, 323 kB resources
 ( 88kb is new ride image header )

calendar on site:
* calendar: 28 requests, 301 kB transferred, 679 kB resources
* details: 25 requests; 272 kB transferred; 617 kB resources

Changes to main:
-----
* netlify build: changed to using npm for netlify build because it simplifies managing both hugo and vite; plus it means we can control the hugo version in package.json.
* netlify.toml: adds the /events/ path to the netlify redirects 
* node backend: adds the /events/ path for 'npm run dev'
* hugo: adds a shortcode to `_index.md` to generate a json summary of the menus and pedalp archives.

Meta Issues:
-------
* missing a place for news/ special info.
* missing a clear list of sponsors ( add to the "donate" page? )
* missing the owl carousel -- but it makes me kind of dizzy, so maybe that's okay.
* missing `<del>` for cancelled events, but i think that's okay.
* no query end date; query only has "start"; the events page always shows one complete week starting with today; and shifts forward/backwards to show the next week. ( i like this simplification, but it is different. )

Overview 
--------

* CalMain:
  * Banner: switches if detailed event or pedalp 
  * Toolbar: always the same
  * Menu: always the same 

  * Content: router switches on query and params
    * CalList: if start or no query
    * EventDetail: if caldaily set
    * Search: if query=q
    * Favorites: tab

  * QuickNav: switches on contents.
  
Font Awesome 
------
font awesome icons use svg and javascript to render. they have an adapter so they can be used as vue components.  https://docs.fontawesome.com/web/use-with/vue

npm i --save @fortawesome/vue-fontawesome@latest-3
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons

https://fontawesome.com/search?o=r&ic=free&s=solid&ip=classic
