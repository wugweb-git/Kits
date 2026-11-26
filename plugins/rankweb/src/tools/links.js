/**
 * RankWeb → Internal links, native: the audit (findings, Run the audit now), the anchor mix and the silos. Data from
 * rankweb/v1/links (audit), links/summary, links/audit, links/anchors and links/silos (GET to read; POST and DELETE
 * change a silo, administrators only).
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	ChipRow,
	ConfirmButton,
	DataList,
	EmptyState,
	ErrorState,
	Field,
	LoadingState,
	Notice,
	SectionCard,
	Select,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js
import { app, errText, num, path } from './common';

const admin = !! app.canSwitch;

/**
 * The words for an audit's state: running, last run, or not run yet.
 *
 * @param {Object} sum The audit summary.
 * @return {string} One line.
 */
function auditLine( sum ) {
	const prog = sum.progress || {};
	if ( prog.running ) {
		const steps = {
			collect: __( 'reading the items', 'rankweb' ),
			check: __( 'checking addresses', 'rankweb' ),
		};
		const step =
			steps[ prog.phase ] || __( 'working out the results', 'rankweb' );
		return sprintf(
			/* translators: 1: step (reading the items, checking addresses or working out the results), 2: items done, 3: items in all. */
			__( 'Audit running: %1$s (%2$s of %3$s items).', 'rankweb' ),
			step,
			num( prog.done ),
			num( prog.total )
		);
	}
	if ( sum.at ) {
		return sprintf(
			/* translators: 1: date and time, 2: items audited, 3: items with a finding. */
			__(
				'Last audit %1$s: %2$s items, %3$s with a finding.',
				'rankweb'
			),
			new Date( sum.at * 1000 ).toLocaleString(),
			num( sum.items ),
			num( sum.flagged )
		);
	}
	return __( 'The audit has not run yet. It runs once a day.', 'rankweb' );
}

/**
 * The item as a title that opens its edit screen.
 *
 * @param {Object} props
 * @param {Object} props.r A row: { title, edit }.
 */
function ItemCell( { r } ) {
	return (
		<>
			{ r.edit ? (
				<a href={ r.edit }>
					<strong>
						{ r.title || __( '(no title)', 'rankweb' ) }
					</strong>
				</a>
			) : (
				<strong>{ r.title || __( '(no title)', 'rankweb' ) }</strong>
			) }
		</>
	);
}

/* ---------- Audit ---------- */

