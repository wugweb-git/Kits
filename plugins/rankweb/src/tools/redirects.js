/**
 * RankWeb → Redirect tools, native: export, import (a dry run first), Rank Math's 404 log, and RankWeb's block in
 * .htaccess. The one list of redirects stays in Rank Math → Redirections; these tools read and write that list.
 *
 * GET rankweb/v1/redirects, redirects/404; POST redirects/import (multipart: aw_csv and apply) and redirects/htaccess
 * ({ confirm, remove }: the server refuses without confirm, whatever this screen does). The exports are downloads: links
 * to the nonce'd admin-post addresses the server gives.
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	ConfirmButton,
	EmptyState,
	ErrorState,
	Field,
	LoadingState,
	Notice,
	RefTable,
	SectionCard,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js
import { DryThenApply, Report, errText, num, path, useRun } from './common';

/**
 * Import a redirects CSV: pick a file, dry run, then add the redirects.
 *
 * @param {Object} props
 * @param {Object} props.info GET redirects.
 */
function Import( { info } ) {
	const [ file, setFile ] = useState( null );
	const [ pick, setPick ] = useState( 0 ); // a new key for the file input when the report is closed
	const run = useRun();
	const start = ( apply ) => {
		const body = new FormData();
		body.append( 'aw_csv', file );
		body.append( 'apply', apply ? '1' : '0' );
		return apiFetch( {
			path: path( 'redirects/import' ),
			method: 'POST',
			body,
		} );
	};
	return (
		<SectionCard
			id="redirects-import"
			title={ __( 'Export and import', 'rankweb' ) }
			description={ __(
				'Import a CSV with a “source” column, and target, code (301, 302, 307, 308, 410, 451), comparison (exact or regex) and category (a label of your own; it stays in RankWeb; the Rank Math list is not changed). The dry run reports what would be added and writes nothing.',
				'rankweb'
			) }
			actions={
				<>
					<Button href={ info.export.redirects }>
						{ __( 'Export redirects CSV', 'rankweb' ) }
					</Button>
					<Button href={ info.export.log404 }>
						{ __( 'Export 404 log CSV', 'rankweb' ) }
					</Button>
				</>
			}
		>
			{ info.categories.length > 0 && (
				<p>
					{ __( 'Categories in the CSV:', 'rankweb' ) }{ ' ' }
					{ info.categories
						.map( ( c ) => `${ c.name } (${ num( c.count ) })` )
						.join( ', ' ) }
				</p>
			) }
			<Field
				label={ __( 'CSV file', 'rankweb' ) }
				render={ ( id ) => (
					<input
						key={ pick }
						id={ id }
						type="file"
						accept=".csv,text/csv"
						onChange={ ( e ) => {
							run.clear();
							setFile( e.target.files[ 0 ] || null );
						} }
					/>
				) }
			/>
			{ run.error && <Notice tone="error">{ run.error }</Notice> }
			{ run.report && (
				<Report
					report={ run.report }
					noun={ __( 'redirects', 'rankweb' ) }
					line={ ( c ) => c }
					onClose={ () => {
						run.clear();
						setPick( pick + 1 );
						setFile( null );
					} }
				/>
			) }
			<DryThenApply
				run={ run }
				noun={ __( 'redirects', 'rankweb' ) }
				start={ start }
				dryText={ __( 'Dry run', 'rankweb' ) }
				disabled={ ! file || ! info.ready }
			/>
		</SectionCard>
	);
}

