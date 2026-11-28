/**
 * SourceWeb's new screens (trial, &ui=next): Dashboard, To review, Enrichment review and Settings, drawn with the Kits
 * admin shell (@kits/shell is window.kits.shell from Kits Core) and fed by the sourceweb/v1 routes. Data and the
 * screen come from window.sourcewebApp (includes/sourceweb-ui.php).
 */
import {
	createRoot,
	useCallback,
	useEffect,
	useState,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	AppShell,
	AppHeader,
	Button,
	ChipRow,
	DataList,
	EmptyState,
	ErrorState,
	Field,
	FieldReview,
	LoadingState,
	MediaThumbs,
	MiniChart,
	Notice,
	PageParts,
	RefTable,
	SectionCard,
	ServiceList,
	ServiceRow,
	SettingsBlock,
	SettingsGroup,
	Switch,
	Tile,
	TileGrid,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js

const app = window.sourcewebApp || {};
/**
 * A route's path, with the non-empty arguments as its query.
 *
 * @param {string} p    Route under the plugin's namespace.
 * @param {Object} args Query arguments.
 */
const path = ( p, args = {} ) => {
	const q = Object.keys( args )
		.filter( ( k ) => '' !== args[ k ] && undefined !== args[ k ] )
		.map( ( k ) => `${ k }=${ encodeURIComponent( args[ k ] ) }` )
		.join( '&' );
	return `/${ app.rest }/${ p }${ q ? '?' + q : '' }`;
};
const errText = ( e ) => e?.message || String( e );

/** Header with the plugin's tabs and the way back to the current screen. */
function Header() {
	return (
		<AppHeader
			icon={ app.icon }
			name={ app.name }
			version={ app.version }
			tabs={ app.tabs }
		/>
	);
}

/* ---------- Dashboard ---------- */

const RANGES = [ 7, 28, 90 ];

/**
 * The log row to compare with: the newest day on or before `days` ago.
 *
 * @param {Object} log   { 'Y-m-d': { metric: n } }.
 * @param {string} today Site date today.
 * @param {number} days  Range.
 * @return {Array|null} [ date, row ].
 */
function rowBefore( log, today, days ) {
	const at = new Date( `${ today }T12:00:00Z` ); // UTC: the browser's timezone must not move the day
	at.setUTCDate( at.getUTCDate() - days );
	const limit = at.toISOString().slice( 0, 10 );
	const dates = Object.keys( log || {} )
		.filter( ( d ) => d <= limit )
		.sort();
	const d = dates[ dates.length - 1 ];
	return d ? [ d, log[ d ] ] : null;
}

function Dashboard() {
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ days, setDays ] = useState( 7 );
	const [ note, setNote ] = useState( '' );
	const [ busy, setBusy ] = useState( false );
	const [ tries, setTries ] = useState( 0 );
	const [ waitFor, setWaitFor ] = useState( null );

	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'dashboard' ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [] );
	// While a count runs in the background, look again every 20 seconds (a read; nothing is counted).
	const waiting =
		!! data &&
		( data.counting || ( null !== waitFor && data.at === waitFor ) );
	useEffect( () => {
		if ( data && null !== waitFor && data.at !== waitFor ) {
			setWaitFor( null );
			setNote( '' );
		}
	}, [ data, waitFor ] );
	useEffect( () => {
		if ( ! waiting || tries >= 15 ) {
			return;
		}
		const t = setTimeout( () => {
			setTries( tries + 1 );
			load();
		}, 20000 );
		return () => clearTimeout( t );
	}, [ waiting, data, tries ] );

	const countNow = () => {
		setBusy( true );
		apiFetch( { path: path( 'dashboard/count' ), method: 'POST' } )
			.then( () => {
				setTries( 0 );
				setWaitFor( data?.at ?? 0 );
				setNote(
					__(
						'A count is running in the background. The numbers change when it is done (about a minute).',
						'sourceweb'
					)
				);
			} )
			.catch( ( e ) => setNote( errText( e ) ) )
			.finally( () => setBusy( false ) );
	};

	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! data ) {
		return (
			<LoadingState
				label={ __( 'Loading the counts…', 'sourceweb' ) }
			/>
		);
	}
	const before = rowBefore( data.log, data.today, days );
	const attention = data.tiles.filter( ( t ) => t.tone );
	const delta = ( t ) => {
		if ( ! before || ! t.metric || undefined === t.raw ) {
			return '';
		}
		const old = before[ 1 ]?.[ t.metric ];
		if ( undefined === old ) {
			return '';
		}
		const d = t.raw - old;
		return sprintf(
			/* translators: 1: change (+3 or -2), 2: number of days. */
			__( '%1$s in %2$d days', 'sourceweb' ),
			( d > 0 ? '+' : '' ) + d.toLocaleString(),
			days
		);
	};
	let after = data.atText
		? sprintf(
				/* translators: %s: date and time. */
				__( 'Counted %s.', 'sourceweb' ),
				data.atText
			)
		: __( 'Counting for the first time…', 'sourceweb' );
	if ( data.atText && ! before ) {
		after +=
			' ' +
			sprintf(
				/* translators: %d: number of days. */
				__(
					'No count from %d days ago yet, so no change is shown.',
					'sourceweb'
				),
				days
			);
	}
	if ( waiting && tries >= 15 ) {
		after +=
			' ' +
			__(
				'The count is taking longer than usual; reload this page later.',
				'sourceweb'
			);
	}

	return (
		<>
			<ChipRow
				label={ __( 'Compare with', 'sourceweb' ) }
				value={ days }
				onChange={ setDays }
				chips={ RANGES.map( ( n ) => ( {
					value: n,
					/* translators: %d: number of days. */
					label: sprintf( __( 'Last %d days', 'sourceweb' ), n ),
				} ) ) }
				after={
					<>
						{ after }{ ' ' }
						<Button
							variant="link"
							busy={ busy }
							onClick={ countNow }
						>
							{ __( 'Count now', 'sourceweb' ) }
						</Button>
					</>
				}
			/>
			{ note && (
				<Notice tone="info" onDismiss={ () => setNote( '' ) }>
					{ note }
				</Notice>
			) }
			{ attention.length > 0 && (
				<Notice tone="warning">
					<strong>{ __( 'Needs attention', 'sourceweb' ) }</strong>
					<ul>
						{ attention.map( ( t ) => (
							<li key={ t.key }>
								{ t.label }: { t.value }. { t.sub }
							</li>
						) ) }
					</ul>
				</Notice>
			) }
			<TileGrid label={ __( 'SourceWeb at a glance', 'sourceweb' ) }>
				{ data.tiles.map( ( t ) => (
					<Tile
						key={ t.key }
						label={ t.label }
						value={ t.value }
						delta={ delta( t ) }
						sub={ t.sub }
						href={ t.href }
						tone={ t.tone }
						loading={ data.counting }
					/>
				) ) }
			</TileGrid>
			{ data.charts && (
				<SectionCard
					id="pipeline"
					title={ __( 'Pipeline and trends', 'sourceweb' ) }
					description={ __(
						'The last 28 days of the pipeline, and 14-day daily trends. Ingested: items fetched. Reviewed: those that passed the relevance gate into the queue. Approved: published. The last bar is the most recent day.',
						'sourceweb'
					) }
				>
					{ /* Three bars only: cap the drawing's width (3 rem a bar) so they stay bars, not blocks. */ }
					<div
						className="sourceweb-funnel"
						style={ {
							'--sw-bars': ( data.charts.funnel || [] ).length || 1,
						} }
					>
						<style>
							{ '.sourceweb-funnel .kits-shell-chart svg{width:calc(var(--sw-bars)*3rem);max-width:100%}' }
						</style>
						<MiniChart
							label={ __(
								'Pipeline, last 28 days: ingested to reviewed to approved',
								'sourceweb'
							) }
							points={ data.charts.funnel || [] }
							unit={ [ __( 'item', 'sourceweb' ), __( 'items', 'sourceweb' ) ] }
						/>
					</div>
					<div
						style={ {
							display: 'grid',
							gridTemplateColumns:
								'repeat(auto-fit, minmax(220px, 1fr))',
							gap: 'var(--ks-s5, 20px)',
						} }
					>
						<MiniChart
							label={ __(
								'Feed throughput: items fetched per day',
								'sourceweb'
							) }
							points={ data.charts.throughput || [] }
							unit={ [ __( 'item', 'sourceweb' ), __( 'items', 'sourceweb' ) ] }
						/>
						<MiniChart
							label={ __(
								'Near-duplicates folded per day',
								'sourceweb'
							) }
							points={ data.charts.dupes || [] }
							unit={ [ __( 'item', 'sourceweb' ), __( 'items', 'sourceweb' ) ] }
						/>
						<MiniChart
							label={ __( 'Review-queue size', 'sourceweb' ) }
							points={ data.charts.queue || [] }
							unit={ __( 'waiting', 'sourceweb' ) }
						/>
					</div>
				</SectionCard>
			) }
			{ data.runs.length > 0 && (
				<SectionCard
					id="runs"
					title={ __( 'Worker runs', 'sourceweb' ) }
					description={ __(
						'Each workflow’s last report and when it runs next.',
						'sourceweb'
					) }
				>
					<DataList
						label={ __( 'Worker runs', 'sourceweb' ) }
						columns={ [
							{
								key: 'title',
								label: __( 'Worker', 'sourceweb' ),
								primary: true,
							},
							{
								key: 'last',
								label: __( 'Last report', 'sourceweb' ),
							},
							{
								key: 'result',
								label: __( 'Result', 'sourceweb' ),
							},
							{
								key: 'next',
								label: __( 'Next due', 'sourceweb' ),
							},
						] }
						rows={ data.runs }
						total={ data.runs.length }
					/>
				</SectionCard>
			) }
			{ data.reports.length > 0 && (
				<SectionCard
					id="reports"
					title={ __( 'Reports', 'sourceweb' ) }
					description={ __(
						'Read-only logs, on the current screens for now.',
						'sourceweb'
					) }
				>
					<RefTable
						caption={ __( 'Reports', 'sourceweb' ) }
						head={ [
							__( 'Report', 'sourceweb' ),
							__( 'What it lists', 'sourceweb' ),
						] }
						rows={ data.reports.map( ( r ) => [
							<a key="a" href={ r.url }>
								{ r.label }
							</a>,
							r.what,
						] ) }
					/>
				</SectionCard>
			) }
			<SectionCard
				id="commands"
				title={ __( 'Commands', 'sourceweb' ) }
				description={ __(
					'WP-CLI on the server. Each lists its options with --help.',
					'sourceweb'
				) }
			>
				<RefTable
					caption={ __( 'Commands', 'sourceweb' ) }
					head={ [
						__( 'Command', 'sourceweb' ),
						__( 'What it does', 'sourceweb' ),
					] }
					rows={ data.commands.map( ( c ) => [
						<code key="c">{ c[ 0 ] }</code>,
						c[ 1 ],
					] ) }
				/>
			</SectionCard>
		</>
	);
}

/* ---------- To review ---------- */

/**
 * Server-drawn forms under a screen (app.extra, sourceweb_extra_parts()): To review's intake forms, Settings' backfill
 * date. Nothing when the server sent none.
 *
 * @param {Object} props
 * @param {string} props.id    Card id.
 * @param {string} props.title Card title.
 */
function ExtraParts( { id, title } ) {
	const parts = ( app.extra || [] ).filter( ( p ) => 'heading' !== p.type );
	if ( ! parts.length ) {
		return null;
	}
	// "Reset this section" forms (sourceweb_reset_form()): the page parts drop the button's own confirm, so ask here.
	const confirmReset = ( e ) => {
		if (
			e.target.querySelector(
				'input[name="action"][value="sourceweb_reset_section"]'
			) &&
			// eslint-disable-next-line no-alert -- a plain browser confirm before a reset, as core's list tables do
			! window.confirm(
				__( 'Reset this section to its defaults?', 'sourceweb' )
			)
		) {
			e.preventDefault();
		}
	};
	return (
		<SectionCard id={ id } title={ title }>
			<div onSubmitCapture={ confirmReset }>
				<PageParts parts={ parts } title={ title } />
			</div>
		</SectionCard>
	);
}

function Review() {
	const [ q, setQ ] = useState( {
		type: '',
		search: '',
		source: '',
		why: '',
		orderby: 'date',
		order: 'desc',
		page: 1,
	} );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );

	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'review', q ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );

	const decide = ( action, ids ) => {
		setMsg( null );
		return apiFetch( {
			path: path( 'review/decide' ),
			method: 'POST',
			data: { action, ids },
		} )
			.then( ( r ) => setMsg( { tone: 'success', text: r.message } ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const publishAll = () => {
		const n = data.count;
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm that names the count, as today's screen
			! window.confirm(
				sprintf(
					/* translators: %d: number of items. */
					_n(
						'Publish %d item in this view?',
						'Publish all %d items in this view?',
						n,
						'sourceweb'
					),
					n
				)
			)
		) {
			return;
		}
		apiFetch( {
			path: path( 'review/publish-all' ),
			method: 'POST',
			data: { type: q.type, count: n },
		} )
			.then( ( r ) => setMsg( { tone: 'success', text: r.message } ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};

	const rows = data?.rows || [];
	return (
		<>
			<SectionCard
				id="review"
				title={ __( 'To review', 'sourceweb' ) }
				description={ __(
					'Items that came in automatically and need a person, with why each was held. Publish puts it live; Reject moves it to Drafts (nothing is deleted).',
					'sourceweb'
				) }
				actions={
					data && data.count > 0 ? (
						<Button onClick={ publishAll }>
							{ sprintf(
								/* translators: %d: number of items. */
								__( 'Publish all %d', 'sourceweb' ),
								data.count
							) }
						</Button>
					) : null
				}
			>
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				<DataList
					label={ __( 'Items waiting for review', 'sourceweb' ) }
					columns={ [
						{
							key: 'date',
							label: __( 'Received', 'sourceweb' ),
							sortable: true,
							render: ( r ) => r.dateText,
						},
						{
							key: 'title',
							label: __( 'Item', 'sourceweb' ),
							sortable: true,
							primary: true,
							render: ( r ) => (
								<>
									<a href={ r.editUrl }>
										<strong>{ r.title }</strong>
									</a>
									{ r.excerpt && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.excerpt }
										</span>
									) }
								</>
							),
						},
						{
							key: 'type',
							label: __( 'Type', 'sourceweb' ),
							sortable: true,
							render: ( r ) => r.typeLabel,
						},
						{
							key: 'host',
							label: __( 'Source', 'sourceweb' ),
							render: ( r ) => r.host || '—',
						},
						{
							key: 'why',
							label: __( 'Why it is waiting', 'sourceweb' ),
						},
					] }
					rows={ rows }
					total={ data?.total || 0 }
					page={ data?.page || 1 }
					pages={ data?.pages || 1 }
					onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
					search={ q.search }
					onSearch={ ( search ) => set( { search } ) }
					searchLabel={ __( 'Search items', 'sourceweb' ) }
					views={ data?.views || [] }
					view={ q.type }
					onView={ ( type ) => set( { type, source: '', why: '' } ) }
					filters={ [
						{
							key: 'source',
							label: __( 'Source', 'sourceweb' ),
							options: data?.filters?.source || [],
							value: q.source,
						},
						{
							key: 'why',
							label: __( 'Why', 'sourceweb' ),
							options: data?.filters?.why || [],
							value: q.why,
						},
					] }
					onFilter={ ( key, value ) => set( { [ key ]: value } ) }
					sort={ { key: q.orderby, dir: q.order } }
					onSort={ ( orderby, order ) => set( { orderby, order } ) }
					bulkActions={ [
						{
							value: 'publish',
							label: __( 'Publish', 'sourceweb' ),
						},
						{
							value: 'reject',
							label: __(
								'Reject (move to Drafts)',
								'sourceweb'
							),
						},
					] }
					onBulk={ decide }
					rowActions={ ( r ) => [
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							href: r.editUrl,
						},
						...( r.url
							? [
									{
										label: __( 'Source', 'sourceweb' ),
										href: r.url,
									},
								]
							: [] ),
						{
							icon: 'success',
							label: __( 'Publish', 'sourceweb' ),
							onClick: () => decide( 'publish', [ r.id ] ),
							disabled: r.noPublish,
							why: r.noPublish
								? __( 'Needs its summary first', 'sourceweb' )
								: '',
						},
						{
							icon: 'cancel',
							label: __( 'Reject', 'sourceweb' ),
							tone: 'error',
							onClick: () => decide( 'reject', [ r.id ] ),
						},
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'Nothing is waiting.', 'sourceweb' ) }
					empty={
						<p>
							{ __(
								'New items that pass the checks go live on their own.',
								'sourceweb'
							) }
						</p>
					}
				/>
			</SectionCard>
			<ExtraParts
				id="review-intake"
				title={ __( 'Add by link', 'sourceweb' ) }
			/>
		</>
	);
}

/* ---------- Enrichment review ---------- */

const FILTER_KEYS = [
	'search',
	'source',
	'confidence',
	'field',
	'flag',
	'state',
	'listing',
];

// Bulk Undo where applied values can be listed (as the classic screen: not on Waiting or Failed).
const bulkUndo = ( status ) =>
	[ 'pending', 'failed', 'rejected', 'undone' ].includes( status )
		? []
		: [
				{
					value: 'undo',
					label: __( 'Undo every applied value', 'sourceweb' ),
				},
			];

// One listing from the address (&listing=ID, as the classic screen and the DirectoryWeb claim link), and its view.
const firstListing = () =>
	parseInt(
		new URLSearchParams( window.location.search ).get( 'listing' ),
		10
	) || 0;
const firstStatus = () =>
	new URLSearchParams( window.location.search ).get( 'status' ) || 'pending';

const hasValue = ( text, pics ) => !! text || !! pics?.length;

/**
 * One value in the Listing details review: its words (linked to the listing a merge goes into), the pictures of a
 * logo or photos value, and the pages it came from.
 *
 * @param {Object} props
 * @param {string} props.text  The value as words.
 * @param {Array}  props.pics  Picture URLs (logo, photos).
 * @param {string} props.href  Link for the words (a merge's listing), or ''.
 * @param {Array}  props.links [ { name, url } ]: where the value came from.
 * @param {string} props.label What the pictures are, for screen readers.
 */
function FieldValue( { text, pics, href, links, label } ) {
	return (
		<>
			{ text && ( href ? <a href={ href }>{ text }</a> : text ) }
			{ pics?.length > 0 && (
				<>
					{ text && <br /> }
					<MediaThumbs urls={ pics } label={ label } />
				</>
			) }
			{ links?.length > 0 && (
				<>
					{ hasValue( text, pics ) && <br /> }
					<small>
						{ __( 'From', 'sourceweb' ) }{ ' ' }
						{ links.map( ( l, i ) => (
							<span key={ l.url }>
								{ i > 0 && ', ' }
								<a
									href={ l.url }
									target="_blank"
									rel="noopener noreferrer nofollow"
								>
									{ l.name }
								</a>
							</span>
						) ) }
					</small>
				</>
			) }
		</>
	);
}

/**
 * Edit or delete the waiting text values of one listing (the person checking corrects a typo, then applies it).
 *
 * @param {Object}   props
 * @param {Object[]} props.fields    The listing's field rows.
 * @param {Function} props.onChanged Called with the notice after a save or delete.
 */
const NOT_EDITABLE = [
	'logo',
	'photos',
	'hours',
	'services',
	'place',
	'merge_into',
	'closed',
	'animals',
	'areas_served',
];
function WaitingEdit( { fields, onChanged } ) {
	const [ text, setText ] = useState( {} );
	const [ busy, setBusy ] = useState( false );
	const rows = fields.filter(
		( f ) => f.waiting && ! NOT_EDITABLE.includes( f.field )
	);
	if ( ! rows.length ) {
		return null;
	}
	const send = ( to, body ) => {
		setBusy( true );
		apiFetch( { path: path( to ), method: 'POST', data: body } )
			.then( ( r ) => onChanged( answerMsg( r ) ) )
			.catch( ( e ) =>
				onChanged( { tone: 'error', text: errText( e ) } )
			)
			.finally( () => setBusy( false ) );
	};
	return (
		<details>
			<summary>
				{ __( 'Edit or delete a waiting value', 'sourceweb' ) }
			</summary>
			{ rows.map( ( f ) => (
				<div key={ f.key }>
					<TextField
						label={ f.label }
						value={ text[ f.key ] ?? f.proposed }
						onChange={ ( v ) =>
							setText( { ...text, [ f.key ]: v } )
						}
						input={ { rows: 2 } }
					/>
					<p>
						<Button
							busy={ busy }
							onClick={ () =>
								send( 'enrichment/edit', {
									id: f.key,
									value: text[ f.key ] ?? f.proposed,
								} )
							}
						>
							{ __( 'Save value', 'sourceweb' ) }
						</Button>{ ' ' }
						<Button
							busy={ busy }
							onClick={ () => {
								if (
									// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
									! window.confirm(
										__(
											'Delete this waiting value? Nothing on the listing changes.',
											'sourceweb'
										)
									)
								) {
									return;
								}
								send( 'enrichment/delete', { id: f.key } );
							} }
						>
							{ __( 'Delete', 'sourceweb' ) }
						</Button>
					</p>
				</div>
			) ) }
		</details>
	);
}

