// Runs assets/editor-sidebar.js against a stubbed `wp` and checks the score engine. Usage: node plugins/rankweb/tests/sidebar-score.test.js
const fs = require( 'fs' );
const path = require( 'path' );
const vm = require( 'vm' );

const wp = {
	plugins: { registerPlugin() {} },
	editPost: { PluginSidebar: {}, PluginSidebarMoreMenuItem: {} },
	components: { PanelBody: {}, TextControl: {}, SelectControl: {}, ButtonGroup: {}, Button: {} },
	data: { useSelect() {}, useDispatch() {} },
	element: { useState() {}, useEffect() {}, createElement() {}, Fragment: {} },
	i18n: {
		__: ( s ) => s,
		sprintf: ( f, ...a ) => { let i = 0; return f.replace( /%d|%s/g, () => String( a[ i++ ] ) ); },
	},
};
const ctx = { wp, window: { wp, rankwebEditorData: { siteUrl: 'https://example.org' }, location: { origin: 'https://example.org', hostname: 'example.org' } }, URL, console };
vm.createContext( ctx );
vm.runInContext( fs.readFileSync( path.join( __dirname, '../assets/editor-sidebar.js' ), 'utf8' ), ctx );
const score = wp.rankweb.calculateSeoScore;

let pass = 0, fail = 0;
const check = ( ok, name ) => { ok ? pass++ : fail++; console.log( ( ok ? '  ok  ' : 'FAIL  ' ) + name ); };
const words = ( n ) => Array( n ).fill( 'word' ).join( ' ' );

check( typeof score === 'function', 'score engine is exposed' );
check( score( 'T', '', '' ).score === 15, 'no keyword gives the base score of 15' );

// The original defect: sprintf was used without being imported, which threw once a keyword was set.
let r;
try { r = score( 'Dog adoption guide', '<p>' + words( 650 ) + '</p>', 'dog' ); check( true, 'a keyword no longer throws (sprintf imported)' ); } catch ( e ) { check( false, 'a keyword no longer throws: ' + e.message ); r = { score: 0, checks: [] }; }
check( r.checks.some( ( c ) => /650 words/.test( c.text ) ), 'word count is formatted into the message' );

const html = '<h2>All about dog care</h2><p>dog ' + words( 650 ) + ' <a href="/other/">a</a> <a href="https://example.org/x">b</a> <a href="https://other.test/y">c</a></p>';
r = score( 'Dog care', html, 'dog' );
check( r.checks.find( ( c ) => /subheading/.test( c.text ) ).pass, 'keyword inside an H2 counts' );
check( r.checks.find( ( c ) => /internal links/.test( c.text ) ).pass, 'relative and same-host links count as internal (2)' );
check( r.checks.find( ( c ) => /external links/.test( c.text ) ).pass, 'a different host counts as external' );

r = score( 'Dog care', '<h2>Unrelated heading</h2><p>dog ' + words( 650 ) + '</p>', 'dog' );
check( ! r.checks.find( ( c ) => /subheading/.test( c.text ) ).pass, 'keyword only in body text does not satisfy the subheading check (was loose before)' );

r = score( 'x', '<p>' + words( 10 ) + ' <a href="https://animalwrites.in/a">a</a></p>', 'zzz' );
check( r.checks.find( ( c ) => /external link/.test( c.text ) ).pass === true, 'animalwrites.in is just another external host now (no site name hard-coded)' );
check( r.score >= 0 && r.score <= 100, 'score stays within 0-100' );

console.log( `\n${ pass } passed, ${ fail } failed` );
process.exit( fail ? 1 : 0 );
