var dnt = (navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack);
var doNotTrack = (dnt == "1" || dnt == "yes");
if (!doNotTrack) {


	var GAID = 'UA-24621973-1';

  // Legacy version of GA
  if (GAID.indexOf('UA-') === 0) {

	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	    ga('create', GAID, 'auto');
	    ga('set', 'anonymizeIp', true);
	    ga('send', 'pageview');

	// New version of GA
	// https://developers.google.com/analytics/devguides/collection/gtagjs/
  } else {

    var pa = document.createElement('script');
    pa.type = 'text/javascript';
    pa.async = true;
    pa.src = 'https://www.googletagmanager.com/gtag/js?id=' + GAID;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(pa, s);

		window.dataLayer = window.dataLayer || [];
  	function gtag(){dataLayer.push(arguments);}
  	gtag('js', new Date());
  	gtag('config', GAID);    
  }

}

const CSSTypedOM = (window.CSS && CSS.number) ? true : false;


////////////////////////////////
// GRID
////////////////////////////////

const gridItems = document.getElementsByClassName('grid-item');
const gridEvents = ['load', 'resize'];


function resizeGridItem(item) {
  const rowHeight = 8; // refer to grid-auto-rows data attribute of grid html
	const gridItem = item.getElementsByClassName('grid-item-content')[0];
	let gridItemHeight,
			rowSpan;

	if (CSSTypedOM) {
		gridItemHeight = gridItem.getBoundingClientRect().height;
		rowSpan = Math.ceil(gridItemHeight / rowHeight);
		item.attributeStyleMap.set('grid-row-end', `span ${rowSpan}`);
	} else {
		gridItemHeight = gridItem.getBoundingClientRect().height;
		rowSpan = Math.ceil(gridItemHeight / rowHeight);
		item.style.gridRowEnd = `span ${rowSpan}`;
	}
}

function resizeAllGridItems() {
  for(var i=0;i<gridItems.length;i++) {
		resizeGridItem(gridItems[i]);
  }
}


gridEvents.forEach(function(event) {
  window.addEventListener(event, resizeAllGridItems);
});


function init() {
	if (document.body.classList.contains('not-loaded')) {
		setTimeout(() => {
			document.body.classList.remove('not-loaded');
		}, 150);
	}

	initLazyLoading();
	initAutoHideNav();
	initTiltChildren();
}

document.addEventListener('DOMContentLoaded', init);



////////////////////////////////
// AUTO HIDE NAVIGATION
////////////////////////////////

class AutoHideNav {
	constructor(el, deltaYThreshold = 30) {
		this.nav = typeof el === "string" ? document.querySelector(el) : el;
		this.lastScrollY = 0;
		this.currentScrollY = 4;
		this.beginScrollUpY = 0;
		this.deltaYThreshold = deltaYThreshold;
		this.ticking = false;

		this.classes = {
			pinned: 'nav--pinned',
			unpinned: 'nav--unpinned'
		};

		this.enable();
	}

	enable() {
		this.events = {
			scroll: this.onScroll.bind(this),
			update: this.update.bind(this)
		};

		document.addEventListener('scroll', this.events.scroll, false);
	}

	onScroll() {
		this.currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
		this.requestTick();
	}
	
	requestTick() {
		if (!this.ticking) {
			requestAnimationFrame(this.events.update);
		}
		this.ticking = true;
	}
	
	update() {
		if (this.currentScrollY > this.lastScrollY ) {
			this.unpin();
			this.beginScrollUpY = false;
		} else {
			this.beginScrollUpY = (!this.beginScrollUpY) ? this.lastScrollY : this.beginScrollUpY;

			if (this.beginScrollUpY > (this.lastScrollY + this.deltaYThreshold)) {
				this.pin();
			}
		}
	
		this.lastScrollY = this.currentScrollY <= 0 ? 0 : this.currentScrollY;
		this.ticking = false;
	}
	
	pin() {
		if (this.nav.classList.contains(this.classes.unpinned)) {
			this.nav.classList.remove(this.classes.unpinned);
			this.nav.classList.add(this.classes.pinned);
		}
	}
	
	unpin() {
		if (this.nav.classList.contains(this.classes.pinned) || !this.nav.classList.contains(this.classes.unpinned)) {
			this.nav.classList.remove(this.classes.pinned);
			this.nav.classList.add(this.classes.unpinned);
		}
	}
}

function initAutoHideNav() {
	const nav = document.querySelector('body:not(.home):not(.disable-nav-hide) nav');
	if (typeof(nav) != 'undefined' && nav != null) {
		const navPin = new AutoHideNav(nav);
	}
}





////////////////////////////////
// QUOTES
////////////////////////////////