function Enrichment() {
	const [ q, setQ ] = useState( {
		listing: firstListing(),
		status: firstStatus(),
		search: '',
		source: '',
		confidence: '',
		field: '',
		flag: '',
		state: '',
		page: 1,
	} );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ open, setOpen ] = useState( 0 );
	const [ busy, setBusy ] = useState( false );

	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'enrichment', q ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => {
		setOpen( 0 );
		setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	};

	const decide = ( body ) => {
		setBusy( true );
		setMsg( null );
		const filters = {};
		FILTER_KEYS.forEach( ( k ) => ( filters[ k ] = q[ k ] ) );
		return apiFetch( {
			path: path( 'enrichment/decide' ),
			method: 'POST',
			data: { ...filters, ...body },
		} )
			.then( ( r ) => setMsg( { tone: 'success', text: r.message } ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => {
				setBusy( false );
				load();
			} );
	};
	// Reject an applied or undone value for good: an applied one is undone first (the value before it comes back), and
	// a later check never proposes or applies the same value for this field again.
	const rejectForGood = ( f ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as for a bulk Undo
			window.confirm(
				sprintf(
					/* translators: 1: field name, 2: the value. */
					__(
						'Reject %1$s "%2$s" for good? An applied value is undone first, and later checks will not add it again.',
						'sourceweb'
					),
					f.label,
					f.proposed
				)
			)
		) {
			decide( { do: 'reject', ids: [ f.key ] } );
		}
	};
	const approveHigh = () => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm before a bulk approval
			window.confirm(
				__(
					'Approve every waiting high-confidence value in this filter? Merges are left for one by one.',
					'sourceweb'
				)
			)
		) {
			decide( { do: 'approve_high' } );
		}
	};

	const rows = data?.rows || [];
	// With one listing asked for, open it as soon as it is in the list.
	useEffect( () => {
		if (
			q.listing &&
			( data?.rows || [] ).some( ( r ) => r.id === q.listing )
		) {
			setOpen( q.listing );
		}
	}, [ q.listing, data ] );
	const listing = rows.find( ( r ) => r.id === open );
	const progress = data?.progress;
	return (
		<>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ listing && (
				<SectionCard
					id="listing"
					title={ listing.title }
					description={ [
						listing.flags.join( ' · ' ),
						listing.sources &&
							sprintf(
								/* translators: %s: source names. */
								__( 'From %s', 'sourceweb' ),
								listing.sources
							),
					]
						.filter( Boolean )
						.join( '. ' ) }
					actions={
						<Button variant="link" onClick={ () => setOpen( 0 ) }>
							{ __( 'Close', 'sourceweb' ) }
						</Button>
					}
				>
					{ listing.fields.length > 0 ? (
						<FieldReview
							key={ listing.fields
								.map( ( f ) => f.key + f.status )
								.join() }
							title={ __( 'Proposed details', 'sourceweb' ) }
							fields={ listing.fields.map( ( f ) => ( {
								...f,
								rejectForGood:
									f.applied && 'closed' !== f.field,
								label: `${ f.label } (${ f.confidence || '–' }${
									f.source ? ', ' + f.source : ''
								})`,
								current: hasValue(
									f.current,
									f.currentPics
								) && (
									<FieldValue
										text={ f.current }
										pics={ f.currentPics }
										label={ sprintf(
											/* translators: %s: field name. */
											__( '%s now', 'sourceweb' ),
											f.label
										) }
									/>
								),
								proposed: hasValue(
									f.proposed,
									f.proposedPics
								) && (
									<FieldValue
										text={ f.proposed }
										pics={ f.proposedPics }
										href={ f.mergeUrl }
										links={ f.links }
										label={ sprintf(
											/* translators: %s: field name. */
											__( '%s proposed', 'sourceweb' ),
											f.label
										) }
									/>
								),
							} ) ) }
							busy={ busy }
							onApply={ ( ids ) =>
								decide( { do: 'approve', ids } )
							}
							onReject={ ( ids ) =>
								decide( { do: 'reject', ids } )
							}
							onUndo={ ( id ) =>
								decide( { do: 'undo', ids: [ id ] } )
							}
							onRejectForGood={ ( f ) => rejectForGood( f ) }
							after={
								<>
									{ listing.waiting > 0 && (
										<>
											<WaitingEdit
												fields={ listing.fields }
												onChanged={ ( m ) => {
													setMsg( m );
													load();
												} }
											/>
											<p>
												<Button
													busy={ busy }
													onClick={ () =>
														decide( {
															do: 'reject',
															listings: [
																listing.id,
															],
														} )
													}
												>
													{ __(
														'Reject every waiting value',
														'sourceweb'
													) }
												</Button>
											</p>
										</>
									) }
								</>
							}
						/>
					) : (
						<EmptyState
							title={ __(
								'Nothing waiting or applied in this view.',
								'sourceweb'
							) }
						/>
					) }
					{ listing.others.length > 0 && (
						<RefTable
							caption={ __( 'Other decisions', 'sourceweb' ) }
							head={ [
								__( 'Field', 'sourceweb' ),
								__( 'What happened', 'sourceweb' ),
								__( 'Action', 'sourceweb' ),
							] }
							rows={ listing.others.map( ( f ) => [
								f.label,
								[ f.status, f.created, f.proposed, f.note ]
									.filter( Boolean )
									.join( ' · ' ),
								'undone' === f.status &&
								'closed' !== f.field ? (
									<Button
										busy={ busy }
										onClick={ () => rejectForGood( f ) }
									>
										{ __( 'Reject', 'sourceweb' ) }
									</Button>
								) : (
									'–'
								),
							] ) }
						/>
					) }
				</SectionCard>
			) }
			<SectionCard
				id="enrichment"
				title={ __( 'Listing details', 'sourceweb' ) }
				description={
					progress
						? sprintf(
								/* translators: 1: listings checked, 2: listings, 3: proposals waiting. */
								__(
									'%1$d of %2$d listings checked · %3$d proposals waiting. High-confidence values for empty fields of unclaimed listings are applied on their own and listed under Applied, with Undo.',
									'sourceweb'
								),
								progress.checked,
								progress.total,
								progress.pending
							)
						: ''
				}
				actions={
					'pending' === q.status && rows.length > 0 ? (
						<Button busy={ busy } onClick={ approveHigh }>
							{ __(
								'Approve all high (this filter)',
								'sourceweb'
							) }
						</Button>
					) : null
				}
			>
				{ q.listing > 0 && (
					<Notice tone="info">
						{ __( 'One listing only.', 'sourceweb' ) }{ ' ' }
						<Button
							variant="link"
							onClick={ () => {
								const u = new URL( window.location.href );
								u.searchParams.delete( 'listing' );
								window.history.replaceState(
									null,
									'',
									u.toString()
								);
								set( { listing: 0 } );
							} }
						>
							{ __( 'Show every listing', 'sourceweb' ) }
						</Button>
					</Notice>
				) }
				<DataList
					label={ __( 'Listings with proposals', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Listing', 'sourceweb' ),
							primary: true,
							render: ( r ) => <strong>{ r.title }</strong>,
						},
						{
							key: 'waiting',
							label: __( 'Waiting', 'sourceweb' ),
						},
						{
							key: 'applied',
							label: __( 'Applied', 'sourceweb' ),
						},
						{
							key: 'confidence',
							label: __( 'Confidence', 'sourceweb' ),
							render: ( r ) => r.confidence.join( ', ' ) || '–',
						},
						{
							key: 'sources',
							label: __( 'Source', 'sourceweb' ),
							render: ( r ) => r.sources || '–',
						},
						{
							key: 'flags',
							label: __( 'Flags', 'sourceweb' ),
							render: ( r ) => r.flags.join( ' · ' ) || '–',
						},
					] }
					rows={ rows }
					total={ data?.total || 0 }
					page={ data?.page || 1 }
					pages={ data?.pages || 1 }
					onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
					search={ q.search }
					onSearch={ ( search ) => set( { search } ) }
					searchLabel={ __( 'Search listings', 'sourceweb' ) }
					views={ data?.views || [] }
					view={ q.status }
					onView={ ( status ) => set( { status } ) }
					filters={ data?.filters || [] }
					onFilter={ ( key, value ) => set( { [ key ]: value } ) }
					bulkActions={
						'pending' === q.status
							? [
									{
										value: 'approve',
										label: __(
											'Approve every waiting value',
											'sourceweb'
										),
									},
									{
										value: 'reject',
										label: __(
											'Reject every waiting value',
											'sourceweb'
										),
									},
								]
							: bulkUndo( q.status )
					}
					onBulk={ ( v, ids ) => {
						if (
							'undo' === v &&
							// eslint-disable-next-line no-alert -- a plain browser confirm before a bulk Undo, as for Approve all high
							! window.confirm(
								sprintf(
									/* translators: %d: number of listings ticked. */
									_n(
										'Undo every applied value of %d listing? The values before them come back.',
										'Undo every applied value of %d listings? The values before them come back.',
										ids.length,
										'sourceweb'
									),
									ids.length
								)
							)
						) {
							return;
						}
						decide( { do: v, listings: ids } );
					} }
					rowActions={ ( r ) => [
						{
							label:
								open === r.id
									? __( 'Close', 'sourceweb' )
									: __( 'Review', 'sourceweb' ),
							onClick: () => {
								setOpen( open === r.id ? 0 : r.id );
								window.scrollTo( 0, 0 );
							},
						},
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							href: r.editUrl,
						},
						{
							icon: 'view',
							label: __( 'View', 'sourceweb' ),
							href: r.viewUrl,
						},
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'Nothing here.', 'sourceweb' ) }
				/>
			</SectionCard>
		</>
	);
}

/* ---------- Settings ---------- */

const SERVICES = 'services';

/**
 * The open group from the address (#workers), so a link opens the right group.
 *
 * @param {Array} groups Groups.
 */
function hashGroup( groups ) {
	const h = window.location.hash.replace( '#', '' );
	if ( SERVICES === h || groups.some( ( g ) => g.slug === h ) ) {
		return h;
	}
	return SERVICES;
}

const valuesOf = ( fields ) =>
	fields.reduce( ( o, f ) => ( { ...o, [ f.key ]: f.value } ), {} );

/**
 * A group with its own Save: switches and numbers.
 *
 * @param {Object}   props
 * @param {Object}   props.group   Group from the route.
 * @param {Function} props.onSaved New settings from the route after a save.
 * @param {Function} props.onDirty ( slug, unsaved ) when that changes.
 */
function Group( { group, onSaved, onDirty } ) {
	const [ v, setV ] = useState( () => valuesOf( group.fields ) );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	// Reset only when this group's stored values change, so saving another group keeps unsaved edits here.
	const stored = JSON.stringify( valuesOf( group.fields ) );
	useEffect( () => setV( JSON.parse( stored ) ), [ stored ] );
	const dirty = group.fields.some( ( f ) => v[ f.key ] !== f.value );
	useEffect(
		() => onDirty( group.slug, dirty ),
		[ group.slug, dirty, onDirty ]
	);
	const save = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( `settings/${ group.slug }` ),
			method: 'POST',
			data: { values: v },
		} )
			.then( ( r ) => {
				onSaved( r.settings );
				setMsg( { tone: 'success', text: r.message } );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	const restore = () => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm before a reset, as core's list tables do
			! window.confirm(
				__( 'Reset this section to its defaults?', 'sourceweb' )
			)
		) {
			return;
		}
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( `settings/${ group.slug }` ),
			method: 'POST',
			data: { reset: true },
		} )
			.then( ( r ) => {
				onSaved( r.settings );
				setMsg( { tone: 'success', text: r.message } );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<SettingsGroup
			id={ `sourceweb-group-${ group.slug }` }
			title={ group.label }
			description={ group.description }
			footer={
				<>
					<Button
						variant="primary"
						busy={ busy }
						disabled={ ! dirty }
						onClick={ save }
					>
						{ __( 'Save changes', 'sourceweb' ) }
					</Button>
					{ group.reset && (
						<Button busy={ busy } onClick={ restore }>
							{ __( 'Reset this section', 'sourceweb' ) }
						</Button>
					) }
					<span aria-live="polite">
						{ msg && 'success' === msg.tone ? msg.text : '' }
					</span>
				</>
			}
		>
			{ msg && 'error' === msg.tone && (
				<Notice tone="error" onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ group.fields.map( ( f ) =>
				'switch' === f.type ? (
					<Switch
						key={ f.key }
						label={ f.label }
						help={ f.help }
						checked={ !! v[ f.key ] }
						onChange={ ( on ) => setV( { ...v, [ f.key ]: on } ) }
					/>
				) : (
					<Field
						key={ f.key }
						label={ f.label }
						help={ f.help }
						changed={
							undefined !== f.default && v[ f.key ] !== f.default
						}
						onReset={ () => setV( { ...v, [ f.key ]: f.default } ) }
						render={ ( id, helpId ) => (
							<input
								id={ id }
								type="number"
								min="0"
								step="1"
								value={ v[ f.key ] }
								aria-describedby={ helpId }
								onChange={ ( e ) =>
									setV( {
										...v,
										[ f.key ]: parseInt(
											e.target.value || '0',
											10
										),
									} )
								}
							/>
						) }
					/>
				)
			) }
		</SettingsGroup>
	);
}

/**
 * One enrichment source's row: its switch, and for Google Maps the key (write-only) and the cap's place.
 *
 * @param {Object}   props
 * @param {Object}   props.s       Service from the route.
 * @param {Function} props.onSaved New settings after a save.
 */
function SourceEdit( { s, onSaved } ) {
	const [ on, setOn ] = useState( s.on );
	const [ key, setKey ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	useEffect( () => setOn( s.on ), [ s.on ] );
	const send = ( route, data ) => {
		setBusy( true );
		setMsg( null );
		return apiFetch( { path: path( route ), method: 'POST', data } )
			.then( ( r ) => {
				onSaved( r.settings );
				setMsg( { tone: 'success', text: r.message } );
				setKey( '' );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<>
			<Switch
				label={ __( 'On', 'sourceweb' ) }
				help={ s.help }
				checked={ on }
				onChange={ setOn }
			/>
			{ s.key && (
				<Field
					label={ __( 'Google Places key', 'sourceweb' ) }
					help={
						s.key.set
							? __(
									'A key is set. Type a new one to replace it; leave it empty to keep it. The key is never shown.',
									'sourceweb'
								)
							: __(
									'Not set: the live Google block is hidden. Restrict the key to the Places API.',
									'sourceweb'
								)
					}
					render={ ( id, helpId ) => (
						<input
							id={ id }
							type="password"
							autoComplete="off"
							value={ key }
							aria-describedby={ helpId }
							onChange={ ( e ) => setKey( e.target.value ) }
						/>
					) }
				/>
			) }
			<p>
				<Button
					busy={ busy }
					disabled={ on === s.on }
					onClick={ () =>
						send( 'settings/enrichment', {
							values: { [ s.source ]: on },
						} )
					}
				>
					{ __( 'Save', 'sourceweb' ) }
				</Button>{ ' ' }
				{ s.key && (
					<Button
						busy={ busy }
						disabled={ '' === key.trim() }
						onClick={ () =>
							send( 'settings/google-key', { key: key.trim() } )
						}
					>
						{ __( 'Save key', 'sourceweb' ) }
					</Button>
				) }{ ' ' }
				<span aria-live="polite">
					{ msg && 'success' === msg.tone ? msg.text : '' }
				</span>
			</p>
			{ msg && 'error' === msg.tone && (
				<Notice tone="error" onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
		</>
	);
}

/**
 * Connected services.
 *
 * @param {Object}   props
 * @param {Array}    props.list    Services.
 * @param {Function} props.onSaved New settings after a save.
 */
function Services( { list, onSaved } ) {
	if ( ! list.length ) {
		return (
			<EmptyState
				title={ __( 'No connected services.', 'sourceweb' ) }
			/>
		);
	}
	return (
		<SectionCard
			id={ `sourceweb-group-${ SERVICES }` }
			title={ __( 'Connected services', 'sourceweb' ) }
			description={ __(
				'Each source and service SourceWeb works with. Keys are never sent to this page: a row says only whether one is set.',
				'sourceweb'
			) }
		>
			<ServiceList label={ __( 'Connected services', 'sourceweb' ) }>
				{ list.map( ( s ) => (
					<ServiceRow
						key={ s.slug }
						name={ s.name }
						status={ s.status }
						tone={ s.tone }
						summary={ s.summary }
						editLabel={
							s.source
								? undefined
								: __( 'Details', 'sourceweb' )
						}
					>
						{ s.source ? (
							<SourceEdit s={ s } onSaved={ onSaved } />
						) : (
							<p>
								{ ( s.links || [] ).map( ( l, i ) => (
									<span key={ l.url }>
										{ i > 0 && ' · ' }
										<a href={ l.url }>{ l.label }</a>
									</span>
								) ) }
							</p>
						) }
					</ServiceRow>
				) ) }
			</ServiceList>
		</SectionCard>
	);
}

function Settings() {
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ open, setOpen ] = useState( SERVICES );
	const [ dirty, setDirty ] = useState( {} );
	const markDirty = useCallback(
		( slug, d ) =>
			setDirty( ( o ) =>
				o[ slug ] === d ? o : { ...o, [ slug ]: d }
			),
		[]
	);
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'settings' ) } )
			.then( ( r ) => {
				setData( r );
				setOpen( hashGroup( r.groups ) );
			} )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [] );
	useEffect( () => {
		const onHash = () => data && setOpen( hashGroup( data.groups ) );
		window.addEventListener( 'hashchange', onHash );
		return () => window.removeEventListener( 'hashchange', onHash );
	}, [ data ] );
	const anyDirty = Object.values( dirty ).some( Boolean );
	useEffect( () => {
		const warn = ( e ) => {
			if ( anyDirty ) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener( 'beforeunload', warn );
		return () => window.removeEventListener( 'beforeunload', warn );
	}, [ anyDirty ] );

	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! data ) {
		return (
			<LoadingState
				label={ __( 'Loading the settings…', 'sourceweb' ) }
			/>
		);
	}
	const chips = [
		{
			value: SERVICES,
			label: __( 'Connected services', 'sourceweb' ),
			href: `#${ SERVICES }`,
		},
		...data.groups.map( ( g ) => ( {
			value: g.slug,
			label: dirty[ g.slug ] ? `${ g.label } •` : g.label,
			href: `#${ g.slug }`,
		} ) ),
	];
	return (
		<>
			<ChipRow
				label={ __( 'Settings groups', 'sourceweb' ) }
				chips={ chips }
				value={ open }
				onChange={ setOpen }
			/>
			{ SERVICES === open && (
				<Services list={ data.services } onSaved={ setData } />
			) }
			{ data.groups.map( ( g ) => (
				<div key={ g.slug } hidden={ g.slug !== open }>
					<Group
						group={ g }
						onSaved={ setData }
						onDirty={ markDirty }
					/>
				</div>
			) ) }
			<ExtraParts
				id="backfill"
				title={ __( 'Backfill', 'sourceweb' ) }
			/>
			<SectionCard
				id="elsewhere"
				title={ __( 'On the current screens', 'sourceweb' ) }
				description={ __(
					'These lists keep their own screens for now.',
					'sourceweb'
				) }
			>
				<p>
					{ data.elsewhere.map( ( l, i ) => (
						<span key={ l.url }>
							{ i > 0 && ' · ' }
							<a href={ l.url }>{ l.label }</a>
						</span>
					) ) }
				</p>
			</SectionCard>
		</>
	);
}

/* ---------- Pages with sub-screens (Workers …): the sub-screen is in the address ---------- */

/**
 * The sub-screen from the address (?edit=<id>, ?runs=<id>) and a way to open another one; Back and Forward work.
 *
 * @param {Array} keys Query keys that open a sub-screen.
 * @return {Array} [ { key: value }, go( { key: value } | {} ) ].
 */
function useSub( keys ) {
	const read = () => {
		const q = new URLSearchParams( window.location.search );
		return keys.reduce(
			( o, k ) => ( q.get( k ) ? { ...o, [ k ]: q.get( k ) } : o ),
			{}
		);
	};
	const [ sub, setSub ] = useState( read );
	useEffect( () => {
		const on = () => setSub( read() );
		window.addEventListener( 'popstate', on );
		return () => window.removeEventListener( 'popstate', on );
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps -- read() only uses the keys given once
	const go = ( next ) => {
		const u = new URL( window.location.href );
		keys.forEach( ( k ) => u.searchParams.delete( k ) );
		Object.keys( next ).forEach( ( k ) =>
			u.searchParams.set( k, next[ k ] )
		);
		window.history.pushState( null, '', u.toString() );
		setSub( next );
		window.scrollTo( 0, 0 );
	};
	return [ sub, go ];
}

/**
 * The address of a sub-screen, for real links (open in a new tab works).
 *
 * @param {Object} next { edit: id } or { runs: id }.
 */
const subHref = ( next ) => {
	const u = new URL( window.location.href );
	[
		'edit',
		'runs',
		'view',
		'status',
		'kw',
		'part',
		'tagrule',
		'field',
		'overview',
	].forEach( ( k ) => u.searchParams.delete( k ) );
	Object.keys( next ).forEach( ( k ) => u.searchParams.set( k, next[ k ] ) );
	return u.toString();
};

/**
 * A click on a sub-screen link opens it in place; a modified click (new tab) is left to the browser.
 *
 * @param {Function} go   From useSub().
 * @param {Object}   next The sub-screen.
 */
const inPlace = ( go, next ) => ( e ) => {
	if ( e.metaKey || e.ctrlKey || e.shiftKey || 0 !== e.button ) {
		return;
	}
	e.preventDefault();
	go( next );
};

const TONE = { success: 'ok', error: 'error', warn: 'warn', info: '' };

/**
 * A result in words with the shell's status mark.
 *
 * @param {Object} props
 * @param {string} props.tone  success | error | warn | info.
 * @param {string} props.label Words.
 */
function Status( { tone, label } ) {
	return (
		<span
			className={ `kits-shell-status${
				TONE[ tone ] ? ' is-' + TONE[ tone ] : ''
			}` }
		>
			{ label }
		</span>
	);
}

/* ---------- Workers ---------- */

function Workers() {
	const [ sub, go ] = useSub( [ 'edit', 'runs' ] );
	const [ msg, setMsg ] = useState( null );
	const back = ( m ) => {
		setMsg( m || null );
		go( {} );
	};
	if ( sub.edit ) {
		return <WorkerForm id={ sub.edit } onDone={ back } />;
	}
	if ( sub.runs ) {
		return <WorkerRuns id={ sub.runs } onBack={ () => back() } />;
	}
	return (
		<>
			<WorkerList go={ go } msg={ msg } setMsg={ setMsg } />
			<WorkerUnion />
		</>
	);
}

/** Every worker in one list: workflows from the workers repository and any a plugin adds. */
function WorkerUnion() {
	const [ rows, setRows ] = useState( null );
	const [ error, setError ] = useState( '' );
	useEffect( () => {
		apiFetch( { path: path( 'workers/union' ) } )
			.then( setRows )
			.catch( ( e ) => setError( errText( e ) ) );
	}, [] );
	return (
		<SectionCard
			id="union"
			title={ __( 'All workers', 'sourceweb' ) }
			description={ __(
				'Each worker’s step, where it runs, how it starts, what a person can change and the AI job it uses.',
				'sourceweb'
			) }
		>
			{ error && <Notice tone="error">{ error }</Notice> }
			{ ! rows && ! error && (
				<LoadingState
					label={ __( 'Loading workers…', 'sourceweb' ) }
				/>
			) }
			{ rows && (
				<table className="widefat striped">
					<thead>
						<tr>
							<th>{ __( 'Worker', 'sourceweb' ) }</th>
							<th>{ __( 'Step', 'sourceweb' ) }</th>
							<th>{ __( 'Runs as', 'sourceweb' ) }</th>
							<th>{ __( 'Starts', 'sourceweb' ) }</th>
							<th>{ __( 'A person can', 'sourceweb' ) }</th>
							<th>{ __( 'AI job', 'sourceweb' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ rows.map( ( w ) => (
							<tr key={ w.id }>
								<td>{ w.label }</td>
								<td>{ w.step }</td>
								<td>{ w.runner }</td>
								<td>{ w.trigger }</td>
								<td>{ w.accepts }</td>
								<td>{ w.ai || '—' }</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</SectionCard>
	);
}

function WorkerList( { go, msg, setMsg } ) {
	const [ q, setQ ] = useState( {
		view: '',
		search: '',
		orderby: '',
		order: 'asc',
		page: 1,
	} );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'workers', q ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	const send = ( route, id ) => {
		setMsg( null );
		return apiFetch( { path: path( route ), method: 'POST', data: { id } } )
			.then( ( r ) => setMsg( { tone: 'success', text: r.message } ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const remove = ( r ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			window.confirm(
				sprintf(
					/* translators: %s: worker name. */
					__( 'Delete the planned worker "%s"?', 'sourceweb' ),
					r.title
				)
			)
		) {
			send( 'workers/delete', r.id );
		}
	};
	return (
		<>
			<SectionCard
				id="workers"
				title={ __( 'Workers', 'sourceweb' ) }
				description={ __(
					'One worker per workflow of the workers repository, which reports its start and end here. Schedules are changed in the workflows; names, groups and late limits here. A problem is emailed to the owner once. Planned workers never raise an alert.',
					'sourceweb'
				) }
				actions={
					<a
						className="kits-shell-button is-primary"
						href={ subHref( { edit: 'new' } ) }
						onClick={ inPlace( go, { edit: 'new' } ) }
					>
						{ __( 'Add New Worker', 'sourceweb' ) }
					</a>
				}
			>
				{ data?.runOff && (
					<Notice tone="warning">
						{ __(
							'Run now is off. Add SOURCEWEB_GITHUB_TOKEN (a fine-grained GitHub token for the workers repository only, Actions read and write) and SOURCEWEB_WORKERS_REPO (owner/name) to wp-config.php.',
							'sourceweb'
						) }
					</Notice>
				) }
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				<DataList
					label={ __( 'Workers', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Worker', 'sourceweb' ),
							sortable: true,
							primary: true,
							render: ( r ) => (
								<>
									<a
										href={ subHref( { edit: r.id } ) }
										onClick={ inPlace( go, {
											edit: r.id,
										} ) }
									>
										<strong>{ r.title }</strong>
									</a>{ ' ' }
									<code>{ r.id }</code>
									{ r.what && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.what }
										</span>
									) }
									{ r.problem && (
										<span className="kits-shell-field__help">
											{ ' ' }
											<Status
												tone="error"
												label={ r.problem }
											/>
										</span>
									) }
								</>
							),
						},
						{
							key: 'group',
							label: __( 'Group', 'sourceweb' ),
							sortable: true,
							render: ( r ) => r.groupLabel,
						},
						{
							key: 'file',
							label: __( 'Workflow file', 'sourceweb' ),
							render: ( r ) =>
								r.fileUrl ? (
									<a href={ r.fileUrl }>
										<code>{ r.file }</code>
									</a>
								) : (
									<>
										<code>{ r.file }</code>{ ' ' }
										<span className="kits-shell-field__help">
											{ __(
												'Not built yet',
												'sourceweb'
											) }
										</span>
									</>
								),
						},
						{
							key: 'schedule',
							label: __( 'Schedule (IST)', 'sourceweb' ),
							render: ( r ) => (
								<>
									{ r.schedule || '—' }
									{ r.late && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.late }
										</span>
									) }
								</>
							),
						},
						{
							key: 'last_run',
							label: __( 'Last run', 'sourceweb' ),
							sortable: true,
							render: ( r ) => {
								if ( ! r.last ) {
									return r.planned
										? '—'
										: __( 'No report yet', 'sourceweb' );
								}
								return (
									<>
										<Status
											tone={ r.last.tone }
											label={ r.last.label }
										/>{ ' ' }
										{ r.last.when }
										{ r.last.took
											? ` · ${ r.last.took }`
											: '' }
										{ r.last.counts && (
											<span className="kits-shell-field__help">
												{ ' ' }
												{ r.last.counts }
											</span>
										) }
									</>
								);
							},
						},
						{
							key: 'status',
							label: __( 'Status', 'sourceweb' ),
							sortable: true,
							render: ( r ) => (
								<>
									<Status
										tone={
											{
												late: 'warn',
												failing: 'error',
												active: 'success',
											}[ r.status ] || 'info'
										}
										label={ r.statusLabel }
									/>
									{ r.statusNote && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.statusNote }
										</span>
									) }
								</>
							),
						},
						{
							key: 'keys',
							label: __( 'Keys', 'sourceweb' ),
						},
					] }
					rows={ data?.rows || [] }
					total={ data?.total || 0 }
					page={ data?.page || 1 }
					pages={ data?.pages || 1 }
					onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
					search={ q.search }
					onSearch={ ( search ) => set( { search } ) }
					searchLabel={ __( 'Search workers', 'sourceweb' ) }
					views={ data?.views || [] }
					view={ q.view }
					onView={ ( view ) => set( { view } ) }
					sort={ { key: q.orderby, dir: q.order } }
					onSort={ ( orderby, order ) => set( { orderby, order } ) }
					rowActions={ ( r ) => [
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							onClick: () => go( { edit: r.id } ),
						},
						...( r.planned
							? []
							: [
									{
										label: __( 'Run now', 'sourceweb' ),
										onClick: () =>
											send( 'workers/run', r.id ),
										disabled: ! r.canRun,
										why: r.canRun
											? ''
											: __(
													'Needs input or the dispatch token',
													'sourceweb'
												),
									},
								] ),
						{
							label: __( 'View runs', 'sourceweb' ),
							onClick: () => go( { runs: r.id } ),
						},
						...( r.planned
							? [
									{
										icon: 'delete',
										label: __( 'Delete', 'sourceweb' ),
										tone: 'error',
										onClick: () => remove( r ),
									},
								]
							: [] ),
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'No workers found.', 'sourceweb' ) }
				/>
			</SectionCard>
			<SectionCard
				id="run-now-log"
				title={ __( 'Run now log', 'sourceweb' ) }
				description={ __(
					'The last 50 times Run now was used.',
					'sourceweb'
				) }
			>
				{ data && data.log.length ? (
					<RefTable
						caption={ __( 'Run now log', 'sourceweb' ) }
						head={ [
							__( 'When', 'sourceweb' ),
							__( 'Who', 'sourceweb' ),
							__( 'Worker', 'sourceweb' ),
							__( 'Result', 'sourceweb' ),
						] }
						rows={ data.log }
					/>
				) : (
					<p>{ __( 'None yet.', 'sourceweb' ) }</p>
				) }
			</SectionCard>
		</>
	);
}

/**
 * A text input inside a Field.
 *
 * @param {Object}   props
 * @param {string}   props.label    Label.
 * @param {string}   props.help     Help line.
 * @param {string}   props.value    Value.
 * @param {Function} props.onChange New value.
 * @param {Object}   props.input    More input attributes (type, min, placeholder, rows for a textarea).
 */
function TextField( { label, help, value, onChange, input = {} } ) {
	const { rows, ...attrs } = input;
	return (
		<Field
			label={ label }
			help={ help }
			render={ ( id, helpId ) =>
				rows ? (
					<textarea
						id={ id }
						rows={ rows }
						value={ value }
						aria-describedby={ helpId }
						onChange={ ( e ) => onChange( e.target.value ) }
					/>
				) : (
					<input
						id={ id }
						type="text"
						value={ value }
						aria-describedby={ helpId }
						onChange={ ( e ) => onChange( e.target.value ) }
						{ ...attrs }
					/>
				)
			}
		/>
	);
}

/**
 * A select inside a Field (the shell's styled select is not built yet: the browser's own).
 *
 * @param {Object}   props
 * @param {string}   props.label    Label.
 * @param {string}   props.help     Help line.
 * @param {string}   props.value    Value.
 * @param {Array}    props.options  [ { value, label } ].
 * @param {Function} props.onChange New value.
 */
function SelectField( { label, help, value, options, onChange } ) {
	return (
		<Field
			label={ label }
			help={ help }
			render={ ( id, helpId ) => (
				<select
					id={ id }
					value={ value }
					aria-describedby={ helpId }
					onChange={ ( e ) => onChange( e.target.value ) }
				>
					{ options.map( ( o ) => (
						<option key={ o.value } value={ o.value }>
							{ o.label }
						</option>
					) ) }
				</select>
			) }
		/>
	);
}

/**
 * Add New Worker or edit one: name, what it does, group (or a new one), late limit, schedule wanted (Planned) and the
 * saved keys it may use.
 *
 * @param {Object}   props
 * @param {string}   props.id     Worker ID or 'new'.
 * @param {Function} props.onDone Back to the list, with a notice.
 */
function WorkerForm( { id, onDone } ) {
	const [ w, setW ] = useState( null );
	const [ v, setV ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( `workers/${ encodeURIComponent( id ) }` ) } )
			.then( ( r ) => {
				setW( r );
				setV( {
					id: '',
					name: r.name,
					what: r.what,
					group: r.group,
					group_new: '',
					late: r.late,
					schedule: r.schedule,
					keys: r.keys.filter( ( k ) => k.on ).map( ( k ) => k.id ),
				} );
			} )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [ id ] );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! w || ! v ) {
		return (
			<LoadingState
				label={ __( 'Loading the worker…', 'sourceweb' ) }
			/>
		);
	}
	const put = ( k ) => ( val ) => setV( { ...v, [ k ]: val } );
	const save = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'workers/save' ),
			method: 'POST',
			data: {
				...v,
				edit: w.new ? 'new' : w.id,
				keysShown: w.keys.length > 0,
			},
		} )
			.then( ( r ) =>
				onDone( {
					tone: 'same' === r.done ? 'info' : 'success',
					text: r.message,
				} )
			)
			.catch( ( e ) => {
				setMsg( { tone: 'error', text: errText( e ) } );
				setBusy( false );
			} );
	};
	const tick = ( kid, on ) =>
		setV( {
			...v,
			keys: on ? [ ...v.keys, kid ] : v.keys.filter( ( x ) => x !== kid ),
		} );
	const reg = w.registry;
	return (
		<SettingsGroup
			id="worker-form"
			title={
				w.new
					? __( 'Add New Worker', 'sourceweb' )
					: sprintf(
							/* translators: %s: worker name. */
							__( 'Edit %s', 'sourceweb' ),
							w.name
						)
			}
			description={
				w.new
					? __(
							'A planned worker: the ID is the file name its workflow will have, without .yml. It shows "Not built yet" until a workflow with that ID reports a run, and never raises an alert.',
							'sourceweb'
						)
					: ''
			}
			footer={
				<>
					<Button variant="primary" busy={ busy } onClick={ save }>
						{ w.new
							? __( 'Add worker', 'sourceweb' )
							: __( 'Save changes', 'sourceweb' ) }
					</Button>{ ' ' }
					<Button onClick={ () => onDone() }>
						{ __( 'Cancel', 'sourceweb' ) }
					</Button>
				</>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ w.new ? (
				<TextField
					label={ __( 'ID', 'sourceweb' ) }
					help={ __(
						'e.g. press-news for press-news.yml. Lowercase letters, digits and hyphens. It never changes.',
						'sourceweb'
					) }
					value={ v.id }
					onChange={ put( 'id' ) }
					input={ { pattern: '[a-z0-9_-]+', className: 'code' } }
				/>
			) : (
				<RefTable
					caption={ __( 'The worker', 'sourceweb' ) }
					head={ [
						__( 'Item', 'sourceweb' ),
						__( 'Value', 'sourceweb' ),
					] }
					rows={ [
						[
							__( 'ID', 'sourceweb' ),
							<>
								<code>{ w.id }</code>{ ' ' }
								{ __( '(IDs never change)', 'sourceweb' ) }
							</>,
						],
						...( reg
							? [
									[
										__( 'Workflow', 'sourceweb' ),
										reg.fileUrl ? (
											<a key="f" href={ reg.fileUrl }>
												<code>{ reg.file }</code>
											</a>
										) : (
											<code key="f">{ reg.file }</code>
										),
									],
									[
										__( 'Schedule (IST)', 'sourceweb' ),
										`${ reg.schedule } ${ __(
											'(changed in the workflow)',
											'sourceweb'
										) }`,
									],
								]
							: [] ),
					] }
				/>
			) }
			<TextField
				label={ __( 'Name', 'sourceweb' ) }
				help={
					reg
						? sprintf(
								/* translators: %s: name in the workflow. */
								__(
									'In the workflow: %s. Leave empty for that name.',
									'sourceweb'
								),
								reg.name
							)
						: ''
				}
				value={ v.name }
				onChange={ put( 'name' ) }
			/>
			<TextField
				label={ __( 'What it does', 'sourceweb' ) }
				help={
					reg
						? __(
								"Leave empty for the registry's description.",
								'sourceweb'
							)
						: ''
				}
				value={ v.what }
				onChange={ put( 'what' ) }
				input={ { rows: 3 } }
			/>
			<SelectField
				label={ __( 'Group', 'sourceweb' ) }
				value={ v.group }
				options={ w.groups }
				onChange={ put( 'group' ) }
			/>
			<TextField
				label={ __( 'Or a new group', 'sourceweb' ) }
				help={ __(
					'A new group is added to the list (with a generic icon).',
					'sourceweb'
				) }
				value={ v.group_new }
				onChange={ put( 'group_new' ) }
			/>
			<TextField
				label={ __( 'Late after (hours)', 'sourceweb' ) }
				help={
					w.planned
						? __(
								'Blank: never late. Planned workers never raise an alert; this applies once the workflow is in the registry.',
								'sourceweb'
							)
						: sprintf(
								/* translators: %s: late limit in the registry. */
								__(
									'Blank: never late (no alert). In the registry: %s.',
									'sourceweb'
								),
								reg?.late || ''
							)
				}
				value={ v.late }
				onChange={ put( 'late' ) }
				input={ { type: 'number', min: '1', step: '1' } }
			/>
			{ w.planned && (
				<TextField
					label={ __( 'Schedule wanted', 'sourceweb' ) }
					help={ __(
						'In words, for whoever builds the workflow (e.g. daily at 06:00 IST).',
						'sourceweb'
					) }
					value={ v.schedule }
					onChange={ put( 'schedule' ) }
				/>
			) }
			<SettingsBlock
				title={ __( 'Keys', 'sourceweb' ) }
				description={ __(
					'Ticked: this worker may use the key. Unticking a key that is for all workers makes it for every other worker. Keys show only their last 4 characters.',
					'sourceweb'
				) }
			>
				{ w.keys.length ? (
					<fieldset className="kits-shell-checks">
						<legend className="screen-reader-text">
							{ __( 'Keys', 'sourceweb' ) }
						</legend>
						{ w.keys.map( ( k ) => (
							<label key={ k.id } htmlFor={ `sw-key-${ k.id }` }>
								<input
									id={ `sw-key-${ k.id }` }
									type="checkbox"
									checked={ v.keys.includes( k.id ) }
									onChange={ ( e ) =>
										tick( k.id, e.target.checked )
									}
								/>{ ' ' }
								{ k.short }{ ' ' }
								<span className="kits-shell-field__help">
									({ k.scope })
								</span>
							</label>
						) ) }
					</fieldset>
				) : (
					<p>
						{ __( 'No keys saved.', 'sourceweb' ) }{ ' ' }
						<a href={ w.addKey }>
							{ __( 'Add New Key', 'sourceweb' ) }
						</a>
					</p>
				) }
			</SettingsBlock>
		</SettingsGroup>
	);
}