/** Rank Math's 404 log: the most recent entries (the whole log is the CSV export). */
function Log404() {
	const [ log, setLog ] = useState( null );
	const [ error, setError ] = useState( '' );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'redirects/404' ) } )
			.then( setLog )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [] );
	let body;
	if ( error ) {
		body = <ErrorState message={ error } onRetry={ load } />;
	} else if ( ! log ) {
		body = <LoadingState />;
	} else if ( ! log.exists ) {
		body = (
			<EmptyState
				title={ __(
					'Rank Math keeps no 404 log on this site.',
					'rankweb'
				) }
			/>
		);
	} else if ( ! log.rows.length ) {
		body = <EmptyState title={ __( 'No 404s are logged.', 'rankweb' ) } />;
	} else {
		body = (
			<RefTable
				caption={ __( 'The most recent 404s', 'rankweb' ) }
				head={ [
					__( 'Address', 'rankweb' ),
					__( 'Hits', 'rankweb' ),
					__( 'Last seen', 'rankweb' ),
					__( 'Came from', 'rankweb' ),
				] }
				rows={ log.rows.map( ( r ) => [
					r.uri,
					num( r.hits ),
					r.last_seen,
					r.referer || '–',
				] ) }
			/>
		);
	}
	return (
		<SectionCard
			id="redirects-404"
			title={ __( '404 log', 'rankweb' ) }
			description={ __(
				'The 100 most recent addresses that answered “not found”, from Rank Math’s 404 monitor. Export the log for the rest.',
				'rankweb'
			) }
		>
			{ body }
		</SectionCard>
	);
}

/**
 * The .htaccess block: download it, or (when the setting is on and the server reads .htaccess) write or remove it
 * behind a confirm. The confirm is sent as a flag the server checks.
 *
 * @param {Object} props
 * @param {Object} props.info GET redirects.
 */
function Htaccess( { info } ) {
	const [ busy, setBusy ] = useState( false );
	const [ msg, setMsg ] = useState( null );
	const h = info.htaccess;
	const send = ( remove ) => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'redirects/htaccess' ),
			method: 'POST',
			data: { confirm: true, remove },
		} )
			.then( ( r ) =>
				setMsg(
					r.error
						? { tone: 'error', text: r.error }
						: { tone: 'success', text: r.ok }
				)
			)
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<SectionCard
			id="redirects-htaccess"
			title={ __( 'Apache .htaccess', 'rankweb' ) }
			description={ sprintf(
				/* translators: %d: number of redirects. */
				__(
					'%d exact redirects can go in .htaccess (regex rules stay in Rank Math).',
					'rankweb'
				),
				h.count
			) }
			actions={
				<Button href={ info.export.htaccess }>
					{ __( 'Download the .htaccess block', 'rankweb' ) }
				</Button>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ h.can ? (
				<div className="kits-shell-card__actions">
					<ConfirmButton
						label={ __( 'Write to .htaccess now', 'rankweb' ) }
						/* translators: %d: number of redirects. */
						question={ __(
							'Edit .htaccess? RankWeb writes %d exact redirects between its own markers. A backup is made first (.htaccess.rankweb-bak).',
							'rankweb'
						) }
						count={ h.count }
						tone="error"
						busy={ busy }
						onConfirm={ () => send( false ) }
					/>
					<ConfirmButton
						label={ __( 'Remove the block', 'rankweb' ) }
						/* translators: %d: number of blocks (always 1). */
						question={ __(
							'Edit .htaccess? RankWeb’s block is removed (%d block). A backup is made first.',
							'rankweb'
						) }
						count={ 1 }
						tone="error"
						busy={ busy }
						onConfirm={ () => send( true ) }
					/>
				</div>
			) : (
				<p className="kits-shell-field__help">
					{ __(
						'Writing to .htaccess is off, or this server is not Apache or LiteSpeed. Turn it on in RankWeb → Settings → Redirect tools. The downloaded block can be pasted by hand.',
						'rankweb'
					) }
				</p>
			) }
		</SectionCard>
	);
}

export function Redirects() {
	const [ info, setInfo ] = useState( null );
	const [ error, setError ] = useState( '' );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'redirects' ) } )
			.then( setInfo )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [] );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! info ) {
		return <LoadingState />;
	}
	return (
		<>
			<p>
				{ __(
					'Redirects live in Rank Math → Redirections. These tools read and write that one list.',
					'rankweb'
				) }
			</p>
			{ ! info.ready && (
				<Notice tone="warning">
					{ __(
						'Redirects need Rank Math with its Redirections module on. RankWeb keeps no redirect list of its own, so on this site importing, the .htaccess block and the 404 log do nothing, and no redirect is made.',
						'rankweb'
					) }
				</Notice>
			) }
			<Import info={ info } />
			<Log404 />
			<Htaccess info={ info } />
		</>
	);
}
