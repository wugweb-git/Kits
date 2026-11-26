/**
 * What the native tool screens (FAQ, Internal links, Image SEO, SEO CSV, Redirect tools) share: the data the page
 * handed over, a route's path, an error as words, and the report a dry run or an apply sends back.
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Button, ConfirmButton, Notice } from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js

export const app = window.rankwebApp || {};

/**
 * A route's path, with the non-empty arguments as its query.
 *
 * @param {string} p    Route under rankweb/v1.
 * @param {Object} args Query arguments.
 * @return {string} The path for apiFetch.
 */
export const path = ( p, args = {} ) => {
	const q = Object.keys( args )
		.filter( ( k ) => '' !== args[ k ] && undefined !== args[ k ] )
		.map( ( k ) => `${ k }=${ encodeURIComponent( args[ k ] ) }` )
		.join( '&' );
	return `/${ app.rest }/${ p }${ q ? '?' + q : '' }`;
};

/**
 * An error as words.
 *
 * @param {*} e What was thrown.
 * @return {string} Its message.
 */
export const errText = ( e ) => e?.message || String( e );

/**
 * A dry run's or an apply's report: one notice that says what happened (a dry run says nothing was written), then the
 * lines it lists.
 *
 * @param {Object}   props
 * @param {Object}   props.report  { dry, updated | added, error, changes | lines, skipped }.
 * @param {string}   props.noun    What was changed, for the count ("attachments", "items", "redirects").
 * @param {Function} props.line    ( change ) => what to show for one listed change.
 * @param {Function} props.onClose Dismiss the report.
 */
export function Report( { report, noun, line, onClose } ) {
	if ( report.error ) {
		return (
			<Notice tone="error" onDismiss={ onClose }>
				{ report.error }
			</Notice>
		);
	}
	const n = Number( report.updated ?? report.added ?? 0 );
	const listed = report.changes || report.lines || [];
	return (
		<>
			<Notice
				tone={ report.dry ? 'info' : 'success' }
				onDismiss={ onClose }
			>
				{ report.dry
					? sprintf(
							/* translators: 1: number, 2: what would change (attachments, items, redirects). */
							__(
								'Dry run: %1$d %2$s would change. Nothing was written.',
								'rankweb'
							),
							n,
							noun
						)
					: sprintf(
							/* translators: 1: number, 2: what changed (attachments, items, redirects). */
							__( '%1$d %2$s changed.', 'rankweb' ),
							n,
							noun
						) }
			</Notice>
			{ listed.length > 0 && (
				<details open>
					<summary>
						<strong>{ __( 'Changes', 'rankweb' ) }</strong> (
						{ listed.length })
					</summary>
					<ul className="kits-shell-list">
						{ listed.map( ( c, i ) => (
							<li key={ i }>{ line( c ) }</li>
						) ) }
					</ul>
				</details>
			) }
			{ ( report.skipped || [] ).length > 0 && (
				<details open>
					<summary>
						<strong>{ __( 'Skipped', 'rankweb' ) }</strong> (
						{ report.skipped.length })
					</summary>
					<ul className="kits-shell-list">
						{ report.skipped.map( ( s, i ) => (
							<li key={ i }>{ s }</li>
						) ) }
					</ul>
				</details>
			) }
		</>
	);
}

/**
 * A count in the reader's number format.
 *
 * @param {number} n The count.
 * @return {string} The count as text.
 */
export const num = ( n ) => Number( n || 0 ).toLocaleString();

/**
 * Run a write that starts as a dry run, and keep its report. `run( apply )` returns the request.
 *
 * @return {Object} { report, busy, error, go( apply ), clear }.
 */
export function useRun() {
	const [ report, setReport ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const [ error, setError ] = useState( '' );
	const go = ( request ) => {
		setBusy( true );
		setError( '' );
		return request
			.then( setReport )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setBusy( false ) );
	};
	return { report, busy, error, go, clear: () => setReport( null ) };
}

/**
 * Dry run, then Apply: the second is a ConfirmButton that names how many items it will change, and shows only after a
 * dry run that found something. A change to the form clears the report, so Apply is never offered for a form that was
 * not the one dry-run.
 *
 * @param {Object}   props
 * @param {Object}   props.run      From useRun().
 * @param {string}   props.noun     What is changed ("attachments", "items").
 * @param {Function} props.start    ( apply ) => request.
 * @param {string}   props.dryText  The dry-run button's words.
 * @param {boolean}  props.disabled The form cannot be run yet.
 */
export function DryThenApply( { run, noun, start, dryText, disabled } ) {
	const found =
		run.report &&
		run.report.dry &&
		! run.report.error &&
		run.report.updated > 0;
	return (
		<div className="kits-shell-card__actions">
			<Button
				variant="primary"
				busy={ run.busy }
				disabled={ disabled }
				onClick={ () => run.go( start( false ) ) }
			>
				{ dryText }
			</Button>
			{ found && (
				<ConfirmButton
					label={ sprintf(
						/* translators: 1: number, 2: what changes (attachments, items). */
						__( 'Apply the %1$d %2$s', 'rankweb' ),
						run.report.updated,
						noun
					) }
					question={ sprintf(
						/* translators: %s: what changes (attachments, items); %%d is filled with the number. */
						__( 'This writes the changes to %%d %s.', 'rankweb' ),
						noun
					) }
					count={ run.report.updated }
					busy={ run.busy }
					onConfirm={ () => run.go( start( true ) ) }
				/>
			) }
		</div>
	);
}