function Audit() {
	const [ flag, setFlag ] = useState( '' );
	const [ page, setPage ] = useState( 1 );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const [ watching, setWatching ] = useState( 0 ); // until when (ms) to keep asking how the audit is doing
	const seenRunning = useRef( false );

	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'links', { flag, page } ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ flag, page ] );
	useEffect( load, [ load ] );

	// While an audit runs (or has just been started: it begins in a few seconds) ask for its state every 5 seconds, and
	// load the findings again once it has finished.
	const running = !! data?.summary?.progress?.running;
	useEffect( () => {
		if ( ! running && Date.now() > watching ) {
			if ( seenRunning.current ) {
				seenRunning.current = false;
				load();
			}
			return undefined;
		}
		seenRunning.current = seenRunning.current || running;
		const t = setTimeout( () => {
			apiFetch( { path: path( 'links/summary' ) } )
				.then( ( summary ) =>
					setData( ( d ) => ( d ? { ...d, summary } : d ) )
				)
				.catch( () => {} );
		}, 5000 );
		return () => clearTimeout( t );
	}, [ running, watching, data?.summary, load ] );

	const start = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( { path: path( 'links/audit' ), method: 'POST' } )
			.then( ( summary ) => {
				setData( ( d ) => ( d ? { ...d, summary } : d ) );
				setWatching( Date.now() + 90000 );
				setMsg( {
					tone: 'info',
					text: __(
						'The audit starts in a few seconds and runs in the background.',
						'rankweb'
					),
				} );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};

	const sum = data?.summary;
	const by = sum?.by || {};
	const labels = data?.labels || {};
	const views = sum
		? [
				{
					value: '',
					label: __( 'All findings', 'rankweb' ),
					count: num( sum.flagged ),
				},
				...Object.keys( labels ).map( ( k ) => ( {
					value: k,
					label: labels[ k ],
					count: num( by[ k ] || 0 ),
				} ) ),
			]
		: [];

	return (
		<SectionCard
			id="links-audit"
			title={ __( 'Audit', 'rankweb' ) }
			description={ sum ? auditLine( sum ) : '' }
			actions={
				admin ? (
					<Button busy={ busy || running } onClick={ start }>
						{ __( 'Run the audit now', 'rankweb' ) }
					</Button>
				) : null
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ data && false === data.has_types && (
				<Notice tone="warning">
					{ __(
						'No post type is linked yet, so there is nothing to audit. Add post types under RankWeb → Settings → Internal links.',
						'rankweb'
					) }
				</Notice>
			) }
			<DataList
				label={ __( 'Findings', 'rankweb' ) }
				rowKey="post_id"
				columns={ [
					{
						key: 'title',
						label: __( 'Item', 'rankweb' ),
						primary: true,
						render: ( r ) => <ItemCell r={ r } />,
					},
					{
						key: 'links_in',
						label: __( 'Links in', 'rankweb' ),
						render: ( r ) => num( r.links_in ),
					},
					{
						key: 'links_out',
						label: __( 'Links out', 'rankweb' ),
						render: ( r ) => num( r.links_out ),
					},
					{
						key: 'depth',
						label: __( 'Clicks from home', 'rankweb' ),
						render: ( r ) =>
							r.depth
								? num( r.depth )
								: __( 'Not reached', 'rankweb' ),
					},
					{
						key: 'flags',
						label: __( 'Findings', 'rankweb' ),
						render: ( r ) => (
							<ul className="kits-shell-list">
								{ r.flags.map( ( f ) => (
									<li key={ f }>
										{ labels[ f ] || f }
										{ ( r.detail?.[ f ] || [] ).length >
											0 && (
											<>
												{ ': ' }
												{ r.detail[ f ].join( ', ' ) }
											</>
										) }
									</li>
								) ) }
							</ul>
						),
					},
				] }
				rows={ data?.items || [] }
				total={ data?.total || 0 }
				page={ data?.page || 1 }
				pages={ data?.pages || 1 }
				onPage={ setPage }
				views={ views }
				view={ flag }
				onView={ ( f ) => {
					setPage( 1 );
					setFlag( f );
				} }
				rowActions={ ( r ) => [
					...( r.edit
						? [
								{
									icon: 'edit',
									label: __( 'Edit', 'rankweb' ),
									href: r.edit,
								},
							]
						: [] ),
					...( r.url
						? [
								{
									icon: 'view',
									label: __( 'View', 'rankweb' ),
									href: r.url,
								},
							]
						: [] ),
				] }
				loading={ loading && ! data }
				error={ error }
				onRetry={ load }
				emptyTitle={
					sum?.at
						? __( 'Nothing to list here.', 'rankweb' )
						: __( 'The audit has not run yet.', 'rankweb' )
				}
			/>
		</SectionCard>
	);
}

/* ---------- Anchor mix ---------- */