const growableContainer = document.querySelectorAll('.growable');
const quotes = document.querySelectorAll('.quote');

const GROWABLE_CLASS = 'growable'; 
const GROWABLE_CONTENT_CLASS = 'growable-content'; 
const GROWABLE_CONTENT_EXPANDED_CLASS = 'growable-content--expanded'; 
const GROWABLE_BUTTON_CLASS = 'growable-button'; 


if (growableContainer.length) {
	growableContainer.forEach(container => {
		const button = container.querySelector(`.${GROWABLE_BUTTON_CLASS}`);
		button.addEventListener('click', function(event) {
			event.stopPropagation();
			toggleGrowable(container);
		});
	});
}

quotes.forEach((quote) => {
  quote.addEventListener('click', function() {
		const activeQuote = document.querySelector('.quote--open');
		const growableContainer = quote.closest(`.${GROWABLE_CLASS}`);
		let growableContent, growableContentExpanded;

		if (growableContainer !== null) {
			growableContent = quote.closest(`.${GROWABLE_CONTENT_CLASS}`);
			growableContentExpanded = growableContent.classList.contains(GROWABLE_CONTENT_EXPANDED_CLASS);
		}
		
		if (quote !== activeQuote) {
			collapseAllQuotes()
			quote.classList.add('quote--open');
		} else {
			quote.classList.remove('quote--open');
		}

    if (!growableContentExpanded) {
			toggleGrowable(growableContainer);
		} else {
			resizeGridItem(growableContainer.closest('.grid-item'));
		}

  });
});

function collapseAllQuotes() {
	quotes.forEach((quote) => {
		if (quote.classList.contains('quote--open')) {
			quote.classList.remove('quote--open');
		}
	});
}

function toggleGrowable(_container) {	
	if (_container !== null) {
		const content = _container.querySelector(`.${GROWABLE_CONTENT_CLASS}`);
		const isExpanded = content.classList.contains(GROWABLE_CONTENT_EXPANDED_CLASS);
		if (isExpanded) {
			collapseAllQuotes();
		}

		content.classList.toggle(GROWABLE_CONTENT_EXPANDED_CLASS);
		resizeGridItem(_container.closest('.grid-item'));
	}
}





////////////////////////////////
// LAZY LOADING
////////////////////////////////

function initLazyLoading() {
  var lazyVideos = [].slice.call(document.querySelectorAll('video.lazy'));
	var lazyBackgrounds = [].slice.call(document.querySelectorAll('.lazy-bg'));

  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
					if (entry.target.classList.contains('flipbook__page-back')) {
						entry.target.closest('.flipbook').classList.add('flipbook--animate');
					} else {
						entry.target.classList.add('lazy-bg--visible');
					}
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
    
    var lazyVideoObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === 'string' && videoSource.tagName === 'SOURCE') {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove('lazy');
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
}




////////////////////////////////
// EXTERNAL LINK TILTING
////////////////////////////////


class Tilt {
	constructor(el, isLink = false) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
		this.isLink = isLink;
		this.ticking = false;
		this.transition = 'transform 0.2s ease';

