# Padamini

Padamini is a set of components that can be used/reused to create admin user interface. They are grouped by type on separate pages. Among the components are:

* listings (including grid/gallery view),
* drag and drop support on listings,
* forms (with validation states, field types, hints),
* flash messages,
* primary navigation (suitable for simple and complex menu),
* confirmation modals,
* login page,

so basically everything that is needed to create a complete CMS dashboard for small and medium-sized websites.

## Technical details

Markup is written in HTML5 with attention to semantics. CSS styles are constructed on the basis of [OOCSS](http://oocss.org/) to allow each component to be reused and extended.

### Browser support

Pages was tested on latest versions of Firefox, Opera, Safari, Chrome, and Internet Explorer 8+.

### Vendors

Padamini contains [Frontline](http://github.com/lamberski/frontline/) to separate and reuse common parts like header and footer (more info in its [readme](https://github.com/lamberski/frontline/blob/master/readme.md)). It can be easily removed by deleting */frontline* directory and *.htaccess* file.