function Anchors() {
	const [ warn, setWarn ] = useState( false );
	const [ page, setPage ] = useState( 1 );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );

	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( {
			path: path( 'links/anchors', { warn: warn ? 1 : 0, page } ),
		} )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ warn, page ] );
	useEffect( load, [ load ] );

	const labels = data?.labels || {};
	const limits = data?.limits || {};
	return (
		<SectionCard
			id="links-anchors"
			title={ __( 'Anchor mix', 'rankweb' ) }
			description={
				data
					? sprintf(
							/* translators: 1: limit for exact match in percent, 2: limit for any other type in percent, 3: fewest links. */
							__(
								'The share of each anchor type among the links to an item. A warning shows when exact match is over %1$s%% or another type is over %2$s%% (only for items with %3$s links or more). Change the limits under RankWeb → Settings → Internal links.',
								'rankweb'
							),
							num( limits.exact_max ),
							num( limits.type_max ),
							num( limits.min_links )
						)
					: ''
			}
		>
			<DataList
				label={ __( 'Anchor mix by item', 'rankweb' ) }
				rowKey="post_id"
				columns={ [
					{
						key: 'title',
						label: __( 'Item', 'rankweb' ),
						primary: true,
						render: ( r ) => <ItemCell r={ r } />,
					},
					{
						key: 'total',
						label: __( 'Links in', 'rankweb' ),
						render: ( r ) => num( r.total ),
					},
					...Object.keys( labels ).map( ( t ) => ( {
						key: `pct_${ t }`,
						label: labels[ t ],
						render: ( r ) =>
							`${ Number( r.pct?.[ t ] || 0 ).toFixed( 1 ) }%`,
					} ) ),
					{
						key: 'warn',
						label: __( 'Warning', 'rankweb' ),
						render: ( r ) =>
							r.warn
								.map( ( t ) =>
									sprintf(
										/* translators: 1: anchor type, 2: its limit in percent. */
										__( '%1$s over %2$s%%', 'rankweb' ),
										labels[ t ] || t,
										num(
											'exact' === t
												? limits.exact_max
												: limits.type_max
										)
									)
								)
								.join( ', ' ),
					},
				] }
				rows={ data?.items || [] }
				total={ data?.total || 0 }
				page={ data?.page || 1 }
				pages={ data?.pages || 1 }
				onPage={ setPage }
				views={ [
					{ value: 'all', label: __( 'All items', 'rankweb' ) },
					{
						value: 'warn',
						label: __( 'With a warning', 'rankweb' ),
					},
				] }
				view={ warn ? 'warn' : 'all' }
				onView={ ( v ) => {
					setPage( 1 );
					setWarn( 'warn' === v );
				} }
				rowActions={ ( r ) => [
					...( r.edit
						? [
								{
									icon: 'edit',
									label: __( 'Edit', 'rankweb' ),
									href: r.edit,
								},
							]
						: [] ),
					...( r.url
						? [
								{
									icon: 'view',
									label: __( 'View', 'rankweb' ),
									href: r.url,
								},
							]
						: [] ),
				] }
				loading={ loading && ! data }
				error={ error }
				onRetry={ load }
				emptyTitle={ __(
					'No links to items are recorded yet. Run the audit first.',
					'rankweb'
				) }
			/>
		</SectionCard>
	);
}

/* ---------- Silos ---------- */

const MODES = () => [
	{
		value: 'virtual',
		label: __( 'Virtual: each links to the hub and the others', 'rankweb' ),
	},
	{
		value: 'circle',
		label: __(
			'Circle: each links to the next and back to the hub',
			'rankweb'
		),
	},
];

/**
 * The form to add or change a silo.
 *
 * @param {Object}   props
 * @param {Object}   props.silo    The silo, or null for a new one.
 * @param {Function} props.onSaved Called with the new list after a save or a delete.
 * @param {Function} props.onClose Back to the list.
 */