/**
 * A worker's reported runs, newest first, read-only.
 *
 * @param {Object}   props
 * @param {string}   props.id     Worker ID.
 * @param {Function} props.onBack Back to the list.
 */
function WorkerRuns( { id, onBack } ) {
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( '' );
	const load = () => {
		setError( '' );
		apiFetch( {
			path: path( `workers/${ encodeURIComponent( id ) }/runs` ),
		} )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [ id ] );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! data ) {
		return (
			<LoadingState label={ __( 'Loading the runs…', 'sourceweb' ) } />
		);
	}
	return (
		<SectionCard
			id="worker-runs"
			title={ sprintf(
				/* translators: %s: worker name. */
				__( 'Runs: %s', 'sourceweb' ),
				data.name
			) }
			description={ sprintf(
				/* translators: %d: number of runs kept. */
				__(
					'The last %d runs the workflow reported (start and end), newest first.',
					'sourceweb'
				),
				data.keep
			) }
			actions={
				<>
					<Button onClick={ onBack }>
						{ __( 'Back to the workers', 'sourceweb' ) }
					</Button>
					{ data.githubUrl && (
						<a className="kits-shell-link" href={ data.githubUrl }>
							{ __( 'Runs on GitHub', 'sourceweb' ) }
						</a>
					) }
				</>
			}
		>
			<DataList
				label={ __( 'Runs', 'sourceweb' ) }
				rowTitle="id"
				columns={ [
					{
						key: 'id',
						label: __( 'Run', 'sourceweb' ),
						primary: true,
						render: ( r ) => (
							<>
								{ r.link ? (
									<a href={ r.link }>{ r.id }</a>
								) : (
									r.id
								) }
								{ r.attempt > 1
									? ` ${ sprintf(
											/* translators: %d: attempt number. */
											__( '(attempt %d)', 'sourceweb' ),
											r.attempt
										) }`
									: '' }
							</>
						),
					},
					{
						key: 'when',
						label: __( 'Started', 'sourceweb' ),
						render: ( r ) => r.when || '—',
					},
					{
						key: 'took',
						label: __( 'Took', 'sourceweb' ),
						render: ( r ) => r.took || '—',
					},
					{
						key: 'label',
						label: __( 'Result', 'sourceweb' ),
						render: ( r ) => (
							<Status tone={ r.tone } label={ r.label } />
						),
					},
					{
						key: 'event',
						label: __( 'Started by', 'sourceweb' ),
					},
					{
						key: 'counts',
						label: __( 'Counts', 'sourceweb' ),
						render: ( r ) => r.counts || '—',
					},
					{
						key: 'commit',
						label: __( 'Commit', 'sourceweb' ),
						render: ( r ) =>
							r.commit && r.commitUrl ? (
								<a href={ r.commitUrl }>
									<code>{ r.commit }</code>
								</a>
							) : r.commit ? (
								<code>{ r.commit }</code>
							) : (
								'—'
							),
					},
				] }
				rows={ data.rows }
				total={ data.rows.length }
				emptyTitle={
					data.planned
						? __( 'Not built yet: no runs.', 'sourceweb' )
						: __( 'No runs reported yet.', 'sourceweb' )
				}
			/>
		</SectionCard>
	);
}

/* ---------- Sources ---------- */

const SOURCE_ACTIONS = {
	allow: __( 'Change to Allowed', 'sourceweb' ),
	neutral: __( 'Change to Neutral', 'sourceweb' ),
	block: __( 'Change to Blocked', 'sourceweb' ),
	press_add: __( 'Search here for coverage', 'sourceweb' ),
	press_remove: __( 'Stop searching here', 'sourceweb' ),
	relay_on: __( 'Relay on (fetch through this site)', 'sourceweb' ),
	relay_off: __( 'Relay off', 'sourceweb' ),
};

function Sources() {
	const [ sub, go ] = useSub( [ 'edit', 'view', 'feed', 'type', 'host' ] );
	const [ msg, setMsg ] = useState( null );
	const back = ( m ) => {
		setMsg( m || null );
		go( {} );
	};
	// The feed form (&feed=<id|new>): the classic form's own parts, drawn here; Add Feed and Update post to the same
	// handler and come back to the list it was opened from.
	if ( sub.feed && ( app.feed || [] ).length > 0 ) {
		return (
			<SectionCard
				id="feed"
				title={
					'new' === sub.feed
						? __( 'Add New Feed', 'sourceweb' )
						: __( 'Edit Feed', 'sourceweb' )
				}
				actions={
					<Button
						onClick={ () =>
							sub.host
								? go( { edit: sub.host } )
								: go( { view: 'feeds' } )
						}
					>
						{ sub.host
							? __( 'Back to the source', 'sourceweb' )
							: __( 'Back to Feeds', 'sourceweb' ) }
					</Button>
				}
			>
				<PageParts
					parts={ app.feed.filter( ( p ) => 'heading' !== p.type ) }
					title={ __( 'Feed', 'sourceweb' ) }
				/>
			</SectionCard>
		);
	}
	if ( sub.edit ) {
		return (
			<SourceForm
				host={ 'new' === sub.edit ? '' : sub.edit }
				onDone={ back }
				go={ go }
			/>
		);
	}
	if ( 'feeds' === sub.view ) {
		return (
			<SectionCard
				id="feeds"
				title={ __( 'Feeds', 'sourceweb' ) }
				description={ __(
					'Every feed and source read by code (News, Library and Opportunity), with the site each belongs to.',
					'sourceweb'
				) }
				actions={
					<Button onClick={ () => back() }>
						{ __( 'Back to Sources', 'sourceweb' ) }
					</Button>
				}
			>
				<Feeds host="" go={ go } />
			</SectionCard>
		);
	}
	return <SourceList go={ go } msg={ msg } setMsg={ setMsg } />;
}

function SourceList( { go, msg, setMsg } ) {
	const first = new URLSearchParams( window.location.search ).get( 'status' );
	const [ q, setQ ] = useState( {
		view: first || '',
		search: '',
		orderby: '',
		order: 'desc',
		page: 1,
	} );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ shorts, setShorts ] = useState( {} );
	const [ busy, setBusy ] = useState( false );
	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'sources', q ) } )
			.then( ( r ) => {
				setData( r );
				setShorts( {} );
			} )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	const send = ( route, data2 ) => {
		setMsg( null );
		setBusy( true );
		return apiFetch( { path: path( route ), method: 'POST', data: data2 } )
			.then( ( r ) =>
				setMsg( {
					tone: r.changed ? 'success' : 'info',
					text: r.message,
				} )
			)
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => {
				setBusy( false );
				load();
			} );
	};
	const decide = ( action, hosts ) =>
		send( 'sources/decide', { action, hosts } );
	const remove = ( r ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			window.confirm(
				sprintf(
					/* translators: %s: host. */
					__(
						'Delete the source %s? This cannot be undone.',
						'sourceweb'
					),
					r.id
				)
			)
		) {
			decide( 'delete', [ r.id ] );
		}
	};
	const phase = data?.phase ?? 0;
	const bulk = Object.keys( SOURCE_ACTIONS )
		.filter(
			( k ) =>
				! ( k.startsWith( 'press_' ) && phase >= 2 ) &&
				! ( k.startsWith( 'relay_' ) && phase < 1 )
		)
		.map( ( k ) => ( { value: k, label: SOURCE_ACTIONS[ k ] } ) );
	const edited = Object.keys( shorts ).length > 0;
	const views = [
		...( data?.views || [] ),
		...( data
			? [
					{
						value: '__feeds',
						label: __( 'Feeds', 'sourceweb' ),
						count: data.feedCount,
					},
				]
			: [] ),
	];
	return (
		<SectionCard
			id="sources"
			title={ __( 'Sources', 'sourceweb' ) }
			description={ __(
				'Every host the workers have sent, and every site a feed or a source read by code comes from. Blocked publishers are refused; Neutral is the default for new hosts; Allowed publishers skip the keyword check. Short name: what cards show on the source chip.',
				'sourceweb'
			) }
			actions={
				<>
					<Button
						busy={ busy }
						disabled={ ! edited }
						onClick={ () =>
							send( 'sources/short', { short: shorts } )
						}
					>
						{ __( 'Save short names', 'sourceweb' ) }
					</Button>
					<a
						className="kits-shell-button is-primary"
						href={ subHref( { edit: 'new' } ) }
						onClick={ inPlace( go, { edit: 'new' } ) }
					>
						{ __( 'Add New Source', 'sourceweb' ) }
					</a>
				</>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ data?.stale && (
				<Notice tone="info">
					{ __(
						'Search value: Search Console has not run within 28 days, so there are no figures for this window.',
						'sourceweb'
					) }
				</Notice>
			) }
			<DataList
				label={ __( 'Sources', 'sourceweb' ) }
				columns={ [
					{
						key: 'title',
						label: __( 'Site', 'sourceweb' ),
						sortable: true,
						primary: true,
						render: ( r ) => (
							<span className="kits-shell-withicon">
								{ r.icon ? (
									<img
										className="kits-shell-service__icon"
										src={ r.icon }
										alt=""
										width="32"
										height="32"
										loading="lazy"
									/>
								) : (
									<span
										className="kits-shell-service__icon is-blank"
										aria-hidden="true"
									>
										{ r.id.charAt( 0 ).toUpperCase() }
									</span>
								) }
								<span>
									<a
										href={ subHref( { edit: r.id } ) }
										onClick={ inPlace( go, {
											edit: r.id,
										} ) }
									>
										<strong>{ r.id }</strong>
									</a>
									{ r.name && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.name }
										</span>
									) }
									{ 'block' === r.status && (
										<span className="kits-shell-field__help">
											{ ' ' }
											<Status
												tone="error"
												label={ __(
													'Blocked: new items from it are refused. Items already on the site are unchanged.',
													'sourceweb'
												) }
											/>
										</span>
									) }
								</span>
							</span>
						),
					},
					{
						key: 'short',
						label: __( 'Short name', 'sourceweb' ),
						render: ( r ) =>
							r.pub ? (
								<input
									type="text"
									maxLength="24"
									size="12"
									aria-label={ sprintf(
										/* translators: %s: host. */
										__(
											'Short name for %s',
											'sourceweb'
										),
										r.id
									) }
									value={ shorts[ r.id ] ?? r.short }
									onChange={ ( e ) =>
										setShorts( {
											...shorts,
											[ r.id ]: e.target.value,
										} )
									}
								/>
							) : (
								'—'
							),
					},
					{
						key: 'status',
						label: __( 'Status', 'sourceweb' ),
						sortable: true,
						render: ( r ) => (
							<>
								{ r.pub ? (
									<Status
										tone={
											{
												allow: 'success',
												block: 'error',
											}[ r.status ] || 'info'
										}
										label={ r.statusText }
									/>
								) : (
									<span className="kits-shell-field__help">
										{ r.statusText }
									</span>
								) }
								{ r.press && (
									<span className="kits-shell-field__help">
										{ ' ' }
										{ __(
											'Searched for coverage',
											'sourceweb'
										) }
									</span>
								) }
							</>
						),
					},
					{
						key: 'rating',
						label: __( 'Rating', 'sourceweb' ),
						render: ( r ) => {
							if ( ! r.rating ) {
								return '–';
							}
							return r.ratingUrl ? (
								<a href={ r.ratingUrl }>{ r.rating }</a>
							) : (
								r.rating
							);
						},
					},
					{
						key: 'dr',
						label: __( 'Domain Rating', 'sourceweb' ),
						sortable: true,
						render: ( r ) =>
							null === r.dr ? (
								'—'
							) : (
								<>
									{ r.dr }
									{ r.drAt && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.drAt }
										</span>
									) }
								</>
							),
					},
					{
						key: 'feeds',
						label: __( 'Feeds', 'sourceweb' ),
						sortable: true,
						render: ( r ) =>
							r.feeds ? (
								<a
									href={ subHref( { edit: r.id } ) }
									onClick={ inPlace( go, { edit: r.id } ) }
								>
									{ r.feedsText }
								</a>
							) : (
								'—'
							),
					},
					{
						key: 'relay',
						label: __( 'Relay', 'sourceweb' ),
						render: ( r ) => {
							if ( ! r.relay ) {
								return '—';
							}
							return (
								<>
									{ __( 'On', 'sourceweb' ) }
									<span className="kits-shell-field__help">
										{ ' ' }
										{ r.relayLast
											? sprintf(
													/* translators: %s: last result. */
													__(
														'Last: %s',
														'sourceweb'
													),
													r.relayLast
												)
											: __(
													'Not used yet',
													'sourceweb'
												) }
									</span>
								</>
							);
						},
					},
					{
						key: 'items',
						label: __(
							'Items (30 days / published)',
							'sourceweb'
						),
						sortable: true,
					},
					{
						key: 'search',
						label: __( 'Search value', 'sourceweb' ),
						sortable: true,
						render: ( r ) => r.search || '—',
					},
					{
						key: 'seo',
						label: __( 'SEO', 'sourceweb' ),
						render: ( r ) =>
							r.seoAt ? (
								<>
									{ r.seoTitle }
									{ r.seoDesc && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.seoDesc }
										</span>
									) }
									<span className="kits-shell-field__help">
										{ ' ' }
										{ r.seoAt }
									</span>
								</>
							) : (
								__( 'Not checked yet', 'sourceweb' )
							),
					},
					{
						key: 'last',
						label: __( 'Last seen', 'sourceweb' ),
						sortable: true,
						render: ( r ) => r.last || '—',
					},
				] }
				rows={ data?.rows || [] }
				total={ data?.total || 0 }
				page={ data?.page || 1 }
				pages={ data?.pages || 1 }
				onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
				search={ q.search }
				onSearch={ ( search ) => set( { search } ) }
				searchLabel={ __( 'Search sources', 'sourceweb' ) }
				views={ views }
				view={ q.view }
				onView={ ( view ) =>
					'__feeds' === view
						? go( { view: 'feeds' } )
						: set( { view } )
				}
				sort={ { key: q.orderby, dir: q.order } }
				onSort={ ( orderby, order ) => set( { orderby, order } ) }
				bulkActions={ bulk }
				onBulk={ decide }
				rowActions={ ( r ) => [
					{
						icon: 'edit',
						label: __( 'Edit', 'sourceweb' ),
						onClick: () => go( { edit: r.id } ),
					},
					...( r.pub
						? [ 'allow', 'neutral', 'block' ]
								.filter( ( st ) => st !== r.status )
								.map( ( st ) => ( {
									label: {
										allow: __( 'Allow', 'sourceweb' ),
										neutral: __( 'Neutral', 'sourceweb' ),
										block: __( 'Block', 'sourceweb' ),
									}[ st ],
									tone: 'block' === st ? 'error' : '',
									onClick: () => decide( st, [ r.id ] ),
								} ) )
						: [] ),
					...( phase < 2
						? [
								{
									label: r.press
										? SOURCE_ACTIONS.press_remove
										: SOURCE_ACTIONS.press_add,
									onClick: () =>
										decide(
											r.press
												? 'press_remove'
												: 'press_add',
											[ r.id ]
										),
								},
							]
						: [] ),
					...( phase >= 1
						? [
								{
									label: r.relayOwn
										? __( 'Relay off', 'sourceweb' )
										: __( 'Relay on', 'sourceweb' ),
									onClick: () =>
										decide(
											r.relayOwn
												? 'relay_off'
												: 'relay_on',
											[ r.id ]
										),
								},
							]
						: [] ),
					...( r.canDelete
						? [
								{
									icon: 'delete',
									label: __( 'Delete', 'sourceweb' ),
									tone: 'error',
									onClick: () => remove( r ),
								},
							]
						: [] ),
				] }
				loading={ loading }
				error={ error }
				onRetry={ load }
				emptyTitle={ __( 'No sources.', 'sourceweb' ) }
			/>
		</SectionCard>
	);
}

