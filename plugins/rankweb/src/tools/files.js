/**
 * RankWeb → Image SEO and → SEO CSV, native. Every write starts as a dry run (nothing is written and the report lists
 * the first changes); applying is a second step, behind a confirm that names how many items it will change.
 *
 * Image SEO: GET rankweb/v1/images, POST images/replace and images/captions. SEO CSV: GET seo-csv, POST seo-csv/import
 * (multipart: the file and apply). The CSV export is a download, so it is a link to the nonce'd admin-post address the
 * server gives (GET seo-csv → export).
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	ConfirmButton,
	ErrorState,
	Field,
	LoadingState,
	Notice,
	SectionCard,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js
import { Report, errText, num, path } from './common';

/**
 * Run a write that starts as a dry run, and keep its report. `run( apply )` returns the request.
 *
 * @return {Object} { report, busy, error, go( apply ), clear }.
 */
function useRun() {
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
function DryThenApply( { run, noun, start, dryText, disabled } ) {
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

/* ---------- Image SEO ---------- */

/**
 * One change a media tool lists: the attachment, the field, and before and after.
 *
 * @param {Object} c      { id, field, from, to }.
 * @param {Object} fields Field names by key.
 * @return {Element} A line.
 */
const mediaLine = ( c, fields ) => (
	<>
		<a href={ `post.php?post=${ c.id }&action=edit` }>#{ c.id }</a>{ ' ' }
		{ fields[ c.field ] || c.field }: { c.from ? `“${ c.from }”` : '–' } →{ ' ' }
		{ `“${ c.to }”` }
	</>
);

/**
 * Find and replace in alt text, title and caption.
 *
 * @param {Object} props
 * @param {Object} props.info GET images: { fields, batch, pattern }.
 */
function FindReplace( { info } ) {
	const [ v, setV ] = useState( {
		search: '',
		replace: '',
		regex: false,
		ci: false,
		fields: info.fields.filter( ( f ) => f.default ).map( ( f ) => f.key ),
	} );
	const run = useRun();
	const set = ( part ) => {
		run.clear();
		setV( ( o ) => ( { ...o, ...part } ) );
	};
	const names = Object.fromEntries(
		info.fields.map( ( f ) => [ f.key, f.label ] )
	);
	const start = ( apply ) =>
		apiFetch( {
			path: path( 'images/replace' ),
			method: 'POST',
			data: { ...v, apply },
		} );
	const checks = ( key, label ) => (
		<label key={ key } htmlFor={ `rankweb-img-${ key }` }>
			<input
				id={ `rankweb-img-${ key }` }
				type="checkbox"
				checked={ !! v[ key ] }
				onChange={ ( e ) => set( { [ key ]: e.target.checked } ) }
			/>{ ' ' }
			{ label }
		</label>
	);
	return (
		<SectionCard
			id="images-replace"
			title={ __( 'Find and replace', 'rankweb' ) }
			description={ sprintf(
				/* translators: %s: a number. */
				__(
					'Each run works on the %s most recent attachments.',
					'rankweb'
				),
				num( info.batch )
			) }
		>
			<Field
				label={ __( 'Find', 'rankweb' ) }
				render={ ( id ) => (
					<input
						id={ id }
						type="text"
						value={ v.search }
						onChange={ ( e ) => set( { search: e.target.value } ) }
					/>
				) }
			/>
			<Field
				label={ __( 'Replace with', 'rankweb' ) }
				render={ ( id ) => (
					<input
						id={ id }
						type="text"
						value={ v.replace }
						onChange={ ( e ) => set( { replace: e.target.value } ) }
					/>
				) }
			/>
			<fieldset className="kits-shell-checks">
				<legend className="kits-shell-field__label">
					{ __( 'Fields', 'rankweb' ) }
				</legend>
				{ info.fields.map( ( f ) => (
					<label key={ f.key } htmlFor={ `rankweb-img-f-${ f.key }` }>
						<input
							id={ `rankweb-img-f-${ f.key }` }
							type="checkbox"
							checked={ v.fields.includes( f.key ) }
							onChange={ ( e ) =>
								set( {
									fields: e.target.checked
										? [ ...v.fields, f.key ]
										: v.fields.filter(
												( k ) => k !== f.key
											),
								} )
							}
						/>{ ' ' }
						{ f.label }
					</label>
				) ) }
			</fieldset>
			<fieldset className="kits-shell-checks">
				<legend className="kits-shell-field__label">
					{ __( 'Options', 'rankweb' ) }
				</legend>
				{ checks( 'regex', __( 'Regular expression', 'rankweb' ) ) }
				{ checks( 'ci', __( 'Ignore case', 'rankweb' ) ) }
			</fieldset>
			{ run.error && <Notice tone="error">{ run.error }</Notice> }
			{ run.report && (
				<Report
					report={ run.report }
					noun={ __( 'attachments', 'rankweb' ) }
					line={ ( c ) => mediaLine( c, names ) }
					onClose={ run.clear }
				/>
			) }
			<DryThenApply
				run={ run }
				noun={ __( 'attachments', 'rankweb' ) }
				start={ start }
				dryText={ __( 'Dry run', 'rankweb' ) }
				disabled={ ! v.search }
			/>
		</SectionCard>
	);
}

/**
 * Fill missing captions from the pattern.
 *
 * @param {Object} props
 * @param {Object} props.info GET images: { fields, batch, pattern }.
 */
function Captions( { info } ) {
	const run = useRun();
	const names = Object.fromEntries(
		info.fields.map( ( f ) => [ f.key, f.label ] )
	);
	const start = ( apply ) =>
		apiFetch( {
			path: path( 'images/captions' ),
			method: 'POST',
			data: { apply },
		} );
	return (
		<SectionCard
			id="images-captions"
			title={ __( 'Fill missing captions', 'rankweb' ) }
			description={ sprintf(
				/* translators: %s: the caption pattern. */
				__(
					'Fills the caption of attachments that have none, from the pattern: %s. Existing captions are left alone. Change the pattern in RankWeb → Settings → Images.',
					'rankweb'
				),
				info.pattern
			) }
		>
			{ run.error && <Notice tone="error">{ run.error }</Notice> }
			{ run.report && (
				<Report
					report={ run.report }
					noun={ __( 'attachments', 'rankweb' ) }
					line={ ( c ) => mediaLine( c, names ) }
					onClose={ run.clear }
				/>
			) }
			<DryThenApply
				run={ run }
				noun={ __( 'attachments', 'rankweb' ) }
				start={ start }
				dryText={ __( 'Dry run', 'rankweb' ) }
			/>
		</SectionCard>
	);
}

export function Images() {
	const [ info, setInfo ] = useState( null );
	const [ error, setError ] = useState( '' );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'images' ) } )
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
			<FindReplace info={ info } />
			<Captions info={ info } />
		</>
	);
}