		this.enable();
	}
	
	enable() {
		this.events = {
			move: this.onMouseMove.bind(this),
			enter: this.onMouseEnter.bind(this),
			leave: this.onMouseLeave.bind(this),
			update: this.update.bind(this),
		};
		
		let icon;
		
		if (this.isLink) {
			icon = document.createElement('div');
			icon.classList = 'external-link-icon';
			this.el.appendChild(icon);
			this.icon = icon;
		} else {
			this.icon = this.el.querySelector('.js-tilt-child');
		}

		document.addEventListener('mousemove', this.events.move, false);
		this.el.addEventListener('mouseenter', this.events.enter, false);
		this.el.addEventListener('mouseleave', this.events.leave, false);
	}
	
	disable() {
		document.removeEventListener('mousemove', this.events.move);
		this.el.removeEventListener('mouseenter', this.events.enter);
		this.el.removeEventListener('mouseleave', this.events.leave);
	}
	
	update(e) {
		if (e.type == 'mouseenter') {
			if(CSSTypedOM) {
				this.icon.attributeStyleMap.set('transition', this.transition);
			} else {
				this.icon.style.transition = this.transition;
			}
		} else if (e.type == 'mouseleave') {
			clearTimeout(this.int);

			if(CSSTypedOM) {
				this.icon.attributeStyleMap.set('transform', new CSSTranslate(CSS.px(0), CSS.px(0), CSS.px(0)));
				this.icon.attributeStyleMap.set('transition', this.transition);
			} else {
				this.icon.style.transform = 'translate3d(0,0,0)';
				this.icon.style.transition = this.transition;
			}

			this.intersected = false;
		} else if (e.type == 'mousemove') {
			this.position = {
				x: e.pageX,
				y: e.pageY
			};
			
			this.transform = {
				x: (((this.position.x - this.rect.x1) - (this.rect.width)) * 0.05).toFixed(1),
				y: (((this.position.y - this.rect.y1) - (this.rect.height)) * 0.05).toFixed(1)
			};
			
			this.isIntersecting = this.intersects();
			
			if (this.isIntersecting) {
				if (CSSTypedOM) {
					const transform = new CSSTranslate(CSS.px(this.transform.x), CSS.px(this.transform.y), CSS.px(0));
					this.icon.attributeStyleMap.set('transform', transform);
				} else {
					this.icon.style.transform = `translateX(${this.transform.x}px) translateY(${this.transform.y}px)`;
				}
	
				if (!this.intersected) {
					if(CSSTypedOM) {
						this.icon.attributeStyleMap.set('transition', this.transition);
					} else {
						this.icon.style.transition = this.transition;
					}

					this.int = setTimeout(() => {
						if(CSSTypedOM) {
							this.icon.attributeStyleMap.set('transition', 'none');
						} else {
							this.icon.style.transition = 'none';
						}
						this.intersected = true;
					}, 200);
				} else {
					if(CSSTypedOM) {
						this.icon.attributeStyleMap.set('transition', 'none');
					} else {
						this.icon.style.transition = 'none';
					}
				}
			} else {
				clearTimeout(this.int);

				if(CSSTypedOM) {
					this.icon.attributeStyleMap.set('transform', new CSSTranslate(CSS.px(0), CSS.px(0), CSS.px(0)));
					this.icon.attributeStyleMap.set('transition', this.transition);
				} else {
					this.icon.style.transform = 'translate3d(0,0,0)';
					this.icon.style.transition = this.transition;
				}

				this.intersected = false;
			}
		}

		this.ticking = false;
	}

	
	requestTick(e) {
		if (!this.ticking) {
			requestAnimationFrame(() => this.events.update(e));
		}
		this.ticking = true;
	}
	
	onMouseEnter(e) {
		this.requestTick(e);
	}
	
	onMouseLeave(e) {
		this.requestTick(e);
	}	
	
	onMouseMove(e) {
		this.isIntersecting = true;
		this.rect = this.getRect(this.el);

		this.requestTick(e);
	}
	
	intersects() {
		return this.position.x > this.rect.x1 &&
						this.position.x < this.rect.x2 &&
						this.position.y > this.rect.y1 &&
						this.position.y < this.rect.y2;
	}
	
	getRect(e) {
			var t = window,
					o = e.getBoundingClientRect(),
					b = document.documentElement || body.parentNode || body,
					d = (void 0 !== t.pageXOffset) ? t.pageXOffset : b.scrollLeft,
					n = (void 0 !== t.pageYOffset) ? t.pageYOffset : b.scrollTop;
			return {
					x1: o.left + d,
					y1: o.top + n,
					x2: o.left + o.width + n,
					y2: o.top + o.height + n,
					height: Math.round(o.height),
					width: Math.round(o.width)
			}		
	}
}

function initTiltChildren() {
	const tiltNodes = document.querySelectorAll('.external-link');
	const tiltNodesLen = tiltNodes.length;
	for (let b = 0; tiltNodesLen > b; b++) {
		var tilt = new Tilt(tiltNodes[b], true);
	}
	
	const oddsEndsTiltNodes = document.querySelectorAll('.odds-ends');
	const oddsEndsTiltNodesLen = oddsEndsTiltNodes.length;
	for (let b = 0; oddsEndsTiltNodesLen > b; b++) {
		var tilt = new Tilt(oddsEndsTiltNodes[b], false);
	}
}



document.onreadystatechange = function () {
  if (document.readyState === 'interactive' && document.body.classList.contains('home')) {
		var homeVideos = document.querySelectorAll('.odds-ends video');
		var videosPromise = homeVideos[0].play();
		homeVideos[1].play();

		if (videosPromise !== undefined) {
			videosPromise.then(_ => {
				// Autoplay successful
			}).catch(error => {
				homeVideos.forEach(video => {
					var picture = video.parentNode.querySelector('picture');
					video.remove();

					for (var source in picture.children) {
						var pictureSource = picture.children[source];
						if (typeof pictureSource.tagName === 'string' && pictureSource.tagName === 'SOURCE') {
							pictureSource.srcset = pictureSource.dataset.srcset;
						} else if (typeof pictureSource.tagName === 'string' && pictureSource.tagName === 'IMG') {
							pictureSource.src = pictureSource.dataset.src;
						}
					}
					picture.style.display = 'block';
				});
			});
		}
  }
}