/**
 * Add a source or edit one, then its feeds.
 *
 * @param {Object}   props
 * @param {string}   props.host   Host, or '' to add.
 * @param {Function} props.onDone Back to the list, with a notice.
 * @param {Function} props.go     From useSub().
 */
function SourceForm( { host, onDone, go } ) {
	const [ s, setS ] = useState( null );
	const [ v, setV ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'sources/one', { host } ) } )
			.then( ( r ) => {
				setS( r );
				setV( {
					host: r.host,
					name: r.name,
					short: r.short,
					status: r.status,
					press: r.press,
					relay: r.relay,
				} );
			} )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [ host ] );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! s || ! v ) {
		return (
			<LoadingState
				label={ __( 'Loading the source…', 'sourceweb' ) }
			/>
		);
	}
	const put = ( k ) => ( val ) => setV( { ...v, [ k ]: val } );
	const save = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( { path: path( 'sources/save' ), method: 'POST', data: v } )
			.then( ( r ) =>
				onDone( {
					tone: r.changed ? 'success' : 'info',
					text: r.message,
				} )
			)
			.catch( ( e ) => {
				setMsg( { tone: 'error', text: errText( e ) } );
				setBusy( false );
			} );
	};
	return (
		<>
			<SettingsGroup
				id="source-form"
				title={
					s.new
						? __( 'Add New Source', 'sourceweb' )
						: sprintf(
								/* translators: %s: host. */
								__( 'Edit Source: %s', 'sourceweb' ),
								s.host
							)
				}
				footer={
					<>
						<Button
							variant="primary"
							busy={ busy }
							onClick={ save }
						>
							{ s.new
								? __( 'Add Source', 'sourceweb' )
								: __( 'Update', 'sourceweb' ) }
						</Button>{ ' ' }
						<Button onClick={ () => onDone() }>
							{ __( 'Cancel', 'sourceweb' ) }
						</Button>
					</>
				}
			>
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				{ s.new ? (
					<TextField
						label={ __( 'Host', 'sourceweb' ) }
						help={ __(
							"The site's host or any address on it (https://www.example.com/news/ becomes example.com).",
							'sourceweb'
						) }
						value={ v.host }
						onChange={ put( 'host' ) }
						input={ { placeholder: 'example.com' } }
					/>
				) : (
					<p>
						<strong>{ s.host }</strong>{ ' ' }
						<a href={ `https://${ s.host }/` }>
							{ __( 'Visit site', 'sourceweb' ) }
						</a>
					</p>
				) }
				<TextField
					label={ __( 'Name', 'sourceweb' ) }
					help={ __(
						"The publisher's name, shown on item pages. Kept on publisher records only.",
						'sourceweb'
					) }
					value={ v.name }
					onChange={ put( 'name' ) }
				/>
				<TextField
					label={ __( 'Short name', 'sourceweb' ) }
					help={ __(
						'What cards show on the source chip (e.g. TOI, PIB, Sentinel).',
						'sourceweb'
					) }
					value={ v.short }
					onChange={ put( 'short' ) }
					input={ { maxLength: 24 } }
				/>
				<SelectField
					label={ __( 'Status', 'sourceweb' ) }
					help={ __(
						'Blocked publishers are refused when the workers send their items. Neutral is the default for new hosts the workers find. Allowed publishers skip the keyword check.',
						'sourceweb'
					) }
					value={ v.status }
					options={ s.options }
					onChange={ put( 'status' ) }
				/>
				{ s.pressShown && (
					<Switch
						label={ __(
							'Search here for coverage',
							'sourceweb'
						) }
						help={ __(
							'The press queries also run on this site.',
							'sourceweb'
						) }
						checked={ v.press }
						onChange={ put( 'press' ) }
					/>
				) }
				{ s.relayShown && (
					<Switch
						label={ __(
							'Fetch through this site (relay)',
							'sourceweb'
						) }
						help={
							__(
								"When this site refuses the workers (GitHub's servers) with 403, they ask this site to fetch the feed or page. Its subdomains are included.",
								'sourceweb'
							) +
							( s.relayLast
								? ' ' +
									sprintf(
										/* translators: %s: last result. */
										__(
											'Last relay result: %s.',
											'sourceweb'
										),
										s.relayLast
									)
								: '' )
						}
						checked={ v.relay }
						onChange={ put( 'relay' ) }
					/>
				) }
			</SettingsGroup>
			{ ! s.new && (
				<SectionCard
					id="source-feeds"
					title={ __( 'Feeds', 'sourceweb' ) }
					description={ __(
						"This site's feeds and sources read by code.",
						'sourceweb'
					) }
				>
					<Feeds host={ s.host } go={ go } />
				</SectionCard>
			) }
		</>
	);
}

/**
 * The feeds list: every feed, or one site's. On, off, keyword check and delete here; the feed form opens today's screen.
 *
 * @param {Object}   props
 * @param {string}   props.host One site, or ''.
 * @param {Function} props.go   From useSub().
 */
function Feeds( { host, go } ) {
	const [ q, setQ ] = useState( { view: '', search: '', page: 1 } );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		const view = q.view;
		apiFetch( {
			path: path( 'sources/feeds', {
				host,
				type: [ 'on', 'off' ].includes( view ) ? '' : view,
				state: [ 'on', 'off' ].includes( view ) ? view : '',
				search: q.search,
				page: q.page,
			} ),
		} )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q, host ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	const op = ( o, ids ) => {
		setMsg( null );
		return apiFetch( {
			path: path( 'sources/feeds/decide' ),
			method: 'POST',
			data: { op: o, ids },
		} )
			.then( ( r ) =>
				setMsg( {
					tone: r.changed ? 'success' : 'info',
					text: r.message,
				} )
			)
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const remove = ( r ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			window.confirm(
				sprintf(
					/* translators: %s: feed name. */
					__(
						'Delete the feed "%s"? This cannot be undone.',
						'sourceweb'
					),
					r.title
				)
			)
		) {
			op( 'delete', [ r.id ] );
		}
	};
	return (
		<>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ data && (
				<p>
					<a href={ data.addUrl }>
						{ __( 'Add New Feed', 'sourceweb' ) }
					</a>
				</p>
			) }
			<DataList
				label={ __( 'Feeds', 'sourceweb' ) }
				columns={ [
					{
						key: 'title',
						label: __( 'Name', 'sourceweb' ),
						primary: true,
						render: ( r ) => (
							<a href={ r.editUrl }>
								<strong>{ r.title }</strong>
							</a>
						),
					},
					{
						key: 'typeText',
						label: __( 'Type', 'sourceweb' ),
					},
					{
						key: 'address',
						label: __( 'Address', 'sourceweb' ),
						render: ( r ) => (
							<>
								<code>{ r.address }</code>
								{ r.note && (
									<span className="kits-shell-field__help">
										{ ' ' }
										{ r.note }
									</span>
								) }
							</>
						),
					},
					...( host
						? []
						: [
								{
									key: 'host',
									label: __( 'Publisher', 'sourceweb' ),
									render: ( r ) =>
										r.host ? (
											<a
												href={ subHref( {
													edit: r.host,
												} ) }
												onClick={ inPlace( go, {
													edit: r.host,
												} ) }
											>
												{ r.host }
											</a>
										) : (
											'—'
										),
								},
							] ),
					{
						key: 'on',
						label: __( 'On', 'sourceweb' ),
						render: ( r ) =>
							r.on ? (
								<Status
									tone="success"
									label={ __( 'On', 'sourceweb' ) }
								/>
							) : (
								<Status
									tone="info"
									label={ __( 'Off', 'sourceweb' ) }
								/>
							),
					},
					{
						key: 'filter',
						label: __( 'Keyword check', 'sourceweb' ),
					},
				] }
				rows={ data?.rows || [] }
				total={ data?.total || 0 }
				page={ data?.page || 1 }
				pages={ data?.pages || 1 }
				onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
				search={ q.search }
				onSearch={ host ? undefined : ( search ) => set( { search } ) }
				searchLabel={ __( 'Search feeds', 'sourceweb' ) }
				views={ host ? [] : data?.views || [] }
				view={ q.view }
				onView={ ( view ) => set( { view } ) }
				bulkActions={ [
					{ value: 'on', label: __( 'Turn on', 'sourceweb' ) },
					{ value: 'off', label: __( 'Turn off', 'sourceweb' ) },
					{
						value: 'filter_on',
						label: __( 'Keyword check on', 'sourceweb' ),
					},
					{
						value: 'filter_off',
						label: __( 'Keyword check off', 'sourceweb' ),
					},
				] }
				onBulk={ op }
				rowActions={ ( r ) => [
					{
						icon: 'edit',
						label: __( 'Edit', 'sourceweb' ),
						href: r.editUrl,
					},
					{
						label: r.on
							? __( 'Turn off', 'sourceweb' )
							: __( 'Turn on', 'sourceweb' ),
						onClick: () => op( r.on ? 'off' : 'on', [ r.id ] ),
					},
					...( r.rss
						? [
								{
									label: r.filterOn
										? __(
												'Keyword check off',
												'sourceweb'
											)
										: __(
												'Keyword check on',
												'sourceweb'
											),
									onClick: () =>
										op(
											r.filterOn
												? 'filter_off'
												: 'filter_on',
											[ r.id ]
										),
								},
								{
									icon: 'delete',
									label: __( 'Delete', 'sourceweb' ),
									tone: 'error',
									onClick: () => remove( r ),
								},
							]
						: [] ),
				] }
				loading={ loading }
				error={ error }
				onRetry={ load }
				emptyTitle={ __( 'No feeds.', 'sourceweb' ) }
			/>
		</>
	);
}

/* ---------- Keywords ---------- */

/**
 * Checkboxes for a list of values.
 *
 * @param {Object}   props
 * @param {string}   props.id       Id prefix.
 * @param {string}   props.legend   Legend (for screen readers).
 * @param {Array}    props.options  [ { value, label, help } ].
 * @param {Array}    props.value    Ticked values.
 * @param {Function} props.onChange New ticked values.
 */
function Checks( { id, legend, options, value, onChange } ) {
	return (
		<fieldset className="kits-shell-checks">
			<legend className="screen-reader-text">{ legend }</legend>
			{ options.map( ( o ) => (
				<label key={ o.value } htmlFor={ `${ id }-${ o.value }` }>
					<input
						id={ `${ id }-${ o.value }` }
						type="checkbox"
						checked={ value.includes( o.value ) }
						onChange={ ( e ) =>
							onChange(
								e.target.checked
									? [ ...value, o.value ]
									: value.filter( ( x ) => x !== o.value )
							)
						}
					/>{ ' ' }
					{ o.help ? <strong>{ o.label }</strong> : o.label }
					{ o.help && (
						<span className="kits-shell-field__help">
							{ ' — ' }
							{ o.help }
						</span>
					) }
				</label>
			) ) }
		</fieldset>
	);
}

/** The view's role, ticked first on Add New Keyword. */
const VIEW_ROLE = {
	include: 'Include',
	animal: 'Topic',
	context: 'Context',
	exclude: 'Exclude',
	search: 'Search',
	press: 'Press',
	category: 'Category word',
};

function Keywords() {
	const [ sub, go ] = useSub( [ 'edit', 'kw' ] );
	const [ msg, setMsg ] = useState( null );
	const back = ( m ) => {
		setMsg( m || null );
		go( {} );
	};
	if ( sub.edit ) {
		return (
			<KeywordForm
				id={ 'new' === sub.edit ? 0 : parseInt( sub.edit, 10 ) || 0 }
				onDone={ back }
				go={ go }
			/>
		);
	}
	if ( 'suggestions' === sub.kw ) {
		return <Suggestions onBack={ () => back() } />;
	}
	return <KeywordList go={ go } msg={ msg } setMsg={ setMsg } />;
}

/**
 * The relevance filter and aggregator switches, and the Press settings in the Press view.
 *
 * @param {Object}   props
 * @param {Object}   props.settings As GET keywords gives them.
 * @param {boolean}  props.press    Show the Press settings.
 * @param {Function} props.onSaved  New settings.
 */