function SiloForm( { silo, onSaved, onClose } ) {
	const [ v, setV ] = useState( {
		name: silo?.name || '',
		hub: silo?.hub ? String( silo.hub ) : '',
		mode: silo?.mode || 'virtual',
		items: ( silo?.items || [] ).join( '\n' ),
	} );
	const [ busy, setBusy ] = useState( false );
	const [ err, setErr ] = useState( '' );
	const set = ( part ) => setV( ( o ) => ( { ...o, ...part } ) );

	const run = ( request ) => {
		setBusy( true );
		setErr( '' );
		request.then( onSaved ).catch( ( e ) => {
			setErr( errText( e ) );
			setBusy( false );
		} );
	};
	const save = () =>
		run(
			apiFetch( {
				path: path( 'links/silos' ),
				method: 'POST',
				data: {
					id: silo?.id || 0,
					name: v.name,
					hub: parseInt( v.hub, 10 ) || 0,
					mode: v.mode,
					items: v.items
						.split( /[\s,]+/ )
						.map( ( x ) => parseInt( x, 10 ) )
						.filter( ( x ) => x > 0 ),
				},
			} )
		);
	const remove = () =>
		run(
			apiFetch( {
				path: path( `links/silos/${ silo.id }` ),
				method: 'DELETE',
			} )
		);

	return (
		<SectionCard
			id="links-silo-form"
			title={
				silo
					? __( 'Change the silo', 'rankweb' )
					: __( 'Add a silo', 'rankweb' )
			}
		>
			{ err && (
				<Notice tone="error" onDismiss={ () => setErr( '' ) }>
					{ err }
				</Notice>
			) }
			<Field
				label={ __( 'Name', 'rankweb' ) }
				render={ ( id ) => (
					<input
						id={ id }
						type="text"
						maxLength={ 120 }
						value={ v.name }
						onChange={ ( e ) => set( { name: e.target.value } ) }
					/>
				) }
			/>
			<Field
				label={ __( 'Hub item ID', 'rankweb' ) }
				help={
					silo?.hub_info
						? `${ silo.hub_info.id } · ${ silo.hub_info.title }`
						: ''
				}
				render={ ( id, helpId ) => (
					<input
						id={ id }
						type="number"
						min="1"
						value={ v.hub }
						aria-describedby={ helpId }
						onChange={ ( e ) => set( { hub: e.target.value } ) }
					/>
				) }
			/>
			<Field
				label={ __( 'Mode', 'rankweb' ) }
				render={ ( id, helpId ) => (
					<Select
						id={ id }
						value={ v.mode }
						options={ MODES() }
						aria-describedby={ helpId }
						onChange={ ( mode ) => set( { mode } ) }
					/>
				) }
			/>
			<Field
				label={ __( 'Supporting item IDs', 'rankweb' ) }
				help={ __(
					'One item ID per line, in the order of the circle. Published items with their own page only.',
					'rankweb'
				) }
				render={ ( id, helpId ) => (
					<textarea
						id={ id }
						className="large-text code"
						rows={ 8 }
						spellCheck="false"
						value={ v.items }
						aria-describedby={ helpId }
						onChange={ ( e ) => set( { items: e.target.value } ) }
					/>
				) }
			/>
			{ silo?.items_info?.length > 0 && (
				<p className="kits-shell-field__help">
					{ silo.items_info
						.slice( 0, 30 )
						.map( ( i ) => `${ i.id } · ${ i.title }` )
						.join( ' · ' ) }
					{ silo.items_info.length > 30 ? '…' : '' }
				</p>
			) }
			<div className="kits-shell-card__actions">
				<Button variant="primary" busy={ busy } onClick={ save }>
					{ __( 'Save the silo', 'rankweb' ) }
				</Button>
				<Button onClick={ onClose }>
					{ __( 'Cancel', 'rankweb' ) }
				</Button>
				{ silo && (
					<ConfirmButton
						label={ __( 'Delete this silo', 'rankweb' ) }
						question={ __(
							'Delete this silo? Its settings are removed. No item is changed or deleted.',
							'rankweb'
						) }
						count={ 1 }
						tone="error"
						busy={ busy }
						onConfirm={ remove }
					/>
				) }
			</div>
		</SectionCard>
	);
}