/* ---------- SEO CSV ---------- */

/**
 * Import a CSV: pick a file, dry run, then apply.
 *
 * @param {Object} props
 * @param {Object} props.info GET seo-csv: { columns, max_bytes, ... }.
 */
function Import( { info } ) {
	const [ file, setFile ] = useState( null );
	const [ pick, setPick ] = useState( 0 ); // changes with each file chosen: a new key for the file input
	const run = useRun();
	const start = ( apply ) => {
		const body = new FormData();
		body.append( 'aw_csv', file );
		body.append( 'apply', apply ? '1' : '0' );
		return apiFetch( {
			path: path( 'seo-csv/import' ),
			method: 'POST',
			body,
		} );
	};
	return (
		<SectionCard
			id="csv-import"
			title={ __( 'Import', 'rankweb' ) }
			description={ __(
				'Upload a CSV with an “id” column. Only the columns in the file are written; a blank cell clears that field. The dry run reports what would change and writes nothing.',
				'rankweb'
			) }
		>
			<Field
				label={ __( 'CSV file', 'rankweb' ) }
				help={ sprintf(
					/* translators: 1: the columns, 2: the size limit in MB. */
					__( 'Columns: %1$s. Up to %2$s MB.', 'rankweb' ),
					info.columns.join( ', ' ),
					num( info.max_bytes / 1048576 )
				) }
				render={ ( id, helpId ) => (
					<input
						key={ pick }
						id={ id }
						type="file"
						accept=".csv,text/csv"
						aria-describedby={ helpId }
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
					noun={ __( 'items', 'rankweb' ) }
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
				noun={ __( 'items', 'rankweb' ) }
				start={ start }
				dryText={ __( 'Dry run', 'rankweb' ) }
				disabled={ ! file }
			/>
		</SectionCard>
	);
}

export function SeoCsv() {
	const [ info, setInfo ] = useState( null );
	const [ error, setError ] = useState( '' );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'seo-csv' ) } )
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
			{ 0 === info.types.length && (
				<Notice tone="warning">
					{ __(
						'No post types are set for bulk SEO work (RankWeb → Settings → Bulk edit).',
						'rankweb'
					) }
				</Notice>
			) }
			<SectionCard
				id="csv-export"
				title={ __( 'Export', 'rankweb' ) }
				description={
					info.types.length
						? sprintf(
								/* translators: %s: post types, comma separated. */
								__(
									'Download every item’s SEO fields as a CSV (%s).',
									'rankweb'
								),
								info.types.map( ( t ) => t.label ).join( ', ' )
							)
						: __(
								'Download every item’s SEO fields as a CSV.',
								'rankweb'
							)
				}
			>
				<div>
					<Button href={ info.export }>
						{ __( 'Export CSV', 'rankweb' ) }
					</Button>
				</div>
			</SectionCard>
			<Import info={ info } />
		</>
	);
}