function KeywordSettings( { settings, press, onSaved } ) {
	const [ v, setV ] = useState( settings );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	useEffect( () => setV( settings ), [ settings ] );
	const dirty = JSON.stringify( v ) !== JSON.stringify( settings );
	const save = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'keywords/settings' ),
			method: 'POST',
			data: { ...v, press: press ? v.press : {} },
		} )
			.then( ( r ) => {
				setMsg( {
					tone: r.saved ? 'success' : 'info',
					text: r.message,
				} );
				onSaved( r.settings );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<SettingsGroup
			id="keyword-switches"
			title={ __( 'Keyword check', 'sourceweb' ) }
			footer={
				<Button
					variant="primary"
					busy={ busy }
					disabled={ ! dirty }
					onClick={ save }
				>
					{ __( 'Save changes', 'sourceweb' ) }
				</Button>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			<Switch
				label={ __( 'Relevance filter', 'sourceweb' ) }
				help={ __(
					'Off: every item from a non-blocked publisher is kept.',
					'sourceweb'
				) }
				checked={ v.enabled }
				onChange={ ( on ) => setV( { ...v, enabled: on } ) }
			/>
			<Switch
				label={ __(
					'Aggregator feeds: only allowed publishers',
					'sourceweb'
				) }
				help={ __(
					'Google News, Apple News and similar: items from Neutral publishers are refused. Keep off unless the allow list is complete.',
					'sourceweb'
				) }
				checked={ v.gnews_allow_only }
				onChange={ ( on ) => setV( { ...v, gnews_allow_only: on } ) }
			/>
			{ press && (
				<SettingsBlock
					title={ __( 'Press discovery', 'sourceweb' ) }
					description={ __(
						'The queries are the Press keywords below: Google News and Google Search for coverage of this site.',
						'sourceweb'
					) }
				>
					<Switch
						label={ __( 'Press discovery', 'sourceweb' ) }
						checked={ v.press.enabled }
						onChange={ ( on ) =>
							setV( { ...v, press: { ...v.press, enabled: on } } )
						}
					/>
					<TextField
						label={ __( 'Every (days)', 'sourceweb' ) }
						value={ String( v.press.every_days ) }
						onChange={ ( d ) =>
							setV( {
								...v,
								press: { ...v.press, every_days: d },
							} )
						}
						input={ {
							type: 'number',
							min: '1',
							max: '60',
							step: '1',
						} }
					/>
				</SettingsBlock>
			) }
		</SettingsGroup>
	);
}

/** Test a headline: kept or dropped, and why. */
function HeadlineTest() {
	const [ text, setText ] = useState( '' );
	const [ res, setRes ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const test = () => {
		setBusy( true );
		apiFetch( { path: path( 'keywords/test', { text } ) } )
			.then( ( r ) => setRes( r ) )
			.catch( ( e ) => setRes( { error: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<SettingsGroup
			id="keyword-test"
			title={ __( 'Test a headline', 'sourceweb' ) }
			footer={
				<Button
					busy={ busy }
					disabled={ '' === text.trim() }
					onClick={ test }
				>
					{ __( 'Test', 'sourceweb' ) }
				</Button>
			}
		>
			<TextField
				label={ __( 'Headline', 'sourceweb' ) }
				value={ text }
				onChange={ setText }
				input={ {
					placeholder: __( 'Paste a headline', 'sourceweb' ),
				} }
			/>
			{ res &&
				( res.error ? (
					<Notice tone="error">{ res.error }</Notice>
				) : (
					<p>
						<Status
							tone={ res.kept ? 'success' : 'error' }
							label={
								res.kept
									? __( 'Kept', 'sourceweb' )
									: __( 'Dropped', 'sourceweb' )
							}
						/>{ ' ' }
						({ res.why })
					</p>
				) ) }
		</SettingsGroup>
	);
}

function KeywordList( { go, msg, setMsg } ) {
	const first = new URLSearchParams( window.location.search );
	const [ q, setQ ] = useState( {
		view: first.get( 'view' ) || '',
		cat: first.get( 'cat' ) || '',
		search: '',
		orderby: '',
		order: 'asc',
		page: 1,
	} );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'keywords', q ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	const decide = ( op, ids ) => {
		setMsg( null );
		return apiFetch( {
			path: path( 'keywords/decide' ),
			method: 'POST',
			data: { op, ids },
		} )
			.then( ( r ) =>
				setMsg( {
					tone:
						( r.errors.length && 'error' ) ||
						( r.changed && 'success' ) ||
						'info',
					text: [ r.message, ...r.errors ].join( ' ' ),
				} )
			)
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const remove = ( ids, label ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			window.confirm(
				label
					? sprintf(
							/* translators: %s: keyword. */
							__(
								'Remove "%s" from sourcing? Its Sourcing and Press roles go; Search Insights keeps the record.',
								'sourceweb'
							),
							label
						)
					: sprintf(
							/* translators: %d: number of keywords. */
							_n(
								'Remove %d keyword from sourcing? Its Sourcing and Press roles go; Search Insights keeps the record.',
								'Remove %d keywords from sourcing? Their Sourcing and Press roles go; Search Insights keeps the records.',
								ids.length,
								'sourceweb'
							),
							ids.length
						)
			)
		) {
			decide( 'delete', ids );
		}
	};
	const roles = data?.roles || [];
	const bulk = [
		...roles.map( ( r ) => ( {
			value: `add_${ r.value }`,
			label: sprintf(
				/* translators: %s: role. */
				__( 'Add role: %s', 'sourceweb' ),
				r.label
			),
		} ) ),
		...roles.map( ( r ) => ( {
			value: `remove_${ r.value }`,
			label: sprintf(
				/* translators: %s: role. */
				__( 'Remove role: %s', 'sourceweb' ),
				r.label
			),
		} ) ),
		...( data?.categories || [] ).map( ( c ) => ( {
			value: `cat_${ c.value }`,
			label: sprintf(
				/* translators: %s: category. */
				__( 'Map to category: %s', 'sourceweb' ),
				c.label
			),
		} ) ),
		{ value: 'delete', label: __( 'Delete from sourcing', 'sourceweb' ) },
	];
	const views = [
		...( data?.views || [] ),
		...( data
			? [
					{
						value: '__suggestions',
						label: __(
							'Suggestions from Search Insights',
							'sourceweb'
						),
					},
				]
			: [] ),
	];
	const catName = ( data?.categories || [] ).find(
		( c ) => c.value === q.cat
	)?.label;
	const addNew = { edit: 'new', ...( q.view ? { view: q.view } : {} ) };
	return (
		<>
			{ data && (
				<KeywordSettings
					settings={ data.settings }
					press={ 'press' === q.view }
					onSaved={ ( s ) => setData( { ...data, settings: s } ) }
				/>
			) }
			<SectionCard
				id="keywords"
				title={ __( 'Keywords', 'sourceweb' ) }
				description={ __(
					'Every keyword with a Sourcing or Press role. English only for Sourcing and Press. Plurals and dots do not matter: "dogs" adds to "dog". Include and Exclude cannot go together.',
					'sourceweb'
				) }
				actions={
					<a
						className="kits-shell-button is-primary"
						href={ subHref( addNew ) }
						onClick={ inPlace( go, addNew ) }
					>
						{ __( 'Add New Keyword', 'sourceweb' ) }
					</a>
				}
			>
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				{ q.cat && (
					<Notice tone="info">
						{ sprintf(
							/* translators: %s: category. */
							__( 'Category: %s.', 'sourceweb' ),
							catName || q.cat
						) }{ ' ' }
						<Button onClick={ () => set( { cat: '' } ) }>
							{ __( 'Show every category', 'sourceweb' ) }
						</Button>
					</Notice>
				) }
				<DataList
					label={ __( 'Keywords', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Keyword', 'sourceweb' ),
							sortable: true,
							primary: true,
							render: ( r ) => (
								<>
									<a
										href={ subHref( { edit: r.id } ) }
										onClick={ inPlace( go, {
											edit: r.id,
										} ) }
									>
										<strong>{ r.title }</strong>
									</a>
									{ r.langLabel && (
										<span className="kits-shell-field__help">
											{ ' — ' }
											{ r.langLabel }
										</span>
									) }
								</>
							),
						},
						{
							key: 'spellings',
							label: __( 'Other spellings', 'sourceweb' ),
						},
						{
							key: 'rolesText',
							label: __( 'Roles', 'sourceweb' ),
							render: ( r ) => r.rolesText || '—',
						},
						{
							key: 'categories',
							label: __( 'Categories', 'sourceweb' ),
							render: ( r ) =>
								r.categories.length
									? r.categories.map( ( c, i ) => (
											<span key={ c.slug }>
												{ i > 0 && ', ' }
												<Button
													variant="link"
													onClick={ () =>
														set( {
															view: 'category',
															cat: c.slug,
														} )
													}
												>
													{ c.name }
												</Button>
											</span>
										) )
									: '—',
						},
						{
							key: 'search',
							label: __( 'Google News search', 'sourceweb' ),
						},
						{
							key: 'items',
							label: __( 'Items (30 days)', 'sourceweb' ),
							sortable: true,
						},
						{
							key: 'impr',
							label: __( 'Impressions (28 days)', 'sourceweb' ),
							sortable: true,
						},
					] }
					rows={ data?.rows || [] }
					total={ data?.total || 0 }
					page={ data?.page || 1 }
					pages={ data?.pages || 1 }
					onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
					search={ q.search }
					onSearch={ ( search ) => set( { search } ) }
					searchLabel={ __( 'Search keywords', 'sourceweb' ) }
					views={ views }
					view={ q.view }
					onView={ ( view ) =>
						'__suggestions' === view
							? go( { kw: 'suggestions' } )
							: set( { view } )
					}
					sort={ { key: q.orderby, dir: q.order } }
					onSort={ ( orderby, order ) => set( { orderby, order } ) }
					bulkActions={ bulk }
					onBulk={ ( op, ids ) =>
						'delete' === op ? remove( ids ) : decide( op, ids )
					}
					rowActions={ ( r ) => [
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							onClick: () => go( { edit: r.id } ),
						},
						...( 'en' === r.lang
							? [
									...roles
										.filter( ( x ) =>
											[
												data.include,
												data.exclude,
											].includes( x.value )
										)
										.map( ( x ) => {
											const has = r.roles & x.value; // eslint-disable-line no-bitwise -- role bits
											return {
												label: has
													? sprintf(
															/* translators: %s: role. */
															__(
																'Remove %s',
																'sourceweb'
															),
															x.label
														)
													: sprintf(
															/* translators: %s: role. */
															__(
																'Add %s',
																'sourceweb'
															),
															x.label
														),
												onClick: () =>
													decide(
														`${
															has
																? 'remove'
																: 'add'
														}_${ x.value }`,
														[ r.id ]
													),
											};
										} ),
									{
										icon: 'delete',
										label: __( 'Delete', 'sourceweb' ),
										tone: 'error',
										onClick: () =>
											remove( [ r.id ], r.title ),
									},
								]
							: [] ),
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'No keywords.', 'sourceweb' ) }
				/>
			</SectionCard>
			<HeadlineTest />
		</>
	);
}

/**
 * Add New Keyword or edit one: other spellings, roles, categories, sections, language, search and its query.
 *
 * @param {Object}   props
 * @param {number}   props.id     Record id, 0 to add.
 * @param {Function} props.onDone Back to the list, with a notice.
 * @param {Function} props.go     From useSub().
 */
function KeywordForm( { id, onDone, go } ) {
	const [ k, setK ] = useState( null );
	const [ v, setV ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'keywords/one', { id } ) } )
			.then( ( r ) => {
				const l = r.choices;
				const pre = new URLSearchParams( window.location.search ).get(
					'view'
				);
				const preRole = ( l.roles || [] ).find(
					( x ) => x.label === VIEW_ROLE[ pre ]
				);
				setK( r );
				setV( {
					label: r.label,
					variants: r.variants,
					lang: r.lang,
					roles: id || ! preRole ? r.roles : [ preRole.value ],
					categories: r.cats,
					sections: r.sections,
					search_on: !! r.search_on,
					query: r.query || '',
				} );
			} )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [ id ] );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! k || ! v ) {
		return (
			<LoadingState
				label={ __( 'Loading the keyword…', 'sourceweb' ) }
			/>
		);
	}
	const put = ( key ) => ( val ) => setV( { ...v, [ key ]: val } );
	const send = ( extra = {} ) => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'keywords/save' ),
			method: 'POST',
			data: { ...v, id, ...extra },
		} )
			.then( ( r ) =>
				onDone( {
					tone: 'none' === r.done ? 'info' : 'success',
					text: r.message,
				} )
			)
			.catch( ( e ) => {
				setBusy( false );
				setMsg( { tone: 'error', text: errText( e ) } );
				if ( ! id && e?.data?.id ) {
					go( { edit: e.data.id } ); // refused on a record that exists: open it, where it can be corrected
				}
			} );
	};
	const del = () => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			window.confirm(
				__(
					'Remove this keyword from sourcing? Its Sourcing and Press roles go; Search Insights keeps the record.',
					'sourceweb'
				)
			)
		) {
			send( { delete: true } );
		}
	};
	const langs = [
		{ value: 'en', label: __( 'English', 'sourceweb' ) },
		{ value: 'hinglish', label: __( 'Hinglish', 'sourceweb' ) },
		{ value: 'hi', label: __( 'Hindi', 'sourceweb' ) },
	];
	return (
		<SettingsGroup
			id="keyword-form"
			title={
				id
					? sprintf(
							/* translators: %s: keyword. */
							__( 'Edit keyword: %s', 'sourceweb' ),
							k.label
						)
					: __( 'Add New Keyword', 'sourceweb' )
			}
			footer={
				<>
					<Button
						variant="primary"
						busy={ busy }
						onClick={ () => send() }
					>
						{ id
							? __( 'Update', 'sourceweb' )
							: __( 'Add New Keyword', 'sourceweb' ) }
					</Button>{ ' ' }
					{ id > 0 && (
						<>
							<Button disabled={ busy } onClick={ del }>
								{ __( 'Delete', 'sourceweb' ) }
							</Button>{ ' ' }
						</>
					) }
					<Button onClick={ () => onDone() }>
						{ __( 'Cancel', 'sourceweb' ) }
					</Button>
				</>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ id ? (
				<RefTable
					caption={ __( 'The keyword', 'sourceweb' ) }
					head={ [
						__( 'Item', 'sourceweb' ),
						__( 'Value', 'sourceweb' ),
					] }
					rows={ [
						[
							__( 'Keyword', 'sourceweb' ),
							<>
								<strong>{ k.label }</strong>{ ' ' }
								<code>{ k.norm }</code>{ ' ' }
								<span className="kits-shell-field__help">
									{ __(
										'Fixed once saved: it is the record Search Insights keeps its figures on. Add other spellings below.',
										'sourceweb'
									) }
								</span>
							</>,
						],
						[
							__( 'Search Insights roles', 'sourceweb' ),
							sprintf(
								/* translators: %s: roles. */
								__( '%s (not changed here)', 'sourceweb' ),
								k.otherRoles
							),
						],
					] }
				/>
			) : (
				<TextField
					label={ __( 'Keyword', 'sourceweb' ) }
					help={ __(
						'English only for Sourcing and Press. Plurals and dots do not matter: "dogs" adds to "dog".',
						'sourceweb'
					) }
					value={ v.label }
					onChange={ put( 'label' ) }
					input={ { required: true } }
				/>
			) }
			<TextField
				label={ __( 'Other spellings', 'sourceweb' ) }
				help={ __(
					'One per line. Every spelling counts for every role. A trailing * matches the start of a word (steriliz* matches sterilized and sterilization).',
					'sourceweb'
				) }
				value={ v.variants }
				onChange={ put( 'variants' ) }
				input={ { rows: 4 } }
			/>
			<SelectField
				label={ __( 'Language', 'sourceweb' ) }
				help={ __(
					'Detected automatically; correct it when an English phrase was taken for Hinglish. Sourcing and Press roles are for English keywords only.',
					'sourceweb'
				) }
				value={ v.lang }
				options={ langs }
				onChange={ put( 'lang' ) }
			/>
			<SettingsBlock
				title={ __( 'Roles', 'sourceweb' ) }
				description={ __(
					'Include and Exclude cannot go together.',
					'sourceweb'
				) }
			>
				<Checks
					id="sw-kw-role"
					legend={ __( 'Roles', 'sourceweb' ) }
					options={ k.choices.roles }
					value={ v.roles }
					onChange={ put( 'roles' ) }
				/>
			</SettingsBlock>
			<SettingsBlock
				title={ __( 'Categories', 'sourceweb' ) }
				description={ __(
					"With the Category word role, an item that has this keyword gets these categories (the section's rule still limits them). An item a search of this keyword found gets them too.",
					'sourceweb'
				) }
			>
				<Checks
					id="sw-kw-cat"
					legend={ __( 'Categories', 'sourceweb' ) }
					options={ k.choices.categories }
					value={ v.categories }
					onChange={ put( 'categories' ) }
				/>
			</SettingsBlock>
			<SettingsBlock
				title={ __( 'Sections', 'sourceweb' ) }
				description={ __(
					'Where items its search finds go (News for a keyword search; Media & PR files them as press).',
					'sourceweb'
				) }
			>
				<Checks
					id="sw-kw-sec"
					legend={ __( 'Sections', 'sourceweb' ) }
					options={ k.choices.sections }
					value={ v.sections }
					onChange={ put( 'sections' ) }
				/>
			</SettingsBlock>
			{ id > 0 && (
				<>
					<Switch
						label={ __( 'Google News search', 'sourceweb' ) }
						help={ sprintf(
							/* translators: %s: feed ids. */
							__(
								'An English Include or Search keyword is searched every run. Searches: %s.',
								'sourceweb'
							),
							k.searches
						) }
						checked={ v.search_on }
						onChange={ put( 'search_on' ) }
					/>
					<TextField
						label={ __( 'Search query', 'sourceweb' ) }
						help={ sprintf(
							/* translators: %s: feed id. */
							__(
								'For the Search role: the words searched (the keyword itself when empty), or a whole Google News search address. Feed id: %s (fixed, so the items it found stay counted).',
								'sourceweb'
							),
							k.feedId
						) }
						value={ v.query }
						onChange={ put( 'query' ) }
						input={ { className: 'code' } }
					/>
				</>
			) }
		</SettingsGroup>
	);
}

/**
 * Suggestions from Search Insights: searches people made (20 impressions in 28 days) that no keyword covers.
 *
 * @param {Object}   props
 * @param {Function} props.onBack Back to the list.
 */
function Suggestions( { onBack } ) {
	const [ q, setQ ] = useState( {
		view: '',
		search: '',
		orderby: '',
		order: 'desc',
		page: 1,
	} );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'keywords/suggestions', q ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	const decide = ( op, qs ) => {
		setMsg( null );
		return apiFetch( {
			path: path( 'keywords/suggestions/decide' ),
			method: 'POST',
			data: { op, qs },
		} )
			.then( ( r ) =>
				setMsg( {
					tone: r.changed ? 'success' : 'info',
					text: r.message,
				} )
			)
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const ops = {
		route: __( 'Approve (auto-route)', 'sourceweb' ),
		include: __( 'Add as Include', 'sourceweb' ),
		exclude: __( 'Add as Exclude', 'sourceweb' ),
		search: __( 'Add as Search', 'sourceweb' ),
		dismiss: __( 'Dismiss', 'sourceweb' ),
		restore: __( 'Show again', 'sourceweb' ),
	};
	const dismissed = 'dismissed' === q.view;
	const bulk = Object.keys( ops )
		.filter( ( k ) => ( dismissed ? 'dismiss' !== k : 'restore' !== k ) )
		.map( ( k ) => ( { value: k, label: ops[ k ] } ) );
	const typeLabel = ( t ) =>
		( {
			news: __( 'News', 'sourceweb' ),
			library: __( 'Library', 'sourceweb' ),
			campaign: __( 'Campaign', 'sourceweb' ),
		} )[ t ] || '—';
	// The two auto-approve rules (both off by default); the owner toggles them.
	const [ aa, setAa ] = useState( null );
	const [ savingAa, setSavingAa ] = useState( false );
	useEffect( () => {
		if ( data?.autoapprove && ! aa ) {
			setAa( data.autoapprove );
		}
	}, [ data, aa ] );
	const saveAa = () => {
		if ( ! aa ) {
			return;
		}
		setSavingAa( true );
		setMsg( null );
		apiFetch( {
			path: path( 'keywords/suggestions/autoapprove' ),
			method: 'POST',
			data: aa,
		} )
			.then( ( r ) => {
				setAa( r.autoapprove );
				setMsg( { tone: 'success', text: r.message } );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => {
				setSavingAa( false );
				load();
			} );
	};
	const toggleType = ( t ) =>
		setAa( ( o ) => {
			const has = ( o.types || [] ).includes( t );
			return {
				...o,
				types: has
					? o.types.filter( ( x ) => x !== t )
					: [ ...( o.types || [] ), t ],
			};
		} );
	return (
		<SectionCard
			id="suggestions"
			title={ __( 'Suggestions from Search Insights', 'sourceweb' ) }
			description={ __(
				'Searches people made (20 impressions or more in 28 days) that no keyword covers yet, plus keyword candidates Search Insights scored and pushed here. Approve one (routed to its section, role and category) or dismiss it. Nothing is added by itself.',
				'sourceweb'
			) }
			actions={
				<Button onClick={ onBack }>
					{ __( 'Back to Keywords', 'sourceweb' ) }
				</Button>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ data?.none && (
				<Notice tone="info">
					{ __(
						'Search Insights has no search data yet.',
						'sourceweb'
					) }
				</Notice>
			) }
			{ aa && (
				<SettingsGroup
					title={ __( 'Auto-approve rules', 'sourceweb' ) }
					description={ __(
						'Off by default: every candidate waits for you here. Turn one on to route matching pushed candidates automatically.',
						'sourceweb'
					) }
				>
					<Switch
						label={ __( 'Auto-approve by score', 'sourceweb' ) }
						help={ __(
							'Approve pushed candidates whose Score is at least the number below.',
							'sourceweb'
						) }
						checked={ !! aa.on_score }
						onChange={ ( on ) =>
							setAa( ( o ) => ( { ...o, on_score: on } ) )
						}
					/>
					<Field
						label={ __( 'Minimum score', 'sourceweb' ) }
						render={ ( id ) => (
							<input
								id={ id }
								type="number"
								min="0"
								step="1"
								value={ aa.min_score }
								disabled={ ! aa.on_score }
								onChange={ ( e ) =>
									setAa( ( o ) => ( {
										...o,
										min_score:
											parseInt( e.target.value, 10 ) || 0,
									} ) )
								}
							/>
						) }
					/>
					<Field
						label={ __(
							'Only these recommended types',
							'sourceweb'
						) }
						help={ __(
							'Leave all off to allow any type.',
							'sourceweb'
						) }
						render={ () =>
							[ 'news', 'library', 'campaign' ].map( ( t ) => (
								<span
									key={ t }
									style={ {
										marginRight: '12px',
										opacity: aa.on_score ? 1 : 0.5,
									} }
								>
									<input
										id={ `aa-type-${ t }` }
										type="checkbox"
										checked={ ( aa.types || [] ).includes(
											t
										) }
										disabled={ ! aa.on_score }
										onChange={ () => toggleType( t ) }
									/>{ ' ' }
									<label htmlFor={ `aa-type-${ t }` }>
										{ typeLabel( t ) }
									</label>
								</span>
							) )
						}
					/>
					<Switch
						label={ __(
							'Auto-approve proven focus keyphrases',
							'sourceweb'
						) }
						help={ __(
							'Approve candidates the site already ranks for, up to the rank below.',
							'sourceweb'
						) }
						checked={ !! aa.on_proven }
						onChange={ ( on ) =>
							setAa( ( o ) => ( { ...o, on_proven: on } ) )
						}
					/>
					<Field
						label={ __( 'Up to rank', 'sourceweb' ) }
						render={ ( id ) => (
							<input
								id={ id }
								type="number"
								min="1"
								step="1"
								value={ aa.proven_rank }
								disabled={ ! aa.on_proven }
								onChange={ ( e ) =>
									setAa( ( o ) => ( {
										...o,
										proven_rank:
											parseInt( e.target.value, 10 ) || 1,
									} ) )
								}
							/>
						) }
					/>
					<Button
						variant="primary"
						onClick={ saveAa }
						isBusy={ savingAa }
						disabled={ savingAa }
					>
						{ __( 'Save auto-approve rules', 'sourceweb' ) }
					</Button>
				</SettingsGroup>
			) }
			<DataList
				label={ __( 'Suggestions', 'sourceweb' ) }
				columns={ [
					{
						key: 'title',
						label: __( 'Search', 'sourceweb' ),
						sortable: true,
						primary: true,
						render: ( r ) => (
							<>
								<strong>{ r.title }</strong>
								{ r.proven && (
									<span
										className="kits-shell-field__help"
										style={ { color: '#007017' } }
									>
										{ ' ' }
										{ r.rank
											? sprintf(
													/* translators: %d: search rank. */
													__(
														'Proven (focus keyphrase, ranks #%d)',
														'sourceweb'
													),
													r.rank
												)
											: __(
													'Proven (focus keyphrase)',
													'sourceweb'
												) }
									</span>
								) }
								{ ! r.proven && r.rising && (
									<span className="kits-shell-field__help">
										{ ' ' }
										{ __( 'Rising', 'sourceweb' ) }
									</span>
								) }
							</>
						),
					},
					{
						key: 'score',
						label: __( 'Score', 'sourceweb' ),
						sortable: true,
						render: ( r ) => ( r.pushed ? r.score : '—' ),
					},
					{
						key: 'type',
						label: __( 'Recommended type', 'sourceweb' ),
						render: ( r ) =>
							r.pushed ? typeLabel( r.type ) : '—',
					},
					{
						key: 'topic',
						label: __( 'Topic', 'sourceweb' ),
						render: ( r ) => r.topic || '—',
					},
					{
						key: 'impr',
						label: __( 'Impressions (28 days)', 'sourceweb' ),
						sortable: true,
					},
					{
						key: 'clicks',
						label: __( 'Clicks', 'sourceweb' ),
						sortable: true,
					},
					{
						key: 'pos',
						label: __( 'Position', 'sourceweb' ),
						sortable: true,
					},
				] }
				rows={ data?.rows || [] }
				total={ data?.total || 0 }
				page={ data?.page || 1 }
				pages={ data?.pages || 1 }
				onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
				search={ q.search }
				onSearch={ ( search ) => set( { search } ) }
				searchLabel={ __( 'Search suggestions', 'sourceweb' ) }
				views={ data?.views || [] }
				view={ q.view }
				onView={ ( view ) => set( { view } ) }
				sort={ { key: q.orderby, dir: q.order } }
				onSort={ ( orderby, order ) => set( { orderby, order } ) }
				bulkActions={ bulk }
				onBulk={ decide }
				rowActions={ ( r ) =>
					bulk
						.filter( ( b ) => 'route' !== b.value || r.pushed )
						.map( ( b ) => ( {
							label: b.label,
							onClick: () => decide( b.value, [ r.id ] ),
						} ) )
				}
				loading={ loading }
				error={ error }
				onRetry={ load }
				emptyTitle={ __( 'No suggestions.', 'sourceweb' ) }
			/>
		</SectionCard>
	);
}

/* ---------- Rules ---------- */

const RULE_PARTS = [
	{ value: 'sections', label: __( 'Section rules', 'sourceweb' ) },
	{ value: 'summary', label: __( 'Summary rules', 'sourceweb' ) },
	{ value: 'enrich', label: __( 'Directory enrichment', 'sourceweb' ) },
	{
		value: 'autoresolve',
		label: __( 'Review-queue rules', 'sourceweb' ),
	},
];

/**
 * A save's answer as a notice: success, info (nothing changed) or the refusal.
 *
 * @param {Object} r Answer.
 */
const answerMsg = ( r ) => ( {
	tone: r.tone || ( r.saved || 'saved' === r.done ? 'success' : 'info' ),
	text: r.message,
} );

function Rules() {
	const [ sub, go ] = useSub( [
		'part',
		'edit',
		'tagrule',
		'field',
		'autorule',
	] );
	const [ msg, setMsg ] = useState( null );
	const part = RULE_PARTS.some( ( p ) => p.value === sub.part )
		? sub.part
		: 'sections';
	const back = ( m ) => {
		setMsg( m || null );
		go( 'sections' === part ? {} : { part } );
	};
	if ( sub.edit ) {
		return <SectionForm type={ sub.edit } onDone={ back } />;
	}
	if ( sub.tagrule ) {
		return (
			<TagRuleForm
				tag={ 'new' === sub.tagrule ? '' : sub.tagrule }
				onDone={ back }
			/>
		);
	}
	if ( sub.field ) {
		return <FieldRuleForm field={ sub.field } onDone={ back } />;
	}
	if ( sub.autorule ) {
		return (
			<AutoRuleForm
				id={ 'new' === sub.autorule ? '' : sub.autorule }
				onDone={ back }
			/>
		);
	}
	const parts = (
		<ChipRow
			label={ __( 'Rules', 'sourceweb' ) }
			chips={ RULE_PARTS }
			value={ part }
			onChange={ ( p ) => {
				setMsg( null );
				go( 'sections' === p ? {} : { part: p } );
			} }
		/>
	);
	const notice = msg && (
		<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
			{ msg.text }
		</Notice>
	);
	return (
		<>
			{ parts }
			{ notice }
			{ 'sections' === part && <SectionRules go={ go } /> }
			{ 'summary' === part && <SummaryRules /> }
			{ 'enrich' === part && <EnrichRules go={ go } /> }
			{ 'autoresolve' === part && <AutoRules go={ go } /> }
		</>
	);
}

/**
 * A loader for a GET route: data, error, reload.
 *
 * @param {string} route Route.
 * @param {Object} args  Query arguments.
 */
function useRoute( route, args = {} ) {
	const key = JSON.stringify( args );
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ loading, setLoading ] = useState( true );
	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( route, JSON.parse( key ) ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ route, key ] );
	useEffect( load, [ load ] );
	return { data, error, loading, load };
}