function Silos() {
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ editing, setEditing ] = useState( null ); // null | 'new' | silo ID
	const [ msg, setMsg ] = useState( null );

	const load = useCallback( () => {
		setError( '' );
		apiFetch( { path: path( 'links/silos' ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) );
	}, [] );
	useEffect( load, [ load ] );

	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! data ) {
		return <LoadingState />;
	}
	const modes = Object.fromEntries(
		MODES().map( ( m ) => [ m.value, m.label ] )
	);
	const silo =
		'new' === editing ? null : data.silos.find( ( s ) => s.id === editing );
	return (
		<>
			{ msg && (
				<Notice tone="success" onDismiss={ () => setMsg( null ) }>
					{ msg }
				</Notice>
			) }
			{ null !== editing && data.can_edit && (
				<SiloForm
					key={ editing }
					silo={ silo }
					onClose={ () => setEditing( null ) }
					onSaved={ ( r ) => {
						setData( r );
						setMsg( r.message );
						setEditing( null );
					} }
				/>
			) }
			<SectionCard
				id="links-silos"
				title={ __( 'Silos', 'rankweb' ) }
				description={ __(
					'A silo is one hub item and its supporting items. Supporting items link to the hub and to each other; an item in one silo links to another silo’s hub only. An item is in one silo only.',
					'rankweb'
				) }
				actions={
					data.can_edit ? (
						<Button onClick={ () => setEditing( 'new' ) }>
							{ __( 'Add a silo', 'rankweb' ) }
						</Button>
					) : null
				}
			>
				<DataList
					label={ __( 'Silos', 'rankweb' ) }
					columns={ [
						{
							key: 'name',
							label: __( 'Silo', 'rankweb' ),
							primary: true,
							render: ( s ) => <strong>{ s.name }</strong>,
						},
						{
							key: 'hub',
							label: __( 'Hub', 'rankweb' ),
							render: ( s ) =>
								`${ s.hub_info.id } · ${ s.hub_info.title }`,
						},
						{
							key: 'mode',
							label: __( 'Mode', 'rankweb' ),
							render: ( s ) => modes[ s.mode ] || s.mode,
						},
						{
							key: 'items',
							label: __( 'Supporting items', 'rankweb' ),
							render: ( s ) => num( s.items.length ),
						},
						{
							key: 'checks',
							label: __( 'Address checks', 'rankweb' ),
							render: ( s ) => (
								<ul className="kits-shell-list">
									{ s.checks.few > 0 && (
										<li>
											{ sprintf(
												/* translators: 1: items in the silo, 2: fewest items. */
												__(
													'Only %1$s items; at least %2$s are better.',
													'rankweb'
												),
												num( s.checks.few ),
												num( data.min )
											) }
										</li>
									) }
									{ s.checks.deep.length > 0 && (
										<li>
											{ sprintf(
												/* translators: 1: item IDs, 2: most folders deep. */
												__(
													'Deeper than %2$s folders: %1$s.',
													'rankweb'
												),
												s.checks.deep.join( ', ' ),
												num( data.depth )
											) }
										</li>
									) }
								</ul>
							),
						},
					] }
					rows={ data.silos }
					total={ data.silos.length }
					rowActions={ ( s ) =>
						data.can_edit
							? [
									{
										icon: 'edit',
										label: __( 'Edit', 'rankweb' ),
										onClick: () => setEditing( s.id ),
									},
								]
							: []
					}
					emptyTitle={ __( 'No silos yet.', 'rankweb' ) }
				/>
			</SectionCard>
		</>
	);
}

/* ---------- The screen ---------- */

export function Links() {
	const views = app.linkViews || [ 'audit' ];
	const names = {
		audit: __( 'Audit', 'rankweb' ),
		anchors: __( 'Anchor mix', 'rankweb' ),
		silos: __( 'Silos', 'rankweb' ),
	};
	const first = new URLSearchParams( window.location.search ).get( 'view' );
	const [ view, setView ] = useState(
		views.includes( first ) ? first : 'audit'
	);
	const go = ( v ) => {
		setView( v );
		const url = new URL( window.location.href );
		if ( 'audit' === v ) {
			url.searchParams.delete( 'view' );
		} else {
			url.searchParams.set( 'view', v );
		}
		window.history.replaceState( null, '', url );
	};
	return (
		<>
			{ views.length > 1 && (
				<ChipRow
					label={ __( 'Internal links views', 'rankweb' ) }
					chips={ views.map( ( v ) => ( {
						value: v,
						label: names[ v ],
					} ) ) }
					value={ view }
					onChange={ go }
				/>
			) }
			{ 'audit' === view && <Audit /> }
			{ 'anchors' === view && <Anchors /> }
			{ 'silos' === view && <Silos /> }
			{ ! views.includes( view ) && (
				<EmptyState title={ __( 'No such view.', 'rankweb' ) } />
			) }
		</>
	);
}
