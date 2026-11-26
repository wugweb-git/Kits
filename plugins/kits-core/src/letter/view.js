/**
 * Kits Letter (kits/letter), front end: builds the letter from the ticked grounds and the visitor's name, and hands it to
 * Gmail, the email app, or the clipboard. Nothing is sent from the site. Built by wp-scripts to build/letter/.
 */
/**
 * The letter text.
 *
 * @param {Object}   cfg     The block's settings (greeting, opening, closing, sign-off).
 * @param {string[]} grounds The ticked grounds.
 * @param {string}   name    The visitor's name.
 * @return {string} The letter.
 */
function build( cfg, grounds, name ) {
	const lines = [];
	if ( cfg.salute ) {
		lines.push( cfg.salute, '' );
	}
	if ( cfg.intro ) {
		lines.push( cfg.intro, '' );
	}
	grounds.forEach( ( g, i ) => lines.push( i + 1 + '. ' + g ) );
	if ( grounds.length ) {
		lines.push( '' );
	}
	if ( cfg.closing ) {
		lines.push( cfg.closing, '' );
	}
	if ( cfg.sign ) {
		lines.push( cfg.sign );
	}
	if ( name ) {
		lines.push( name );
	}
	return lines.join( '\n' );
}

function init( root ) {
	let cfg = {};
	try {
		cfg = JSON.parse( root.getAttribute( 'data-kits-letter' ) || '{}' );
	} catch {
		return;
	}
	const boxes = root.querySelectorAll( '.kits-letter__grounds input' );
	const nameEl = root.querySelector( '.kits-letter__name' );
	const text = root.querySelector( '.kits-letter__text' );
	const gmail = root.querySelector( '.kits-letter__gmail' );
	const mail = root.querySelector( '.kits-letter__mail' );
	const copy = root.querySelector( '.kits-letter__copy' );
	const status = root.querySelector( '[role="status"]' );
	const refresh = () => {
		const ticked = Array.from( boxes )
			.filter( ( b ) => b.checked )
			.map( ( b ) => b.value );
		const body = build( cfg, ticked, nameEl.value.trim() );
		text.value = body;
		const to = encodeURIComponent( cfg.to || '' );
		const su = encodeURIComponent( cfg.subject || '' );
		const bo = encodeURIComponent( body );
		gmail.href =
			'https://mail.google.com/mail/?view=cm&fs=1&to=' +
			to +
			'&su=' +
			su +
			'&body=' +
			bo;
		mail.href = 'mailto:' + to + '?subject=' + su + '&body=' + bo;
	};
	boxes.forEach( ( b ) => b.addEventListener( 'change', refresh ) );
	nameEl.addEventListener( 'input', refresh );
	copy.addEventListener( 'click', () => {
		const done = () => {
			status.textContent = 'Letter copied';
		};
		if ( navigator.clipboard ) {
			navigator.clipboard.writeText( text.value ).then( done );
		} else {
			text.removeAttribute( 'readonly' );
			text.select();
			document.execCommand( 'copy' );
			text.setAttribute( 'readonly', '' );
			done();
		}
	} );
	refresh();
}

document.querySelectorAll( '[data-kits-letter]' ).forEach( init );