function SectionRules( { go } ) {
	const { data, error, loading, load } = useRoute( 'rules/sections' );
	const [ msg, setMsg ] = useState( null );
	const del = ( r ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			! window.confirm(
				sprintf(
					/* translators: %s: tag. */
					__(
						'Delete the tag rule for %s? The tag itself stays; items keep the tags they have.',
						'sourceweb'
					),
					r.title
				)
			)
		) {
			return;
		}
		apiFetch( {
			path: path( 'rules/tag/delete' ),
			method: 'POST',
			data: { tag: r.id },
		} )
			.then( ( res ) => setMsg( answerMsg( res ) ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const empty = () => {};
	return (
		<>
			<SectionCard
				id="sections"
				title={ __( 'Section rules', 'sourceweb' ) }
				description={ __(
					"Which categories and tags each section uses. The workers pick only from these, and each section's filters show only these. A section with no category ticked uses every category.",
					'sourceweb'
				) }
			>
				<DataList
					label={ __( 'Sections', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Section', 'sourceweb' ),
							primary: true,
							render: ( r ) => (
								<>
									<a
										href={ subHref( { edit: r.id } ) }
										onClick={ inPlace( go, {
											edit: r.id,
										} ) }
									>
										<strong>{ r.title }</strong>
									</a>{ ' ' }
									<code>{ r.id }</code>
									{ ! r.stored && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ __(
												'No rule saved yet: every category, no tags.',
												'sourceweb'
											) }
										</span>
									) }
								</>
							),
						},
						{
							key: 'categories',
							label: __( 'Allowed categories', 'sourceweb' ),
						},
						{
							key: 'tags',
							label: __( 'Allowed tags', 'sourceweb' ),
						},
						{
							key: 'worker',
							label: __( 'Workers file', 'sourceweb' ),
						},
						{
							key: 'summary',
							label: __( 'Summary rule', 'sourceweb' ),
						},
					] }
					rows={ data?.sections || [] }
					total={ data?.sections?.length || 0 }
					page={ 1 }
					pages={ 1 }
					onPage={ empty }
					rowActions={ ( r ) => [
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							onClick: () => go( { edit: r.id } ),
						},
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'No sections.', 'sourceweb' ) }
				/>
			</SectionCard>
			<SectionCard
				id="tag-rules"
				title={ __( 'Tag rules', 'sourceweb' ) }
				description={ __(
					'An item gets the tag when its title or text has one of the phrases, in a section that allows the tag. An item that also matches a "Hold when" pattern, and has none of the "Unless" words, waits for a person with the hold reason.',
					'sourceweb'
				) }
				actions={
					<a
						className="kits-shell-button is-primary"
						href={ subHref( { tagrule: 'new' } ) }
						onClick={ inPlace( go, { tagrule: 'new' } ) }
					>
						{ __( 'Add New Rule', 'sourceweb' ) }
					</a>
				}
			>
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				<DataList
					label={ __( 'Tag rules', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Tag', 'sourceweb' ),
							primary: true,
							render: ( r ) => (
								<>
									<a
										href={ subHref( { tagrule: r.id } ) }
										onClick={ inPlace( go, {
											tagrule: r.id,
										} ) }
									>
										<strong>{ r.title }</strong>
									</a>{ ' ' }
									<code>{ r.slug }</code>
								</>
							),
						},
						{ key: 'any', label: __( 'Phrases', 'sourceweb' ) },
						{
							key: 'hold',
							label: __( 'Hold when', 'sourceweb' ),
							render: ( r ) =>
								r.hold.length
									? r.hold.map( ( h, i ) => (
											<span key={ i }>
												{ i > 0 && ', ' }
												<code>{ h }</code>
											</span>
										) )
									: '—',
						},
						{ key: 'unless', label: __( 'Unless', 'sourceweb' ) },
						{
							key: 'reason',
							label: __( 'Hold reason', 'sourceweb' ),
						},
						{
							key: 'sections',
							label: __(
								'Sections that may give it',
								'sourceweb'
							),
						},
					] }
					rows={ data?.tagRules || [] }
					total={ data?.tagRules?.length || 0 }
					page={ 1 }
					pages={ 1 }
					onPage={ empty }
					rowActions={ ( r ) => [
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							onClick: () => go( { tagrule: r.id } ),
						},
						{
							icon: 'delete',
							label: __( 'Delete', 'sourceweb' ),
							tone: 'error',
							onClick: () => del( r ),
						},
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'No tag rules yet.', 'sourceweb' ) }
				/>
			</SectionCard>
		</>
	);
}

/**
 * The buttons of a form: Save, Cancel.
 *
 * @param {Object}   props
 * @param {string}   props.label  Save button.
 * @param {boolean}  props.busy   Saving.
 * @param {Function} props.onSave Save.
 * @param {Function} props.onDone Cancel.
 */
function FormButtons( { label, busy, onSave, onDone } ) {
	return (
		<>
			<Button variant="primary" busy={ busy } onClick={ onSave }>
				{ label }
			</Button>{ ' ' }
			<Button onClick={ () => onDone() }>
				{ __( 'Cancel', 'sourceweb' ) }
			</Button>
		</>
	);
}

/**
 * One form: load, edit a copy, save; back to the list with the notice on success, the refusal shown in place.
 *
 * @param {string}   route  GET route.
 * @param {Object}   args   Its arguments.
 * @param {Function} toForm Data → form values.
 */
function useForm( route, args, toForm ) {
	const { data, error, load } = useRoute( route, args );
	const [ v, setV ] = useState( null );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	useEffect( () => {
		if ( data ) {
			setV( toForm( data ) );
		}
	}, [ data ] ); // eslint-disable-line react-hooks/exhaustive-deps -- toForm is the same every time
	const send = ( to, body, onDone ) => {
		setBusy( true );
		setMsg( null );
		apiFetch( { path: path( to ), method: 'POST', data: body } )
			.then( ( r ) => onDone( answerMsg( r ) ) )
			.catch( ( e ) => {
				setBusy( false );
				setMsg( { tone: 'error', text: errText( e ) } );
			} );
	};
	return { data, error, load, v, setV, msg, setMsg, busy, send };
}

/**
 * One section's allowed categories and tags.
 *
 * @param {Object}   props
 * @param {string}   props.type   Post type.
 * @param {Function} props.onDone Back with a notice.
 */
function SectionForm( { type, onDone } ) {
	const f = useForm( 'rules/section', { type }, ( d ) => ( {
		categories: d.categories,
		tags: d.tags,
		gone: d.gone,
	} ) );
	if ( f.error ) {
		return <ErrorState message={ f.error } onRetry={ f.load } />;
	}
	if ( ! f.data || ! f.v ) {
		return (
			<LoadingState
				label={ __( 'Loading the section…', 'sourceweb' ) }
			/>
		);
	}
	const d = f.data;
	const gone = ( k ) =>
		d.gone[ k ].map( ( slug ) => ( {
			value: `__gone:${ slug }`,
			label:
				'categories' === k
					? sprintf(
							/* translators: %s: slug. */
							__( '%s (no such category)', 'sourceweb' ),
							decodeURIComponent( slug )
						)
					: sprintf(
							/* translators: %s: slug. */
							__( '%s (no such tag)', 'sourceweb' ),
							decodeURIComponent( slug )
						),
		} ) );
	const ticked = ( k ) => [
		...f.v[ k ],
		...f.v.gone[ k ].map( ( s ) => `__gone:${ s }` ),
	];
	const tick = ( k ) => ( list ) =>
		f.setV( {
			...f.v,
			[ k ]: list.filter( ( x ) => ! x.startsWith( '__gone:' ) ),
			gone: {
				...f.v.gone,
				[ k ]: list
					.filter( ( x ) => x.startsWith( '__gone:' ) )
					.map( ( x ) => x.slice( 7 ) ),
			},
		} );
	return (
		<SettingsGroup
			id="section-form"
			title={ sprintf(
				/* translators: %s: section. */
				__( 'Edit section: %s', 'sourceweb' ),
				d.label
			) }
			footer={
				<FormButtons
					label={ __( 'Save section', 'sourceweb' ) }
					busy={ f.busy }
					onSave={ () =>
						f.send( 'rules/section/save', { type, ...f.v }, onDone )
					}
					onDone={ onDone }
				/>
			}
		>
			{ f.msg && <Notice tone={ f.msg.tone }>{ f.msg.text }</Notice> }
			<SettingsBlock
				title={ __( 'Allowed categories', 'sourceweb' ) }
				description={ __(
					'None ticked: every category.',
					'sourceweb'
				) }
			>
				<Checks
					id="sw-sec-cat"
					legend={ __( 'Allowed categories', 'sourceweb' ) }
					options={ [
						...d.choices.categories,
						...gone( 'categories' ),
					] }
					value={ ticked( 'categories' ) }
					onChange={ tick( 'categories' ) }
				/>
			</SettingsBlock>
			<SettingsBlock
				title={ __( 'Allowed tags', 'sourceweb' ) }
				description={ __(
					"The tags the workers may give this section's items, and its filters show.",
					'sourceweb'
				) }
			>
				<Checks
					id="sw-sec-tag"
					legend={ __( 'Allowed tags', 'sourceweb' ) }
					options={ [ ...d.choices.tags, ...gone( 'tags' ) ] }
					value={ ticked( 'tags' ) }
					onChange={ tick( 'tags' ) }
				/>
			</SettingsBlock>
		</SettingsGroup>
	);
}

/**
 * Add a tag rule or edit one.
 *
 * @param {Object}   props
 * @param {string}   props.tag    Tag slug, '' to add.
 * @param {Function} props.onDone Back with a notice.
 */
function TagRuleForm( { tag, onDone } ) {
	const f = useForm( 'rules/tag', { tag }, ( d ) => ( {
		tag: d.tag,
		any: d.any,
		hold: d.hold,
		unless: d.unless,
		hold_reason: d.hold_reason,
	} ) );
	if ( f.error ) {
		return <ErrorState message={ f.error } onRetry={ f.load } />;
	}
	if ( ! f.data || ! f.v ) {
		return (
			<LoadingState label={ __( 'Loading the rule…', 'sourceweb' ) } />
		);
	}
	const put = ( k ) => ( val ) => f.setV( { ...f.v, [ k ]: val } );
	return (
		<SettingsGroup
			id="tag-rule-form"
			title={
				tag
					? sprintf(
							/* translators: %s: tag. */
							__( 'Edit tag rule: %s', 'sourceweb' ),
							decodeURIComponent( tag )
						)
					: __( 'Add New Rule', 'sourceweb' )
			}
			footer={
				<FormButtons
					label={
						tag
							? __( 'Update', 'sourceweb' )
							: __( 'Add New Rule', 'sourceweb' )
					}
					busy={ f.busy }
					onSave={ () =>
						f.send(
							'rules/tag/save',
							{ ...f.v, original: tag },
							onDone
						)
					}
					onDone={ onDone }
				/>
			}
		>
			{ f.msg && <Notice tone={ f.msg.tone }>{ f.msg.text }</Notice> }
			<SelectField
				label={ __( 'Tag', 'sourceweb' ) }
				help={ __(
					'The tag an item gets when its title or text has one of the phrases (only in a section that allows the tag).',
					'sourceweb'
				) }
				value={ f.v.tag }
				options={ [
					...( tag
						? []
						: [
								{
									value: '',
									label: __( 'Choose a tag', 'sourceweb' ),
								},
							] ),
					...f.data.choices,
				] }
				onChange={ put( 'tag' ) }
			/>
			<TextField
				label={ __( 'Phrases', 'sourceweb' ) }
				help={ __(
					'One per line. An item with any of them gets the tag.',
					'sourceweb'
				) }
				value={ f.v.any }
				onChange={ put( 'any' ) }
				input={ { rows: 5 } }
			/>
			<TextField
				label={ __( 'Hold when', 'sourceweb' ) }
				help={ __(
					'One regular expression per line (case does not matter). An item that also matches one waits for a person.',
					'sourceweb'
				) }
				value={ f.v.hold }
				onChange={ put( 'hold' ) }
				input={ { rows: 2 } }
			/>
			<TextField
				label={ __( 'Unless', 'sourceweb' ) }
				help={ __(
					'One per line. An item with any of these words is not held.',
					'sourceweb'
				) }
				value={ f.v.unless }
				onChange={ put( 'unless' ) }
				input={ { rows: 3 } }
			/>
			<TextField
				label={ __( 'Hold reason', 'sourceweb' ) }
				help={ __(
					'What the person checking a held item should look at.',
					'sourceweb'
				) }
				value={ f.v.hold_reason }
				onChange={ put( 'hold_reason' ) }
				input={ { rows: 2 } }
			/>
		</SettingsGroup>
	);
}

/**
 * Review-queue rules: what happens to a waiting value for a field that already holds one (autoresolve.php). Add, edit,
 * delete and reorder them; try them on the waiting values; switch them off.
 *
 * @param {Object}   props
 * @param {Function} props.go Navigate in place.
 */
function AutoRules( { go } ) {
	const { data, error, loading, load } = useRoute( 'rules/autoresolve' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const post = ( to, body = {} ) => {
		setBusy( true );
		apiFetch( { path: path( to ), method: 'POST', data: body } )
			.then( ( r ) => setMsg( answerMsg( r ) ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => {
				setBusy( false );
				load();
			} );
	};
	const del = ( r ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			! window.confirm(
				sprintf(
					/* translators: 1: field, 2: condition. */
					__(
						'Delete the rule for %1$s: when %2$s? Waiting values it decided will wait for a person.',
						'sourceweb'
					),
					r.field_label,
					r.cond_label
				)
			)
		) {
			return;
		}
		post( 'rules/autoresolve/delete', { id: r.id } );
	};
	const reset = () => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			! window.confirm(
				__(
					'Put the built-in rules back? Your added and edited rules are dropped (the Change log keeps them).',
					'sourceweb'
				)
			)
		) {
			return;
		}
		post( 'rules/autoresolve/reset' );
	};
	const tryRules = () => {
		setBusy( true );
		apiFetch( {
			path: path( 'enrichment/autoresolve' ),
			method: 'POST',
			data: { dry: true, limit: 1000 },
		} )
			.then( ( r ) =>
				setMsg( {
					tone: 'info',
					text: sprintf(
						/* translators: 1: rows looked at, 2: applied, 3: rejected, 4: left. */
						__(
							'Dry run on %1$d waiting values: %2$d would be applied, %3$d rejected, %4$d left for a person. Nothing was changed.',
							'sourceweb'
						),
						r.rows,
						r.approve,
						r.reject,
						r.leave
					),
				} )
			)
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	const empty = () => {};
	return (
		<SectionCard
			id="review-queue-rules"
			title={ __( 'Review-queue rules', 'sourceweb' ) }
			description={ __(
				'What happens to a waiting value for a field that already holds one. A rule says: for this field, when this holds, do this. The rules are tried in order and the first one that holds decides; a value no rule decides waits for a person. Never on a claimed or verified listing, and an imported list always waits for a person.',
				'sourceweb'
			) }
			actions={
				<>
					<a
						className="kits-shell-button is-primary"
						href={ subHref( {
							part: 'autoresolve',
							autorule: 'new',
						} ) }
						onClick={ inPlace( go, {
							part: 'autoresolve',
							autorule: 'new',
						} ) }
					>
						{ __( 'Add New Rule', 'sourceweb' ) }
					</a>{ ' ' }
					<Button onClick={ tryRules } disabled={ busy }>
						{ __( 'Try on waiting values', 'sourceweb' ) }
					</Button>{ ' ' }
					<Button onClick={ reset } disabled={ busy }>
						{ __( 'Back to the built-in rules', 'sourceweb' ) }
					</Button>
				</>
			}
		>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			{ data && (
				<Switch
					label={ __(
						'The rules decide waiting values',
						'sourceweb'
					) }
					help={ __(
						'Off: every value waits for a person, as before the rules.',
						'sourceweb'
					) }
					checked={ !! data.on }
					onChange={ ( on ) =>
						post( 'rules/autoresolve/switch', { on } )
					}
				/>
			) }
			<DataList
				label={ __( 'Review-queue rules', 'sourceweb' ) }
				columns={ [
					{
						key: 'field_label',
						label: __( 'Field', 'sourceweb' ),
						primary: true,
						render: ( r ) => (
							<a
								href={ subHref( {
									part: 'autoresolve',
									autorule: r.id,
								} ) }
								onClick={ inPlace( go, {
									part: 'autoresolve',
									autorule: r.id,
								} ) }
							>
								<strong>{ r.field_label }</strong>
							</a>
						),
					},
					{ key: 'cond_label', label: __( 'When', 'sourceweb' ) },
					{
						key: 'action_label',
						label: __( 'Then', 'sourceweb' ),
					},
					{
						key: 'on',
						label: __( 'On', 'sourceweb' ),
						render: ( r ) =>
							r.on
								? __( 'Yes', 'sourceweb' )
								: __( 'No', 'sourceweb' ),
					},
				] }
				rows={ data?.rows || [] }
				total={ data?.rows?.length || 0 }
				page={ 1 }
				pages={ 1 }
				onPage={ empty }
				rowActions={ ( r ) => [
					{
						icon: 'edit',
						label: __( 'Edit', 'sourceweb' ),
						onClick: () =>
							go( { part: 'autoresolve', autorule: r.id } ),
					},
					{
						label: __( 'Move earlier', 'sourceweb' ),
						onClick: () =>
							post( 'rules/autoresolve/move', {
								id: r.id,
								dir: 'up',
							} ),
					},
					{
						label: __( 'Move later', 'sourceweb' ),
						onClick: () =>
							post( 'rules/autoresolve/move', {
								id: r.id,
								dir: 'down',
							} ),
					},
					{
						icon: 'delete',
						label: __( 'Delete', 'sourceweb' ),
						tone: 'error',
						onClick: () => del( r ),
					},
				] }
				loading={ loading }
				error={ error }
				onRetry={ load }
				emptyTitle={ __(
					'No rules: every waiting value waits for a person.',
					'sourceweb'
				) }
			/>
		</SectionCard>
	);
}

/**
 * Add a review-queue rule or edit one.
 *
 * @param {Object}   props
 * @param {string}   props.id     Rule id, '' to add.
 * @param {Function} props.onDone Back with a notice.
 */
function AutoRuleForm( { id, onDone } ) {
	const f = useForm( 'rules/autoresolve', { id }, ( d ) =>
		d.one
			? {
					field: d.one.field,
					cond: d.one.cond,
					action: d.one.action,
					on: d.one.on,
				}
			: {
					field: 'address',
					cond: 'adds_nothing',
					action: 'reject',
					on: true,
				}
	);
	if ( f.error ) {
		return <ErrorState message={ f.error } onRetry={ f.load } />;
	}
	if ( ! f.data || ! f.v ) {
		return (
			<LoadingState label={ __( 'Loading the rule…', 'sourceweb' ) } />
		);
	}
	const put = ( k ) => ( val ) => f.setV( { ...f.v, [ k ]: val } );
	const conds = f.data.conditions.filter( ( c ) =>
		c.fields.includes( f.v.field )
	);
	const setField = ( field ) => {
		const ok = f.data.conditions.some(
			( c ) => c.value === f.v.cond && c.fields.includes( field )
		);
		const first = f.data.conditions.find( ( c ) =>
			c.fields.includes( field )
		);
		f.setV( {
			...f.v,
			field,
			cond: ok ? f.v.cond : first?.value || '',
		} );
	};
	return (
		<SettingsGroup
			id="auto-rule-form"
			title={
				id
					? __( 'Edit review-queue rule', 'sourceweb' )
					: __( 'Add New Rule', 'sourceweb' )
			}
			footer={
				<FormButtons
					label={
						id
							? __( 'Update', 'sourceweb' )
							: __( 'Add New Rule', 'sourceweb' )
					}
					busy={ f.busy }
					onSave={ () =>
						f.send(
							'rules/autoresolve/save',
							{ ...f.v, original: id },
							onDone
						)
					}
					onDone={ onDone }
				/>
			}
		>
			{ f.msg && <Notice tone={ f.msg.tone }>{ f.msg.text }</Notice> }
			<SelectField
				label={ __( 'Field', 'sourceweb' ) }
				help={ __(
					'The field the waiting value is for. The social group covers Facebook, Instagram, X, LinkedIn and YouTube.',
					'sourceweb'
				) }
				value={ f.v.field }
				options={ f.data.fields }
				onChange={ setField }
			/>
			<SelectField
				label={ __( 'When', 'sourceweb' ) }
				help={ __(
					'Rules of a field are tried in order; the first one that holds decides.',
					'sourceweb'
				) }
				value={ f.v.cond }
				options={ conds }
				onChange={ put( 'cond' ) }
			/>
			<SelectField
				label={ __( 'Then', 'sourceweb' ) }
				value={ f.v.action }
				options={ f.data.actions }
				onChange={ put( 'action' ) }
			/>
			<Switch
				label={ __( 'On', 'sourceweb' ) }
				checked={ !! f.v.on }
				onChange={ put( 'on' ) }
			/>
		</SettingsGroup>
	);
}

/** The Summary rules form: lengths per section, quotes and the lead, each section's wording, every summary. */
function SummaryRules() {
	const f = useForm( 'rules/summary', {}, ( d ) => ( {
		...d.values,
		sections: Object.fromEntries(
			d.sections.map( ( s ) => [
				s.type,
				{
					min_words: String( s.min_words ),
					max_words: String( s.max_words ),
					structure: s.structure,
					attribution: s.attribution,
					inherit: s.inherit,
				},
			] )
		),
		_reset: false,
	} ) );
	const [ done, setDone ] = useState( null );
	if ( f.error ) {
		return <ErrorState message={ f.error } onRetry={ f.load } />;
	}
	if ( ! f.data || ! f.v ) {
		return (
			<LoadingState
				label={ __( 'Loading the summary rules…', 'sourceweb' ) }
			/>
		);
	}
	const d = f.data;
	const put = ( k ) => ( val ) => f.setV( { ...f.v, [ k ]: val } );
	const putSec = ( pt, k ) => ( val ) =>
		f.setV( {
			...f.v,
			sections: {
				...f.v.sections,
				[ pt ]: { ...f.v.sections[ pt ], [ k ]: val },
			},
		} );
	const save = () => {
		if (
			f.v._reset &&
			// eslint-disable-next-line no-alert -- a plain browser confirm
			! window.confirm(
				__(
					'Go back to the default summary rules? Every rule on this form is replaced.',
					'sourceweb'
				)
			)
		) {
			return;
		}
		f.send( 'rules/summary/save', { values: f.v }, ( m ) => {
			setDone( m );
			f.load();
		} );
	};
	const num = ( val, onChange, label ) => (
		<input
			type="number"
			min="1"
			max="400"
			size="4"
			aria-label={ label }
			value={ val }
			onChange={ ( e ) => onChange( e.target.value ) }
		/>
	);
	return (
		<SettingsGroup
			id="summary-rules"
			title={ __( 'Summary rules', 'sourceweb' ) }
			description={ __(
				'One rule set for every summary on the site: the workers write and check new summaries and same-story rewrites from these rules, and the site holds a News, Library or research item whose summary is over the maximum or not plain text in To review. A short summary is never held. A summary is never shorter than the search description, which is its lead sentence.',
				'sourceweb'
			) }
			footer={
				<Button variant="primary" busy={ f.busy } onClick={ save }>
					{ __( 'Save summary rules', 'sourceweb' ) }
				</Button>
			}
		>
			{ ( done || f.msg ) && (
				<Notice
					tone={ ( f.msg || done ).tone }
					onDismiss={ () => {
						setDone( null );
						f.setMsg( null );
					} }
				>
					{ ( f.msg || done ).text }
				</Notice>
			) }
			<SettingsBlock title={ __( 'Length per section', 'sourceweb' ) }>
				<RefTable
					caption={ __( 'Length per section', 'sourceweb' ) }
					head={ [
						__( 'Section', 'sourceweb' ),
						__( 'Minimum words', 'sourceweb' ),
						__( 'Maximum words', 'sourceweb' ),
						__( 'Rule', 'sourceweb' ),
						__(
							'Published summaries below the minimum',
							'sourceweb'
						),
					] }
					rows={ d.sections.map( ( s ) => {
						const sv = f.v.sections[ s.type ];
						return [
							<>
								{ s.label } <code>{ s.type }</code>
							</>,
							num(
								sv.min_words,
								putSec( s.type, 'min_words' ),
								`${ s.label } ${ __(
									'minimum words',
									'sourceweb'
								) }`
							),
							num(
								sv.max_words,
								putSec( s.type, 'max_words' ),
								`${ s.label } ${ __(
									'maximum words',
									'sourceweb'
								) }`
							),
							s.own ? (
								__( 'Its own', 'sourceweb' )
							) : (
								<label htmlFor={ `sw-sr-inh-${ s.type }` }>
									<input
										id={ `sw-sr-inh-${ s.type }` }
										type="checkbox"
										checked={ !! sv.inherit }
										onChange={ ( e ) =>
											putSec(
												s.type,
												'inherit'
											)( e.target.checked )
										}
									/>{ ' ' }
									{ __( 'Inherits News', 'sourceweb' ) }
								</label>
							),
							s.below,
						];
					} ) }
				/>
			</SettingsBlock>
			<SettingsBlock title={ __( 'Quotes and the lead', 'sourceweb' ) }>
				{ Object.keys( d.fields.numbers ).map( ( k ) => (
					<TextField
						key={ k }
						label={ d.fields.numbers[ k ] }
						value={ String( f.v[ k ] ) }
						onChange={ put( k ) }
						input={ {
							type: 'number',
							min: '1',
							max: '400',
							step: '1',
						} }
					/>
				) ) }
			</SettingsBlock>
			{ d.sections.map( ( s ) => (
				<SettingsBlock
					key={ s.type }
					title={
						f.v.sections[ s.type ].inherit
							? sprintf(
									/* translators: %s: section. */
									__(
										'%s (inherits News: these fields apply once it has its own rule)',
										'sourceweb'
									),
									s.label
								)
							: s.label
					}
				>
					<TextField
						label={ __( 'Structure', 'sourceweb' ) }
						value={ f.v.sections[ s.type ].structure }
						onChange={ putSec( s.type, 'structure' ) }
						input={ { rows: 4 } }
					/>
					<TextField
						label={ __( 'Attribution', 'sourceweb' ) }
						value={ f.v.sections[ s.type ].attribution }
						onChange={ putSec( s.type, 'attribution' ) }
						input={ { rows: 3 } }
					/>
				</SettingsBlock>
			) ) }
			<SettingsBlock title={ __( 'Every summary', 'sourceweb' ) }>
				{ Object.keys( d.fields.lists ).map( ( k ) => (
					<TextField
						key={ k }
						label={ d.fields.lists[ k ][ 0 ] }
						help={ d.fields.lists[ k ][ 1 ] }
						value={ f.v[ k ] }
						onChange={ put( k ) }
						input={ { rows: 'general' === k ? 12 : 5 } }
					/>
				) ) }
				{ Object.keys( d.fields.texts ).map( ( k ) => (
					<TextField
						key={ k }
						label={ d.fields.texts[ k ] }
						value={ f.v[ k ] }
						onChange={ put( k ) }
						input={ { rows: 3 } }
					/>
				) ) }
			</SettingsBlock>
			<Switch
				label={ __( 'Go back to the default rules', 'sourceweb' ) }
				help={ __(
					'On Save, every rule on this form goes back to its default.',
					'sourceweb'
				) }
				checked={ !! f.v._reset }
				onChange={ put( '_reset' ) }
			/>
		</SettingsGroup>
	);
}

