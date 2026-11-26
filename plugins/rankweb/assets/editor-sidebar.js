/**
 * RankWeb Gutenberg Block Editor Sidebar & Live SEO Score Engine.
 * Benchmark: Rank Math Pro / Yoast SEO.
 */
( function( wp ) {
	const { registerPlugin } = wp.plugins;
	// PluginSidebar moved from wp.editPost to wp.editor in WordPress 6.6; the old place only warns.
	const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editor && wp.editor.PluginSidebar ? wp.editor : wp.editPost;
	const { TextControl, TextareaControl, ToggleControl, SelectControl, Button } = wp.components;
	const { useSelect, useDispatch } = wp.data;
	const { useState, useEffect, createElement: el, Fragment } = wp.element;
	const { __, sprintf } = wp.i18n;
	const data = window.rankwebEditorData || {};
	// The site's own host, for internal/external link counts and the previews; no site name is hard-coded.
	const siteHost = data.siteHost || ( function() {
		try {
			return new URL( data.siteUrl || window.location.origin ).hostname.replace( /^www\./, '' );
		} catch ( e ) {
			return ( window.location && window.location.hostname ? window.location.hostname : '' ).replace( /^www\./, '' );
		}
	}() );
	const TITLE_MAX = 60;
	const DESC_MAX = 160;

	function escapeRe( v ) {
		return String( v ).replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
	}

	/** Parsed HTML when the browser offers a parser (null elsewhere, e.g. the unit test). */
	function parseHtml( html ) {
		return window.DOMParser ? new window.DOMParser().parseFromString( html || '', 'text/html' ) : null;
	}

	/** The text of the h2 to h4 headings in a block of HTML. */
	function headingText( html ) {
		const doc = parseHtml( html );
		if ( doc ) {
			return Array.prototype.map.call( doc.querySelectorAll( 'h2, h3, h4' ), function( h ) { return h.textContent.toLowerCase(); } );
		}
		return ( String( html || '' ).match( /<h[2-4][^>]*>[\s\S]*?<\/h[2-4]>/gi ) || [] ).map( function( h ) { return h.replace( /<[^>]*>/g, ' ' ).toLowerCase(); } );
	}

	/** Link counts split by whether the address is on this site. */
	function linkCounts( html ) {
		const doc = parseHtml( html );
		const hrefs = doc
			? Array.prototype.map.call( doc.querySelectorAll( 'a[href]' ), function( a ) { return a.getAttribute( 'href' ) || ''; } )
			: ( String( html || '' ).match( /href=["'][^"']*["']/gi ) || [] ).map( function( m ) { return m.slice( 6, -1 ); } );
		let internal = 0;
		let external = 0;
		hrefs.forEach( function( href ) {
			if ( /^https?:\/\//i.test( href ) ) {
				if ( siteHost && new RegExp( '^https?://(www\\.)?' + escapeRe( siteHost ) + '(?:[/:?#]|$)', 'i' ).test( href ) ) { internal++; } else { external++; }
			} else if ( href.charAt( 0 ) === '/' || href.charAt( 0 ) === '#' ) {
				internal++;
			}
		} );
		return { internal: internal, external: external };
	}

	function calculateSeoScore( title, content, keyword ) {
		let score = 10;
		if ( ! keyword || keyword.trim() === '' ) {
			return { score: 15, checks: [
				{ text: __( 'Set a Focus Keyword to enable comprehensive analysis', 'rankweb' ), pass: false }
			] };
		}

		const kw = keyword.toLowerCase().trim();
		const lcTitle = ( title || '' ).toLowerCase();
		const lcContent = ( content || '' ).toLowerCase();
		const plainContent = lcContent.replace( /<[^>]*>?/gm, ' ' );
		const wordCount = plainContent.trim().split( /\s+/ ).filter( Boolean ).length;

		const checks = [];

		// 1. Keyword in Title (+20)
		const kwInTitle = lcTitle.includes( kw );
		checks.push({
			text: kwInTitle ? __( 'Focus Keyword found in SEO Title', 'rankweb' ) : __( 'Add Focus Keyword to SEO Title', 'rankweb' ),
			pass: kwInTitle
		});
		if ( kwInTitle ) score += 20;

		// 2. Keyword in First 10% of Content (+15)
		const first100Words = plainContent.split( /\s+/ ).slice( 0, 100 ).join( ' ' );
		const kwInIntro = first100Words.includes( kw );
		checks.push({
			text: kwInIntro ? __( 'Focus Keyword used in the first 100 words', 'rankweb' ) : __( 'Include Focus Keyword near the beginning of your content', 'rankweb' ),
			pass: kwInIntro
		});
		if ( kwInIntro ) score += 15;

		// 3. Content Length (+20)
		const goodLength = wordCount >= 600;
		const okLength = wordCount >= 300;
		checks.push({
			text: goodLength ? sprintf( __( 'Content is %d words long (Good length)', 'rankweb' ), wordCount ) : sprintf( __( 'Content is %d words. Recommended is 600+ words', 'rankweb' ), wordCount ),
			pass: okLength
		});
		if ( goodLength ) score += 20;
		else if ( okLength ) score += 10;

		// 4. Keyword in Subheadings (+15)
		const kwInHeadings = headingText( content ).some( function( t ) { return t.includes( kw ); } );
		checks.push({
			text: kwInHeadings ? __( 'Focus Keyword found in H2/H3 subheadings', 'rankweb' ) : __( 'Use Focus Keyword in at least one subheading', 'rankweb' ),
			pass: kwInHeadings
		});
		if ( kwInHeadings ) score += 15;

		// 5. Internal Links (+10)
		const links = linkCounts( content );
		const internalLinkCount = links.internal;
		const hasInternal = internalLinkCount >= 2;
		checks.push({
			text: hasInternal ? sprintf( __( '%d internal links found', 'rankweb' ), internalLinkCount ) : __( 'Add at least 2 internal links to related content', 'rankweb' ),
			pass: hasInternal
		});
		if ( hasInternal ) score += 10;

		// 6. External Links (+10)
		const externalLinkCount = links.external;
		const hasExternal = externalLinkCount >= 1;
		checks.push({
			text: hasExternal ? sprintf( __( '%d authoritative external links found', 'rankweb' ), externalLinkCount ) : __( 'Add at least 1 external link to an authority source', 'rankweb' ),
			pass: hasExternal
		});
		if ( hasExternal ) score += 10;

		return {
			score: Math.min( 100, Math.max( 0, score ) ),
			checks: checks
		};
	}

	wp.rankweb = Object.assign( wp.rankweb || {}, { calculateSeoScore: calculateSeoScore } ); // read by tests/sidebar-score.test.js

	function RankWebSidebar() {
		const meta = useSelect( ( select ) => select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {} );
		const title = useSelect( ( select ) => select( 'core/editor' ).getEditedPostAttribute( 'title' ) || '' );
		const content = useSelect( ( select ) => select( 'core/editor' ).getEditedPostContent() || '' );
		const excerpt = useSelect( ( select ) => select( 'core/editor' ).getEditedPostAttribute( 'excerpt' ) || '' );
		const slug = useSelect( ( select ) => select( 'core/editor' ).getEditedPostAttribute( 'slug' ) || '' );
		const featuredId = useSelect( ( select ) => select( 'core/editor' ).getEditedPostAttribute( 'featured_media' ) || 0 );
		const featured = useSelect( ( select ) => ( featuredId ? select( 'core' ).getMedia( featuredId ) : null ), [ featuredId ] );
		const { editPost } = useDispatch( 'core/editor' );

		const [ previewMode, setPreviewMode ] = useState( 'desktop' );
		const keyword = meta.rank_math_focus_keyword || '';
		const schemaType = meta._rankweb_schema_type || ( data.postType === 'page' ? 'WebPage' : 'Article' );
		const schemaTypes = data.schemaTypes || [ 'Article', 'BlogPosting', 'NewsArticle', 'WebPage' ];
		const seoTitle = meta.rank_math_title || '';
		const seoDesc = meta.rank_math_description || '';
		const shownTitle = seoTitle || title;
		const plainContent = ( content || '' ).replace( /<[^>]*>?/gm, ' ' ).replace( /\s+/g, ' ' ).trim();
		const autoDesc = excerpt ? excerpt : plainContent;
		const shownDesc = seoDesc || ( autoDesc ? autoDesc.substring( 0, DESC_MAX - 5 ) + ( autoDesc.length > DESC_MAX - 5 ? '...' : '' ) : __( 'Add an excerpt or introduction to see the description here.', 'rankweb' ) );
		const imageUrl = featured && featured.source_url ? featured.source_url : '';

		const { score, checks } = calculateSeoScore( shownTitle, content, keyword );

		let scoreClass = 'rankweb-score-pill--bad';
		if ( score >= 80 ) scoreClass = 'rankweb-score-pill--good';
		else if ( score >= 50 ) scoreClass = 'rankweb-score-pill--ok';

		const base = data.siteUrl || '';
		const displayUrl = base + '/' + ( slug || 'sample-post' ) + '/';

		function setMeta( key, value ) {
			const next = {};
			next[ key ] = value;
			editPost( { meta: Object.assign( {}, meta, next ) } );
		}

		function counter( len, max ) {
			return el( 'span', { className: 'rankweb-count' + ( len > max ? ' rankweb-count--over' : '' ) }, sprintf( __( '%1$d of %2$d characters', 'rankweb' ), len, max ) );
		}

		return el(
			Fragment,
			null,
			el(
				PluginSidebarMoreMenuItem,
				{ target: 'rankweb-seo-sidebar', icon: 'search' },
				'RankWeb SEO'
			),
			el(
				PluginSidebar,
				{ name: 'rankweb-seo-sidebar', title: 'RankWeb SEO', icon: 'search' },
				el(
					'div',
					{ className: 'rankweb-sidebar-content' },
					el(
						'div',
						{ className: 'rankweb-score-card' },
						el( 'span', { className: 'rankweb-score-card__label' }, __( 'SEO Content Score', 'rankweb' ) ),
						el( 'span', { className: 'rankweb-score-pill ' + scoreClass }, score + ' / 100' )
					),
					el(
						TextControl,
						{
							label: __( 'SEO title', 'rankweb' ),
							value: seoTitle,
							placeholder: title,
							help: counter( shownTitle.length, TITLE_MAX ),
							onChange: function( v ) { setMeta( 'rank_math_title', v ); }
						}
					),
					el(
						TextareaControl,
						{
							label: __( 'Meta description', 'rankweb' ),
							value: seoDesc,
							help: counter( shownDesc.length, DESC_MAX ),
							onChange: function( v ) { setMeta( 'rank_math_description', v ); }
						}
					),
					el(
						TextControl,
						{
							label: __( 'Focus Keyword', 'rankweb' ),
							value: keyword,
							help: __( 'Enter the primary search query this post aims to rank for.', 'rankweb' ),
							onChange: function( nextValue ) {
								editPost( { meta: Object.assign( {}, meta, { rank_math_focus_keyword: nextValue, _rankweb_score: score } ) } );
							}
						}
					),
					el(
						SelectControl,
						{
							label: __( 'Structured Data Schema Type', 'rankweb' ),
							value: schemaType,
							help: __( 'Printed in the page\'s structured data (JSON-LD) when RankWeb writes the page head.', 'rankweb' ),
							options: schemaTypes.map( function( t ) { return { label: t, value: t }; } ),
							onChange: function( nextValue ) {
								editPost( { meta: Object.assign( {}, meta, { _rankweb_schema_type: nextValue } ) } );
							}
						}
					),
					el(
						ToggleControl,
						{
							label: __( 'Keep out of search results', 'rankweb' ),
							checked: '1' === meta._rankweb_noindex,
							help: __( 'Adds noindex and leaves the page out of the sitemap.', 'rankweb' ),
							onChange: function( on ) {
								editPost( { meta: Object.assign( {}, meta, { _rankweb_noindex: on ? '1' : '' } ) } );
							}
						}
					),
					el(
						ToggleControl,
						{
							label: __( 'Do not follow links on this page', 'rankweb' ),
							checked: '1' === meta._rankweb_nofollow,
							help: __( 'Adds nofollow: search engines are asked not to follow the links on the page.', 'rankweb' ),
							onChange: function( on ) {
								editPost( { meta: Object.assign( {}, meta, { _rankweb_nofollow: on ? '1' : '' } ) } );
							}
						}
					),
					el(
						ToggleControl,
						{
							label: __( 'Do not show a cached copy', 'rankweb' ),
							checked: '1' === meta._rankweb_noarchive,
							help: __( 'Adds noarchive.', 'rankweb' ),
							onChange: function( on ) {
								editPost( { meta: Object.assign( {}, meta, { _rankweb_noarchive: on ? '1' : '' } ) } );
							}
						}
					),
					el(
						ToggleControl,
						{
							label: __( 'Do not show a text snippet', 'rankweb' ),
							checked: '1' === meta._rankweb_nosnippet,
							help: __( 'Adds nosnippet. This also overrides the longest snippet below.', 'rankweb' ),
							onChange: function( on ) {
								editPost( { meta: Object.assign( {}, meta, { _rankweb_nosnippet: on ? '1' : '' } ) } );
							}
						}
					),
					el(
						TextControl,
						{
							label: __( 'Longest text snippet (characters)', 'rankweb' ),
							type: 'number',
							min: -1,
							value: meta._rankweb_max_snippet || '',
							help: __( 'Adds max-snippet. Leave empty for no rule, -1 for no limit.', 'rankweb' ),
							onChange: function( v ) {
								editPost( { meta: Object.assign( {}, meta, { _rankweb_max_snippet: v } ) } );
							}
						}
					),
					el(
						'div',
						{ style: { marginTop: '20px' } },
						el( 'strong', { style: { display: 'block', marginBottom: '8px' } }, __( 'Google SERP Preview', 'rankweb' ) ),
						el(
							'div',
							{ className: 'rankweb-mode', role: 'group', 'aria-label': __( 'Preview size', 'rankweb' ) },
							el( Button, { size: 'small', variant: previewMode === 'desktop' ? 'primary' : 'secondary', 'aria-pressed': previewMode === 'desktop', onClick: function() { setPreviewMode( 'desktop' ); } }, __( 'Desktop', 'rankweb' ) ),
							el( Button, { size: 'small', variant: previewMode === 'mobile' ? 'primary' : 'secondary', 'aria-pressed': previewMode === 'mobile', onClick: function() { setPreviewMode( 'mobile' ); } }, __( 'Mobile', 'rankweb' ) )
						),
						el(
							'div',
							{ className: 'rankweb-serp-preview' + ( previewMode === 'mobile' ? ' rankweb-serp-preview--mobile' : '' ) },
							el( 'div', { className: 'rankweb-serp-preview__url' }, displayUrl ),
							el( 'div', { className: 'rankweb-serp-preview__title' }, shownTitle || __( 'Post Title Example', 'rankweb' ) ),
							el( 'div', { className: 'rankweb-serp-preview__desc' }, shownDesc )
						)
					),
					el(
						'div',
						{ style: { marginTop: '20px' } },
						el( 'strong', { style: { display: 'block', marginBottom: '8px' } }, __( 'Social share preview', 'rankweb' ) ),
						el(
							'div',
							{ className: 'rankweb-social-preview' },
							imageUrl
								? el( 'img', { className: 'rankweb-social-preview__image', src: imageUrl, alt: '' } )
								: el( 'div', { className: 'rankweb-social-preview__image rankweb-social-preview__image--empty' }, __( 'No featured image: the share card falls back to the site image.', 'rankweb' ) ),
							el(
								'div',
								{ className: 'rankweb-social-preview__body' },
								el( 'div', { className: 'rankweb-social-preview__host' }, siteHost.toUpperCase() ),
								el( 'div', { className: 'rankweb-social-preview__title' }, shownTitle || __( 'Post Title Example', 'rankweb' ) ),
								el( 'div', { className: 'rankweb-social-preview__desc' }, shownDesc )
							)
						)
					),
					el(
						'div',
						{ style: { marginTop: '20px' } },
						el( 'strong', { style: { display: 'block', marginBottom: '10px' } }, __( 'SEO Checklist & Content Analysis', 'rankweb' ) ),
						el(
							'ul',
							{ className: 'rankweb-checklist' },
							checks.map( function( c, idx ) {
								return el(
									'li',
									{ key: idx, className: 'rankweb-check-item' },
									el(
										'span',
										{ className: 'rankweb-check-icon ' + ( c.pass ? 'rankweb-check-icon--pass' : 'rankweb-check-icon--fail' ) },
										c.pass ? '✓' : '✕'
									),
									el( 'span', null, c.text )
								);
							} )
						)
					)
				)
			)
		);
	}

	registerPlugin( 'rankweb-seo', {
		render: RankWebSidebar,
		icon: 'search'
	} );
} )( window.wp );
