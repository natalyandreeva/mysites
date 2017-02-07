// ��� �������� ������ ������ ������� ������������ � �����

// ������� �������������� ������� ���������� ����� � ��������
function add_favorite(a) { 
  title=document.title; 
  url=document.location; 
  try { 
    // Internet Explorer 
    window.external.AddFavorite(url, title); 
  } 
  catch (e) { 
    try { 
      // Mozilla 
      window.sidebar.addPanel(title, url, ""); 
    } 
    catch (e) { 
      // Opera � Firefox 23+ 
      if (typeof(opera)=="object" || window.sidebar) { 
        a.rel="sidebar"; 
        a.title=title; 
        a.url=url; 
        a.href=url; 
        return true; 
      } 
      else { 
        // Unknown 
        alert('������� Ctrl+D ����� �������� �������� � ��������'); 
      } 
    } 
  } 
  return false; 
}
// ����� "���������� ���"
function start() {

	var accelerator = document.getElementById('accelerator');

	var img1 = document.getElementById('image1');
	var img2 = document.getElementById('image2');
	var img3 = document.getElementById('image3');

	document.getElementById('button').className = '';

	addEvent(accelerator, 'click', acceleratorClick);

	function acceleratorClick(e) {
		img1.className= 'hidden';
		img2.className= '';
		removeEvent(accelerator, 'click');
		setTimeout(show_img3, 2000);
	}

	function show_img3() {
		img2.className= 'hidden';
		img3.className= '';
		setTimeout(restart, 5000);
	}

	function restart() {
		img3.className= 'hidden';
		img1.className= '';
		addEvent(accelerator, 'click', acceleratorClick);
	}
}

function addEvent(elem, type, handler) {
  if (elem.addEventListener) {
    elem.addEventListener(type, handler, false)
  } else {
    elem.attachEvent("on"+type, handler)
  }
}

function removeEvent(elem, type) {
  if (elem.removeEventListener) {
    elem.removeEventListener(type, null, false)
  } else {
    elem.detachEvent("on"+type, null)
  }
}
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */
( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}
function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}
var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
// browser global
  window.classie = classie;
}

})( window );

/**
 * cbpFWTabs.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function CBPFWTabs( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	CBPFWTabs.prototype.options = {
		start : 0
	};

	CBPFWTabs.prototype._init = function() {
		// tabs elems
		this.tabs = [].slice.call( this.el.querySelectorAll( 'div > ul > li' ) );
		// content items
		this.items = [].slice.call( this.el.querySelectorAll( '.content-wrap > section' ) );
		// current index
		this.current = -1;
		// show current content item
		this._show();
		// init events
		this._initEvents();
	};

	CBPFWTabs.prototype._initEvents = function() {
		var self = this;
		this.tabs.forEach( function( tab, idx ) {
			tab.addEventListener( 'click', function( ev ) {
				ev.preventDefault();
				self._show( idx );
			} );
		} );
	};

	CBPFWTabs.prototype._show = function( idx ) {
		if( this.current >= 0 ) {
			this.tabs[ this.current ].className = this.items[ this.current ].className = '';
		}
		// change current
		this.current = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.items.length ? this.options.start : 0;
		this.tabs[ this.current ].className = 'tab-current';
		this.items[ this.current ].className = 'content-current';
	};

	// add to global namespace
	window.CBPFWTabs = CBPFWTabs;

})( window );
(function() {
[].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
new CBPFWTabs( el );
});
})();

// ������� ����������� ��������� ����� � ����������� �������� accordion-group
	$(document).ready(function(){
		if(window.location.hash) {
			$(window.location.hash).collapse('show').prev().addClass('attract');
			$('html,body').animate({
					scrollTop: $(window.location.hash).offset().top - 40},
				'slow');
		}
	})