function EnrichRules( { go } ) {
	const { data, error, loading, load } = useRoute( 'rules/enrich' );
	const [ pos, setPos ] = useState( {} );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	useEffect( () => {
		if ( data ) {
			setPos(
				Object.fromEntries(
					data.priority.map( ( p ) => [ p.key, p.pos ] )
				)
			);
		}
	}, [ data ] );
	const settings = ( app.tabs || [] ).find( ( t ) => 'settings' === t.slug );
	const saveOrder = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'rules/priority' ),
			method: 'POST',
			data: { pos },
		} )
			.then( ( r ) => setMsg( answerMsg( r ) ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => {
				setBusy( false );
				load();
			} );
	};
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	return (
		<>
			{ settings && (
				<Notice tone="info">
					{ __(
						'The sources, the Google key and the monthly cap are on Settings, under Connected services.',
						'sourceweb'
					) }{ ' ' }
					<a href={ settings.url }>
						{ __( 'Open Settings', 'sourceweb' ) }
					</a>
				</Notice>
			) }
			<SettingsGroup
				id="trust-order"
				title={ __( 'Trust order', 'sourceweb' ) }
				description={ __(
					"When sources give different values for a field, the organisation's own claim wins first, then the value most sources agree on, then the source higher in this order. 1 is trusted most. Leave a source empty to rank it after every numbered one.",
					'sourceweb'
				) }
				footer={
					<Button busy={ busy } onClick={ saveOrder }>
						{ __( 'Save trust order', 'sourceweb' ) }
					</Button>
				}
			>
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				{ ! data && (
					<LoadingState
						label={ __( 'Loading the rules…', 'sourceweb' ) }
					/>
				) }
				{ ( data?.priority || [] ).map( ( p ) => (
					<TextField
						key={ p.key }
						label={ p.label }
						help={ p.key }
						value={ pos[ p.key ] ?? '' }
						onChange={ ( val ) =>
							setPos( { ...pos, [ p.key ]: val } )
						}
						input={ { type: 'number', min: '1', max: '99' } }
					/>
				) ) }
			</SettingsGroup>
			<SectionCard
				id="field-rules"
				title={ __( 'Field rules', 'sourceweb' ) }
				description={ __(
					'Every listing field: the enrichment fields and the fields of the listing field group. A claimed or verified listing is never changed, and a low-confidence value always waits for review; otherwise each field follows its Apply rule.',
					'sourceweb'
				) }
			>
				<DataList
					label={ __( 'Field rules', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Field', 'sourceweb' ),
							primary: true,
							render: ( r ) => (
								<>
									<a
										href={ subHref( {
											part: 'enrich',
											field: r.id,
										} ) }
										onClick={ inPlace( go, {
											part: 'enrich',
											field: r.id,
										} ) }
									>
										<strong>{ r.title }</strong>
									</a>{ ' ' }
									<code>{ r.id }</code>
									{ r.note && (
										<span className="kits-shell-field__help">
											{ ' ' }
											{ r.note }
										</span>
									) }
								</>
							),
						},
						{ key: 'group', label: __( 'Group', 'sourceweb' ) },
						{
							key: 'store',
							label: __( 'Stored in', 'sourceweb' ),
						},
						{ key: 'on', label: __( 'On', 'sourceweb' ) },
						{
							key: 'sources',
							label: __( 'May be filled by', 'sourceweb' ),
						},
						{ key: 'multi', label: __( 'Values', 'sourceweb' ) },
						{
							key: 'official',
							label: __( 'Official source', 'sourceweb' ),
						},
						{
							key: 'ai',
							label: __( 'Read by the AI', 'sourceweb' ),
						},
						{
							key: 'invite',
							label: __( 'Invite to claim', 'sourceweb' ),
						},
						{ key: 'apply', label: __( 'Apply', 'sourceweb' ) },
					] }
					rows={ data?.fields || [] }
					total={ data?.fields?.length || 0 }
					page={ 1 }
					pages={ 1 }
					onPage={ () => {} }
					rowActions={ ( r ) => [
						{
							icon: 'edit',
							label: __( 'Edit', 'sourceweb' ),
							onClick: () =>
								go( { part: 'enrich', field: r.id } ),
						},
						...( r.set
							? [
									{
										icon: 'delete',
										label: __(
											'Back to the built-in rule',
											'sourceweb'
										),
										tone: 'error',
										onClick: () => {
											if (
												// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
												! window.confirm(
													sprintf(
														/* translators: %s: field. */
														__(
															'Put the rule for %s back to the built-in one? Your saved rule is dropped (the Change log keeps it).',
															'sourceweb'
														),
														r.title
													)
												)
											) {
												return;
											}
											apiFetch( {
												path: path(
													'rules/field/reset'
												),
												method: 'POST',
												data: { field: r.id },
											} )
												.then( ( res ) =>
													setMsg( answerMsg( res ) )
												)
												.catch( ( e ) =>
													setMsg( {
														tone: 'error',
														text: errText( e ),
													} )
												)
												.finally( load );
										},
									},
								]
							: [] ),
					] }
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'No fields.', 'sourceweb' ) }
				/>
			</SectionCard>
		</>
	);
}

/**
 * One field's rule.
 *
 * @param {Object}   props
 * @param {string}   props.field  Field key.
 * @param {Function} props.onDone Back with a notice.
 */
function FieldRuleForm( { field, onDone } ) {
	const f = useForm( 'rules/field', { field }, ( d ) => ( {
		...d.rule,
		multi: String( d.rule.multi ),
	} ) );
	if ( f.error ) {
		return <ErrorState message={ f.error } onRetry={ f.load } />;
	}
	if ( ! f.data || ! f.v ) {
		return (
			<LoadingState label={ __( 'Loading the field…', 'sourceweb' ) } />
		);
	}
	const d = f.data;
	const put = ( k ) => ( val ) => f.setV( { ...f.v, [ k ]: val } );
	return (
		<SettingsGroup
			id="field-rule-form"
			title={ sprintf(
				/* translators: %s: field. */
				__( 'Edit field rule: %s', 'sourceweb' ),
				d.label
			) }
			description={ `${ d.field } · ${ d.group } · ${ d.store }` }
			footer={
				<FormButtons
					label={ __( 'Update', 'sourceweb' ) }
					busy={ f.busy }
					onSave={ () =>
						f.send(
							'rules/field/save',
							{ field, rule: f.v },
							onDone
						)
					}
					onDone={ onDone }
				/>
			}
		>
			{ f.msg && <Notice tone={ f.msg.tone }>{ f.msg.text }</Notice> }
			<Switch
				label={ __(
					'The worker may propose values for this field',
					'sourceweb'
				) }
				help={ d.why }
				checked={ !! f.v.on && ! d.why }
				disabled={ !! d.why }
				onChange={ put( 'on' ) }
			/>
			<SettingsBlock
				title={ __( 'May be filled by', 'sourceweb' ) }
				description={ __( 'None ticked: any source.', 'sourceweb' ) }
			>
				<Checks
					id="sw-fr-src"
					legend={ __( 'May be filled by', 'sourceweb' ) }
					options={ d.choices.sources }
					value={ f.v.sources }
					onChange={ put( 'sources' ) }
				/>
			</SettingsBlock>
			<TextField
				label={ __( 'Values', 'sourceweb' ) }
				help={ __(
					'0: one value, and sources that disagree make it low confidence. A number: up to that many different values, never low for disagreeing (phone numbers).',
					'sourceweb'
				) }
				value={ f.v.multi }
				onChange={ put( 'multi' ) }
				input={ { type: 'number', min: '0', max: '5' } }
			/>
			<SelectField
				label={ __( 'Official source', 'sourceweb' ) }
				help={ __(
					'Its value alone is high confidence (for example an official register that lists the address and PIN code).',
					'sourceweb'
				) }
				value={ f.v.official }
				options={ [
					{ value: '', label: __( 'None', 'sourceweb' ) },
					...d.choices.sources,
				] }
				onChange={ put( 'official' ) }
			/>
			<Switch
				label={ __( 'Read by the AI', 'sourceweb' ) }
				help={ __(
					'Values the AI reads from pages: at most medium confidence unless the organisation said so.',
					'sourceweb'
				) }
				checked={ !! f.v.ai }
				onChange={ put( 'ai' ) }
			/>
			<Switch
				label={ __( 'Invite to claim', 'sourceweb' ) }
				help={ __(
					'When only Google has it, the listing is flagged "Invite to claim".',
					'sourceweb'
				) }
				checked={ !! f.v.invite }
				onChange={ put( 'invite' ) }
			/>
			<Switch
				label={ __( 'Profile link', 'sourceweb' ) }
				help={ __(
					'A social profile: the website linking to it and the page preview count as one source.',
					'sourceweb'
				) }
				checked={ !! f.v.social }
				onChange={ put( 'social' ) }
			/>
			<SelectField
				label={ __( 'Apply', 'sourceweb' ) }
				help={ __(
					'Claimed and verified listings, and low-confidence values, always wait for review.',
					'sourceweb'
				) }
				value={ f.v.apply }
				options={ d.choices.apply }
				onChange={ put( 'apply' ) }
			/>
		</SettingsGroup>
	);
}

/* ---------- AI models ---------- */

const KEY_TONE = { ok: 'success', wait: 'warn', bad: 'error' };

/** AI models: the keys list, Add New Key, Edit key, Keys overview. */
function AiModels() {
	const [ sub, go ] = useSub( [ 'edit', 'overview' ] );
	const [ msg, setMsg ] = useState( null );
	const back = ( m ) => {
		setMsg( m || null );
		go( {} );
	};
	if ( sub.edit ) {
		return <AiKeyForm id={ sub.edit } onDone={ back } />;
	}
	if ( sub.overview ) {
		return <AiOverview onBack={ () => back() } />;
	}
	return <AiKeyList go={ go } msg={ msg } setMsg={ setMsg } />;
}

/** At a glance, the workers and their keys, the daily caps, keys by group. */
function AiGlance() {
	const { data, error, loading, load } = useRoute( 'ai' );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( loading && ! data ) {
		return <LoadingState label={ __( 'Loading…', 'sourceweb' ) } />;
	}
	return (
		<>
			<SectionCard
				id="ai-glance"
				title={ __( 'At a glance', 'sourceweb' ) }
			>
				<RefTable
					caption={ __( 'At a glance', 'sourceweb' ) }
					head={ [
						__( 'What', 'sourceweb' ),
						__( 'Now', 'sourceweb' ),
					] }
					rows={ data.glance }
				/>
				<details>
					<summary>
						{ sprintf(
							/* translators: %d: number of workers. */
							__(
								'The %d workers and the keys each can use',
								'sourceweb'
							),
							data.workers.length
						) }
					</summary>
					<RefTable
						caption={ __( 'Workers', 'sourceweb' ) }
						head={ [
							__( 'Worker', 'sourceweb' ),
							__( 'Keys it can use', 'sourceweb' ),
							__( 'Used AI in the last 24 h', 'sourceweb' ),
						] }
						rows={ data.workers }
					/>
				</details>
			</SectionCard>
			<SectionCard
				id="ai-caps"
				title={ __( 'Daily caps on free models', 'sourceweb' ) }
				description={ __(
					'Free models have a daily limit per account, not per key: OpenRouter allows 50 free requests a day per account (1,000 once the account has 10 credits), however many keys it has. The news workers share each account’s requests out over the day and stop calling an account once it reaches the limit. The limit resets at 05:30 IST (00:00 UTC).',
					'sourceweb'
				) }
			>
				{ data.caps.length ? (
					<RefTable
						caption={ __( 'Daily caps', 'sourceweb' ) }
						head={ [
							__( 'Account', 'sourceweb' ),
							__( 'Daily limit', 'sourceweb' ),
							__( 'Left today', 'sourceweb' ),
							__( 'Last run could use', 'sourceweb' ),
							__( 'Last run used', 'sourceweb' ),
							__( 'Keys', 'sourceweb' ),
							__( 'Last run', 'sourceweb' ),
						] }
						rows={ data.caps }
					/>
				) : (
					<p>
						{ __(
							'No worker run has reported yet.',
							'sourceweb'
						) }
					</p>
				) }
			</SectionCard>
			<SectionCard
				id="ai-groups"
				title={ __( 'Keys by group', 'sourceweb' ) }
			>
				{ data.groups.length ? (
					<RefTable
						caption={ __( 'Keys by group', 'sourceweb' ) }
						head={ [
							__( 'Group', 'sourceweb' ),
							__( 'What it means', 'sourceweb' ),
							__( 'Providers (working / saved)', 'sourceweb' ),
						] }
						rows={ data.groups }
					/>
				) : (
					<p>{ __( 'No keys yet.', 'sourceweb' ) }</p>
				) }
			</SectionCard>
		</>
	);
}

/**
 * The keys list: saved keys in the workers' order, then the GitHub secrets.
 *
 * @param {Object}   props
 * @param {Function} props.go     From useSub().
 * @param {Object}   props.msg    Notice.
 * @param {Function} props.setMsg Set the notice.
 */
function AiKeyList( { go, msg, setMsg } ) {
	const [ q, setQ ] = useState( {
		view: '',
		search: '',
		orderby: '',
		order: 'asc',
		page: 1,
	} );
	const [ worker, setWorker ] = useState( '' );
	const { data, error, loading, load } = useRoute( 'ai/keys', q );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	const decide = ( op, ids ) => {
		setMsg( null );
		return apiFetch( {
			path: path( 'ai/keys/decide' ),
			method: 'POST',
			data: { op, ids, worker },
		} )
			.then( ( r ) => setMsg( answerMsg( r ) ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( load );
	};
	const remove = ( ids, last4 ) => {
		if (
			// eslint-disable-next-line no-alert -- a plain browser confirm, as today's screen
			window.confirm(
				last4
					? sprintf(
							/* translators: %s: last 4 characters of a key. */
							__(
								'Remove key …%s? This takes effect straight away.',
								'sourceweb'
							),
							last4
						)
					: sprintf(
							/* translators: %d: number of keys. */
							_n(
								'Remove %d key? This takes effect straight away.',
								'Remove %d keys? This takes effect straight away.',
								ids.length,
								'sourceweb'
							),
							ids.length
						)
			)
		) {
			decide( 'remove', ids );
		}
	};
	const onBulk = ( op, ids ) => {
		const saved = ids.filter( ( id ) =>
			( data?.rows || [] ).some( ( r ) => r.id === id && ! r.secret )
		);
		if ( 'remove' === op ) {
			remove( saved );
		} else {
			decide( op, saved );
		}
	};
	const newKey = { edit: 'new' };
	return (
		<>
			<AiGlance />
			<SectionCard
				id="ai-keys"
				title={ __( 'Keys', 'sourceweb' ) }
				description={ __(
					'All keys in one list: the ones saved here, in the order the workers try them (top first), then the ones in the workers’ GitHub secrets (changed in GitHub; they cannot be attached to workers). Each key is for every worker unless it is attached to some. Every key is tested again twice a day.',
					'sourceweb'
				) }
				actions={
					<>
						<a
							className="kits-shell-button is-primary"
							href={ subHref( newKey ) }
							onClick={ inPlace( go, newKey ) }
						>
							{ __( 'Add New Key', 'sourceweb' ) }
						</a>{ ' ' }
						<a
							className="kits-shell-button is-secondary"
							href={ subHref( { overview: 1 } ) }
							onClick={ inPlace( go, { overview: 1 } ) }
						>
							{ __( 'Keys overview', 'sourceweb' ) }
						</a>
					</>
				}
			>
				{ msg && (
					<Notice
						tone={ msg.tone }
						onDismiss={ () => setMsg( null ) }
					>
						{ msg.text }
					</Notice>
				) }
				<SelectField
					label={ __(
						'Worker for Attach and Detach',
						'sourceweb'
					) }
					help={ __(
						'Choose the worker first, then tick keys and use the bulk action Attach to worker or Detach from worker.',
						'sourceweb'
					) }
					value={ worker }
					options={ [
						{
							value: '',
							label: __( '— Choose a worker —', 'sourceweb' ),
						},
						...( data?.workers || [] ).map( ( w ) => ( {
							value: w.value,
							label: `${ w.help }: ${ w.label }`,
						} ) ),
					] }
					onChange={ setWorker }
				/>
				<DataList
					label={ __( 'Keys', 'sourceweb' ) }
					columns={ [
						{
							key: 'title',
							label: __( 'Key', 'sourceweb' ),
							primary: true,
							render: ( r ) => (
								<>
									{ r.secret ? (
										<code>{ r.title }</code>
									) : (
										<a
											href={ subHref( { edit: r.id } ) }
											onClick={ inPlace( go, {
												edit: r.id,
											} ) }
										>
											<code>{ r.title }</code>
										</a>
									) }
									{ r.secret && (
										<span className="kits-shell-field__help">
											{ ' — ' }
											{ __(
												'GitHub secret: change it in GitHub',
												'sourceweb'
											) }
										</span>
									) }
									{ r.problem && (
										<Notice tone="error">
											{ r.problem }
										</Notice>
									) }
								</>
							),
						},
						{
							key: 'provider',
							label: __( 'Provider', 'sourceweb' ),
							sortable: true,
							render: ( r ) => r.providerLabel,
						},
						{
							key: 'model',
							label: __( 'Model', 'sourceweb' ),
							render: ( r ) => <code>{ r.model }</code>,
						},
						{
							key: 'usedBy',
							label: __( 'Used by', 'sourceweb' ),
						},
						{
							key: 'label',
							label: __( 'Label', 'sourceweb' ),
							sortable: true,
							render: ( r ) => r.label || '—',
						},
						{ key: 'group', label: __( 'Group', 'sourceweb' ) },
						{
							key: 'caps',
							label: __( 'Good for', 'sourceweb' ),
							render: ( r ) => (
								<>
									{ r.caps }
									{ r.capsNote && (
										<span className="kits-shell-field__help">
											{ ' — ' }
											{ r.capsNote }
										</span>
									) }
								</>
							),
						},
						{
							key: 'status',
							label: __( 'Status', 'sourceweb' ),
							sortable: true,
							render: ( r ) => (
								<>
									<Status
										tone={ KEY_TONE[ r.tone ] }
										label={ r.statusLabel }
									/>
									{ r.recheck && (
										<span className="kits-shell-field__help">
											{ ' — ' }
											{ __(
												'Being checked again',
												'sourceweb'
											) }
										</span>
									) }
								</>
							),
						},
						{
							key: 'last_ok',
							label: __( 'Last worked', 'sourceweb' ),
							sortable: true,
							render: ( r ) => r.lastOk,
						},
						{
							key: 'limits',
							label: __( 'Limit / cooldown', 'sourceweb' ),
						},
						{
							key: 'usage',
							label: __( 'Work in the last run', 'sourceweb' ),
						},
						{
							key: 'checked',
							label: __( 'Checked', 'sourceweb' ),
							sortable: true,
						},
					] }
					rows={ data?.rows || [] }
					total={ data?.total || 0 }
					page={ data?.page || 1 }
					pages={ data?.pages || 1 }
					onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
					search={ q.search }
					onSearch={ ( search ) => set( { search } ) }
					searchLabel={ __( 'Search keys', 'sourceweb' ) }
					views={ data?.views || [] }
					view={ q.view }
					onView={ ( view ) => set( { view } ) }
					sort={ { key: q.orderby, dir: q.order } }
					onSort={ ( orderby, order ) => set( { orderby, order } ) }
					bulkActions={ [
						{
							value: 'attach',
							label: __( 'Attach to worker', 'sourceweb' ),
						},
						{
							value: 'detach',
							label: __( 'Detach from worker', 'sourceweb' ),
						},
						{
							value: 'recheck',
							label: __( 'Check again', 'sourceweb' ),
						},
						{
							value: 'remove',
							label: __( 'Remove', 'sourceweb' ),
						},
					] }
					onBulk={ onBulk }
					rowActions={ ( r ) =>
						r.secret
							? []
							: [
									{
										icon: 'edit',
										label: __( 'Edit', 'sourceweb' ),
										onClick: () => go( { edit: r.id } ),
									},
									...( data?.plain
										? [
												{
													label: __(
														'Move up',
														'sourceweb'
													),
													onClick: () =>
														decide( 'up', [
															r.id,
														] ),
												},
												{
													label: __(
														'Move down',
														'sourceweb'
													),
													onClick: () =>
														decide( 'down', [
															r.id,
														] ),
												},
											]
										: [] ),
									{
										label: __(
											'Check again',
											'sourceweb'
										),
										onClick: () =>
											decide( 'recheck', [ r.id ] ),
									},
									{
										icon: 'delete',
										label: __( 'Remove', 'sourceweb' ),
										tone: 'error',
										onClick: () =>
											remove( [ r.id ], r.last4 ),
									},
								]
					}
					loading={ loading }
					error={ error }
					onRetry={ load }
					emptyTitle={ __( 'No keys yet.', 'sourceweb' ) }
				/>
			</SectionCard>
		</>
	);
}

/**
 * Add New Key, or edit a saved key's label and workers (provider, model and status read-only). The key itself is never
 * shown again: only its last 4 characters.
 *
 * @param {Object}   props
 * @param {string}   props.id     Key id or 'new'.
 * @param {Function} props.onDone Back to the list, with a notice.
 */
function AiKeyForm( { id, onDone } ) {
	const { data, error, load, v, setV, msg, busy, send } = useForm(
		'ai/key',
		{ id },
		( d ) => ( { keys: '', many: '', label: d.label, workers: d.workers } )
	);
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! data || ! v ) {
		return (
			<LoadingState label={ __( 'Loading the key…', 'sourceweb' ) } />
		);
	}
	const put = ( k ) => ( val ) => setV( { ...v, [ k ]: val } );
	const save = () =>
		data.new
			? send(
					'ai/keys/add',
					{
						keys: `${ v.keys }\n${ v.many }`,
						label: v.label,
						workers: v.workers,
					},
					onDone
				)
			: send(
					'ai/key/save',
					{ id, label: v.label, workers: v.workers },
					onDone
				);
	return (
		<SettingsGroup
			id="ai-key-form"
			title={
				data.new
					? __( 'Add New Key', 'sourceweb' )
					: sprintf(
							/* translators: %s: last 4 characters of a key. */
							__( 'Edit key …%s', 'sourceweb' ),
							data.last4
						)
			}
			footer={
				<FormButtons
					label={
						data.new
							? __( 'Add key', 'sourceweb' )
							: __( 'Save changes', 'sourceweb' )
					}
					busy={ busy }
					onSave={ save }
					onDone={ onDone }
				/>
			}
		>
			{ msg && <Notice tone={ msg.tone }>{ msg.text }</Notice> }
			{ data.new ? (
				<>
					<TextField
						label={ __( 'Key', 'sourceweb' ) }
						help={ __(
							'The provider and a model that answers are worked out in the background after you save. The key is never shown again: only its last 4 characters.',
							'sourceweb'
						) }
						value={ v.keys }
						onChange={ put( 'keys' ) }
						input={ {
							type: 'password',
							autoComplete: 'new-password',
							spellCheck: false,
						} }
					/>
					<TextField
						label={ __( 'Or several keys', 'sourceweb' ) }
						help={ __(
							'One per line. They get the same label and workers.',
							'sourceweb'
						) }
						value={ v.many }
						onChange={ put( 'many' ) }
						input={ { rows: 3 } }
					/>
				</>
			) : (
				<RefTable
					caption={ __( 'The key', 'sourceweb' ) }
					head={ [
						__( 'Field', 'sourceweb' ),
						__( 'Value', 'sourceweb' ),
					] }
					rows={ [
						[
							__( 'Key', 'sourceweb' ),
							<span key="k">
								<code>…{ data.last4 }</code>{ ' ' }
								{ __(
									'To change the key itself, remove it and add the new one.',
									'sourceweb'
								) }
							</span>,
						],
						[
							__( 'Provider', 'sourceweb' ),
							`${ data.providerLabel } (${ data.group })`,
						],
						[
							__( 'Model', 'sourceweb' ),
							<code key="m">{ data.model }</code>,
						],
						[
							__( 'Status', 'sourceweb' ),
							<Status
								key="s"
								tone={ KEY_TONE[ data.tone ] }
								label={ data.statusLabel }
							/>,
						],
						[ __( 'Last check', 'sourceweb' ), data.checked ],
					] }
				/>
			) }
			<TextField
				label={ __( 'Label', 'sourceweb' ) }
				help={ __(
					'Optional: a note for you, e.g. which account the key is from.',
					'sourceweb'
				) }
				value={ v.label }
				onChange={ put( 'label' ) }
				input={ { maxLength: 80 } }
			/>
			<SettingsBlock
				title={ __( 'Used by', 'sourceweb' ) }
				description={ __(
					'None ticked: every worker, also workers added later.',
					'sourceweb'
				) }
			>
				<Checks
					id="ai-key-workers"
					legend={ __( 'Used by', 'sourceweb' ) }
					options={ data.choices }
					value={ v.workers }
					onChange={ put( 'workers' ) }
				/>
			</SettingsBlock>
		</SettingsGroup>
	);
}

/**
 * Keys overview, read-only: every saved key and what each worker gets.
 *
 * @param {Object}   props
 * @param {Function} props.onBack Back to the list.
 */
function AiOverview( { onBack } ) {
	const { data, error, loading, load } = useRoute( 'ai/overview' );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( loading && ! data ) {
		return <LoadingState label={ __( 'Loading…', 'sourceweb' ) } />;
	}
	return (
		<SectionCard
			id="ai-overview"
			title={ __( 'Keys overview', 'sourceweb' ) }
			description={ __(
				'Read-only. Keys show only their last 4 characters. All workers means the key is attached to none, so every worker may use it, also workers added later. Usable keys: AI keys that work or are rate-limited for now, from free or free-tier providers (paid ones are never served), plus tool keys.',
				'sourceweb'
			) }
			actions={
				<Button onClick={ onBack }>
					{ __( 'Back to the keys', 'sourceweb' ) }
				</Button>
			}
		>
			{ data.keys.length ? (
				<RefTable
					caption={ __( 'Keys', 'sourceweb' ) }
					head={ [
						__( 'Key', 'sourceweb' ),
						__( 'Status', 'sourceweb' ),
						__( 'Attached to', 'sourceweb' ),
					] }
					rows={ data.keys }
				/>
			) : (
				<p>{ __( 'No keys saved yet.', 'sourceweb' ) }</p>
			) }
			<RefTable
				caption={ __( 'Usable keys per worker', 'sourceweb' ) }
				head={ [
					__( 'Worker', 'sourceweb' ),
					__( 'Usable AI keys', 'sourceweb' ),
					__( 'Tool keys', 'sourceweb' ),
				] }
				rows={ data.workers }
			/>
		</SectionCard>
	);
}

/* ---------- Reports: Rejected, Relay log, Change log ---------- */

/**
 * A read-only report: a server-driven list with views, search, sort and pages.
 *
 * @param {Object} props
 * @param {string} props.route       Route.
 * @param {string} props.title       Title.
 * @param {string} props.description What it lists.
 * @param {Array}  props.columns     DataList columns.
 * @param {string} props.searchLabel Search label.
 * @param {string} props.emptyTitle  Empty list.
 */
function Report( {
	route,
	title,
	description,
	columns,
	searchLabel,
	emptyTitle,
} ) {
	const [ q, setQ ] = useState( {
		view: '',
		search: '',
		orderby: '',
		order: 'asc',
		page: 1,
	} );
	const { data, error, loading, load } = useRoute( route, q );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );
	return (
		<SectionCard id={ route } title={ title } description={ description }>
			<DataList
				label={ title }
				columns={ columns }
				rows={ data?.rows || [] }
				total={ data?.total || 0 }
				page={ data?.page || 1 }
				pages={ data?.pages || 1 }
				onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
				search={ q.search }
				onSearch={ ( search ) => set( { search } ) }
				searchLabel={ searchLabel }
				views={ data?.views || [] }
				view={ q.view }
				onView={ ( view ) => set( { view } ) }
				sort={ { key: q.orderby, dir: q.order } }
				onSort={ ( orderby, order ) => set( { orderby, order } ) }
				loading={ loading }
				error={ error }
				onRetry={ load }
				emptyTitle={ emptyTitle }
			/>
		</SectionCard>
	);
}

/** Manual tool: which published items would the rules refuse today? Reads only. */
function Recheck() {
	const [ data, setData ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const [ error, setError ] = useState( '' );
	const run = () => {
		setBusy( true );
		setError( '' );
		apiFetch( { path: path( 'tools/recheck' ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<SectionCard
			id="recheck"
			title={ __(
				'Check published items against the rules',
				'sourceweb'
			) }
			description={ __(
				'Looks at the newest 300 published news items and lists those the current rules would refuse (archive or tag pages, job vacancies). Nothing is changed.',
				'sourceweb'
			) }
		>
			<p>
				<Button busy={ busy } onClick={ run }>
					{ __( 'Check now', 'sourceweb' ) }
				</Button>
			</p>
			{ error && <Notice tone="error">{ error }</Notice> }
			{ data && 0 === data.flagged.length && (
				<p>
					{ sprintf(
						/* translators: %d: items looked at. */
						__(
							'Checked %d items: none would be refused.',
							'sourceweb'
						),
						data.checked
					) }
				</p>
			) }
			{ data && data.flagged.length > 0 && (
				<table className="widefat striped">
					<tbody>
						{ data.flagged.map( ( f ) => (
							<tr key={ f.id }>
								<td>
									<a href={ f.edit }>{ f.title }</a>
								</td>
								<td>{ f.reason }</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</SectionCard>
	);
}

function Rejected() {
	return (
		<>
			<RejectedList />
			<Recheck />
		</>
	);
}

function RejectedList() {
	return (
		<Report
			route="rejected"
			title={ __( 'Rejected', 'sourceweb' ) }
			description={ __(
				'Items the relevance check refused, with the reason. They were never created. An item from an allowed publisher is rarely refused: worth a look.',
				'sourceweb'
			) }
			searchLabel={ __( 'Search rejected items', 'sourceweb' ) }
			emptyTitle={ __( 'Nothing rejected.', 'sourceweb' ) }
			columns={ [
				{
					key: 'title',
					label: __( 'Item', 'sourceweb' ),
					primary: true,
					render: ( r ) => (
						<>
							<a
								href={ r.url }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ r.title }
							</a>
							<span className="kits-shell-field__help">
								{ ' — ' }
								{ r.host }
							</span>
							{ r.problem && (
								<Notice tone="warn">{ r.problem }</Notice>
							) }
						</>
					),
				},
				{
					key: 'type',
					label: __( 'Type', 'sourceweb' ),
					sortable: true,
				},
				{
					key: 'found',
					label: __( 'Found by', 'sourceweb' ),
					sortable: true,
				},
				{ key: 'reason', label: __( 'Reason', 'sourceweb' ) },
				{
					key: 'at',
					label: __( 'Date', 'sourceweb' ),
					sortable: true,
				},
			] }
		/>
	);
}

function RelayLog() {
	return (
		<Report
			route="relay-log"
			title={ __( 'Relay log', 'sourceweb' ) }
			description={ __(
				'Every request the workers made through this site for a publisher that refuses GitHub (the last 200). Each source has its relay switch on Sources.',
				'sourceweb'
			) }
			searchLabel={ __( 'Search requests', 'sourceweb' ) }
			emptyTitle={ __( 'None yet.', 'sourceweb' ) }
			columns={ [
				{
					key: 'at',
					label: __( 'Time', 'sourceweb' ),
					sortable: true,
					primary: true,
					render: ( r ) => r.when,
				},
				{
					key: 'host',
					label: __( 'Host', 'sourceweb' ),
					sortable: true,
				},
				{ key: 'path', label: __( 'Path', 'sourceweb' ) },
				{
					key: 'status',
					label: __( 'Result', 'sourceweb' ),
					sortable: true,
					render: ( r ) => (
						<Status
							tone={ r.ok ? 'success' : 'warn' }
							label={ r.status }
						/>
					),
				},
				{
					key: 'bytes',
					label: __( 'Size', 'sourceweb' ),
					sortable: true,
					render: ( r ) => r.size,
				},
				{
					key: 'ms',
					label: __( 'Time taken', 'sourceweb' ),
					sortable: true,
					render: ( r ) => `${ r.ms } ms`,
				},
				{ key: 'note', label: __( 'Note', 'sourceweb' ) },
			] }
		/>
	);
}

function ChangeLog() {
	return (
		<Report
			route="changes"
			title={ __( 'Change log', 'sourceweb' ) }
			description={ __(
				'Who changed what on these screens and when, with the value before and after (newest first, the last 1,000).',
				'sourceweb'
			) }
			searchLabel={ __( 'Search changes', 'sourceweb' ) }
			emptyTitle={ __( 'No changes yet.', 'sourceweb' ) }
			columns={ [
				{
					key: 'at',
					label: __( 'When', 'sourceweb' ),
					sortable: true,
					primary: true,
				},
				{
					key: 'user',
					label: __( 'Who', 'sourceweb' ),
					sortable: true,
				},
				{
					key: 'tab',
					label: __( 'Tab', 'sourceweb' ),
					sortable: true,
				},
				{ key: 'what', label: __( 'What changed', 'sourceweb' ) },
				{
					key: 'change',
					label: __( 'Old → new', 'sourceweb' ),
					render: ( r ) => r.change || '—',
				},
			] }
		/>
	);
}

/* ---------- Places ---------- */

const KIND_LABELS = {
	content_type: __( 'Content type', 'sourceweb' ),
	plugin: __( 'Plugin', 'sourceweb' ),
	workflow: __( 'Workflow', 'sourceweb' ),
	other: __( 'Other', 'sourceweb' ),
};

/**
 * Places: where an item goes. The routes are tried top to bottom and the first whose test matches wins; an item that
 * matches none goes to the place of its own type, as it always did.
 */
function Places() {
	const [ data, setData ] = useState( null );
	const [ rows, setRows ] = useState( [] );
	const [ error, setError ] = useState( '' );
	const [ busy, setBusy ] = useState( false );
	const [ msg, setMsg ] = useState( null );
	const [ enh, setEnh ] = useState( {} );
	const [ np, setNp ] = useState( {
		label: '',
		id: '',
		kind: 'content_type',
		post_type: '',
	} );
	const take = ( d ) => {
		setData( d );
		setRows( d.routes );
		setEnh(
			Object.fromEntries( d.places.map( ( p ) => [ p.id, p.enhance ] ) )
		);
	};
	const load = useCallback( () => {
		setError( '' );
		apiFetch( { path: path( 'places' ) } )
			.then( take )
			.catch( ( e ) => setError( errText( e ) ) );
	}, [] );
	useEffect( load, [ load ] );
	if ( error ) {
		return <ErrorState message={ error } onRetry={ load } />;
	}
	if ( ! data ) {
		return (
			<LoadingState label={ __( 'Loading places…', 'sourceweb' ) } />
		);
	}
	const placeOptions = data.places.map( ( p ) => ( {
		value: p.id,
		label: `${ p.label } (${ KIND_LABELS[ p.kind ] || p.kind })`,
	} ) );
	const opLabels = {
		always: __( 'Always', 'sourceweb' ),
		eq: __( 'is exactly', 'sourceweb' ),
		contains: __( 'contains', 'sourceweb' ),
		in: __( 'is one of', 'sourceweb' ),
		has: __( 'is not empty', 'sourceweb' ),
	};
	const set = ( i, part ) =>
		setRows( rows.map( ( r, n ) => ( n === i ? { ...r, ...part } : r ) ) );
	const move = ( i, by ) => {
		const j = i + by;
		if ( j < 0 || j >= rows.length ) {
			return;
		}
		const next = [ ...rows ];
		[ next[ i ], next[ j ] ] = [ next[ j ], next[ i ] ];
		setRows( next );
	};
	const toggle = ( place, id ) =>
		setEnh( ( e ) => ( {
			...e,
			[ place ]: e[ place ].includes( id )
				? e[ place ].filter( ( x ) => x !== id )
				: [ ...e[ place ], id ],
		} ) );
	const saveEnhance = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'places/enhance' ),
			method: 'POST',
			data: { enhance: enh },
		} )
			.then( ( d ) => {
				take( d );
				setMsg( {
					tone: 'success',
					text: __( 'Enhancements saved.', 'sourceweb' ),
				} );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	const addPlace = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'places/add' ),
			method: 'POST',
			data: np,
		} )
			.then( ( d ) => {
				take( d );
				setNp( { label: '', id: '', kind: 'content_type', post_type: '' } );
				setMsg( {
					tone: 'success',
					text: __( 'Place added.', 'sourceweb' ),
				} );
			} )
			.catch( ( e ) => {
				setMsg( { tone: 'error', text: errText( e ) } );
				window.scrollTo( { top: 0, behavior: 'smooth' } ); // the message is above the form
			} )
			.finally( () => setBusy( false ) );
	};
	const removePlace = ( id ) => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'places/remove' ),
			method: 'POST',
			data: { place: id },
		} )
			.then( ( d ) => {
				take( d );
				setMsg( {
					tone: 'success',
					text: __( 'Place removed.', 'sourceweb' ),
				} );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	const save = () => {
		setBusy( true );
		setMsg( null );
		apiFetch( {
			path: path( 'places' ),
			method: 'POST',
			data: { routes: rows },
		} )
			.then( ( d ) => {
				take( d );
				setMsg( {
					tone: 'success',
					text: __( 'Routes saved.', 'sourceweb' ),
				} );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			<SectionCard
				id="routes"
				title={ __( 'Routes', 'sourceweb' ) }
				description={ __(
					'Where an item goes. Routes are tried from the top and the first that matches wins. An item that matches none goes to the place of its own type, as before.',
					'sourceweb'
				) }
			>
				{ 0 === rows.length && (
					<p>
						{ __(
							'No routes: every item goes to the place of its own type.',
							'sourceweb'
						) }
					</p>
				) }
				{ rows.map( ( r, i ) => (
					<div key={ i } className="sourceweb-route-row">
						<strong>{ i + 1 }.</strong>
						{ r.custom ? (
							<code>{ r.custom }</code>
						) : (
							<>
								<SelectField
									label={ __( 'When', 'sourceweb' ) }
									value={ r.op }
									options={ data.ops.map( ( o ) => ( {
										value: o,
										label: opLabels[ o ] || o,
									} ) ) }
									onChange={ ( v ) => set( i, { op: v } ) }
								/>
								{ 'always' !== r.op && (
									<SelectField
										label={ __( 'Field', 'sourceweb' ) }
										value={ r.field || data.fields[ 0 ] }
										options={ data.fields.map( ( f ) => ( {
											value: f,
											label: f,
										} ) ) }
										onChange={ ( v ) =>
											set( i, { field: v } )
										}
									/>
								) }
								{ 'always' !== r.op && 'has' !== r.op && (
									<TextField
										label={ __( 'Value', 'sourceweb' ) }
										value={ r.value }
										onChange={ ( v ) =>
											set( i, { value: v } )
										}
									/>
								) }
							</>
						) }
						<SelectField
							label={ __( 'Send to', 'sourceweb' ) }
							value={ r.place }
							options={ placeOptions }
							onChange={ ( v ) => set( i, { place: v } ) }
						/>
						<Button
							onClick={ () => move( i, -1 ) }
							disabled={ 0 === i }
						>
							{ __( 'Up', 'sourceweb' ) }
						</Button>
						<Button
							onClick={ () => move( i, 1 ) }
							disabled={ i === rows.length - 1 }
						>
							{ __( 'Down', 'sourceweb' ) }
						</Button>
						<Button
							onClick={ () =>
								setRows( rows.filter( ( _, n ) => n !== i ) )
							}
						>
							{ __( 'Remove', 'sourceweb' ) }
						</Button>
					</div>
				) ) }
				{ 0 === data.places.length && (
					<p>
						{ __(
							'No places yet. Turn on a plugin that adds one (DirectoryWeb adds its listing types), or add one under Places below, then routes can be made.',
							'sourceweb'
						) }
					</p>
				) }
				<p>
					<Button
						disabled={ 0 === data.places.length }
						onClick={ () =>
							setRows( [
								...rows,
								{
									op: 'contains',
									field: 'title',
									value: '',
									place: data.places[ 0 ]?.id || '',
									keep: null,
									custom: '',
								},
							] )
						}
					>
						{ __( 'Add a route', 'sourceweb' ) }
					</Button>{ ' ' }
					<Button variant="primary" busy={ busy } onClick={ save }>
						{ __( 'Save routes', 'sourceweb' ) }
					</Button>
				</p>
			</SectionCard>
			<SectionCard
				id="sources"
				title={ __( 'Where items come from', 'sourceweb' ) }
				description={ __(
					'Every way an item can enter SourceWeb. Plugins can add their own.',
					'sourceweb'
				) }
			>
				<table className="widefat striped">
					<thead>
						<tr>
							<th>{ __( 'Source', 'sourceweb' ) }</th>
							<th>{ __( 'Method', 'sourceweb' ) }</th>
							<th>{ __( 'Run by', 'sourceweb' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ data.sources.map( ( t ) => (
							<tr key={ t.id }>
								<td>{ t.label }</td>
								<td>{ t.method }</td>
								<td>{ t.runner || '—' }</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</SectionCard>
			<SectionCard
				id="places"
				title={ __( 'Places', 'sourceweb' ) }
				description={ __(
					'Content types SourceWeb fills, and any place a plugin or workflow registers.',
					'sourceweb'
				) }
			>
				<table className="widefat striped">
					<thead>
						<tr>
							<th>{ __( 'Place', 'sourceweb' ) }</th>
							<th>{ __( 'Kind', 'sourceweb' ) }</th>
							<th>{ __( 'Owner', 'sourceweb' ) }</th>
							<th>{ __( 'Enhancements', 'sourceweb' ) }</th>
							<th>{ __( 'Remove', 'sourceweb' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ data.places.map( ( p ) => (
							<tr key={ p.id }>
								<td>{ p.label }</td>
								<td>{ KIND_LABELS[ p.kind ] || p.kind }</td>
								<td>{ p.owner || '—' }</td>
								<td>
									{ data.enhancers.length
										? data.enhancers.map( ( e ) => (
												// eslint-disable-next-line jsx-a11y/label-has-associated-control -- the label wraps its checkbox
												<label key={ e.id }>
													<input
														type="checkbox"
														checked={ (
															enh[ p.id ] || []
														).includes( e.id ) }
														onChange={ () =>
															toggle( p.id, e.id )
														}
													/>{ ' ' }
													{ e.label }{ ' ' }
												</label>
											) )
										: '—' }
								</td>
								<td>
									{ ( data.custom || [] ).includes( p.id ) ? (
										<Button
											onClick={ () => removePlace( p.id ) }
											aria-label={ sprintf(
												/* translators: %s: place name. */
												__( 'Remove place %s', 'sourceweb' ),
												p.label
											) }
										>
											{ __( 'Remove', 'sourceweb' ) }
										</Button>
									) : (
										'—'
									) }
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
				<p>
					<Button
						variant="primary"
						busy={ busy }
						onClick={ saveEnhance }
					>
						{ __( 'Save enhancements', 'sourceweb' ) }
					</Button>
				</p>
				<h3>{ __( 'Add a place', 'sourceweb' ) }</h3>
				<p>
					{ __(
						'A place is where items can go: a content type, another plugin, a workflow or something else. Add one here and it can be chosen in a route above.',
						'sourceweb'
					) }
				</p>
				<TextField
					label={ __( 'Name', 'sourceweb' ) }
					value={ np.label }
					onChange={ ( v ) => setNp( { ...np, label: v } ) }
				/>
				<TextField
					label={ __( 'Id (optional)', 'sourceweb' ) }
					help={ __(
						'Lower-case letters, digits, dash and underscore. Left empty, it is made from the name. It cannot be changed later.',
						'sourceweb'
					) }
					value={ np.id }
					onChange={ ( v ) => setNp( { ...np, id: v } ) }
				/>
				<SelectField
					label={ __( 'Kind', 'sourceweb' ) }
					value={ np.kind }
					options={ Object.keys( KIND_LABELS ).map( ( k ) => ( {
						value: k,
						label: KIND_LABELS[ k ],
					} ) ) }
					onChange={ ( v ) => setNp( { ...np, kind: v } ) }
				/>
				{ 'content_type' === np.kind && (
					<SelectField
						label={ __( 'Content type', 'sourceweb' ) }
						value={ np.post_type }
						options={ [
							{ value: '', label: '' },
							...( data.postTypes || [] ),
						] }
						onChange={ ( v ) => setNp( { ...np, post_type: v } ) }
					/>
				) }
				<p>
					<Button
						variant="primary"
						busy={ busy }
						disabled={ '' === np.label.trim() }
						onClick={ addPlace }
					>
						{ __( 'Add place', 'sourceweb' ) }
					</Button>
				</p>
			</SectionCard>
			<SectionCard
				id="feedback"
				title={ __( 'What the places say back', 'sourceweb' ) }
				description={ __(
					'Per source: items delivered, and how many a place accepted or rejected. Lowest acceptance first. Places report back with SourceWeb’s places/outcome route.',
					'sourceweb'
				) }
			>
				{ 0 === data.outcomes.length ? (
					<p>{ __( 'Nothing yet.', 'sourceweb' ) }</p>
				) : (
					<table className="widefat striped">
						<thead>
							<tr>
								<th>{ __( 'Source', 'sourceweb' ) }</th>
								<th>{ __( 'Delivered', 'sourceweb' ) }</th>
								<th>{ __( 'Accepted', 'sourceweb' ) }</th>
								<th>{ __( 'Rejected', 'sourceweb' ) }</th>
								<th>
									{ __( 'Accepted share', 'sourceweb' ) }
								</th>
							</tr>
						</thead>
						<tbody>
							{ data.outcomes.map( ( o ) => (
								<tr key={ o.source }>
									<td>
										{ o.source }
										{ o.flag && (
											<>
												{ ' ' }
												<strong>
													{ __(
														'Review this source',
														'sourceweb'
													) }
												</strong>
											</>
										) }
									</td>
									<td>{ o.delivered }</td>
									<td>{ o.accepted }</td>
									<td>{ o.rejected }</td>
									<td>
										{ null === o.rate
											? '—'
											: `${ o.rate }%` }
									</td>
								</tr>
							) ) }
						</tbody>
					</table>
				) }
			</SectionCard>
		</>
	);
}

const SCREENS = {
	dashboard: Dashboard,
	review: Review,
	enrichment: Enrichment,
	settings: Settings,
	workers: Workers,
	sources: Sources,
	keywords: Keywords,
	rules: Rules,
	places: Places,
	ai: AiModels,
	rejected: Rejected,
	'relay-log': RelayLog,
	log: ChangeLog,
};

function App() {
	const Screen = SCREENS[ app.screen ] || Dashboard;
	return (
		<AppShell header={ <Header /> }>
			<Screen />
		</AppShell>
	);
}

const root = document.getElementById( 'sourceweb-app' );
if ( root ) {
	createRoot( root ).render( <App /> );
}
