/**
 * RankWeb → FAQ, native: "FAQ box on", the pages with an FAQ and the ones with draft questions waiting for approval
 * (bulk Approve), and the counts by type with Recount. Data from GET rankweb/v1/faq; Approve and Recount post to
 * faq/approve and faq/recount; "FAQ box on" saves through settings/faq-types (administrators), as Settings does.
 */
import { useCallback, useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	DataList,
	LoadingState,
	Notice,
	RefTable,
	SectionCard,
	SettingsBlock,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js
import { errText, num, path } from './common';

const FIRST = {
	view: 'all',
	type: '',
	s: '',
	orderby: 'name',
	order: 'asc',
	page: 1,
};

/**
 * "FAQ box on": the ticked types have the box on their edit screens. Administrators only can save it.
 *
 * @param {Object}   props
 * @param {Array}    props.types   { slug, label, store, on } of each type.
 * @param {boolean}  props.can     The user may save it.
 * @param {Function} props.onSaved Called after a save, to load the screen again.
 * @param {Function} props.setMsg  Shows a message on the screen.
 */
function BoxOn( { types, can, onSaved, setMsg } ) {
	const [ on, setOn ] = useState( () =>
		Object.fromEntries( types.map( ( t ) => [ t.slug, t.on ] ) )
	);
	const [ busy, setBusy ] = useState( false );
	useEffect(
		() =>
			setOn(
				Object.fromEntries( types.map( ( t ) => [ t.slug, t.on ] ) )
			),
		[ types ]
	);
	const dirty = types.some( ( t ) => !! on[ t.slug ] !== t.on );
	const save = () => {
		setBusy( true );
		apiFetch( {
			path: path( 'settings/faq-types' ),
			method: 'POST',
			data: { on: Object.keys( on ).filter( ( k ) => on[ k ] ) },
		} )
			.then( ( r ) => {
				setMsg( { tone: 'success', text: r.message } );
				onSaved();
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	return (
		<SettingsBlock
			title={ __( 'FAQ box on', 'rankweb' ) }
			description={ __(
				'Ticked types have the FAQ box on their edit screens. A type registered later has it too.',
				'rankweb'
			) }
		>
			{ [
				[ 'post', __( 'Post types', 'rankweb' ) ],
				[ 'term', __( 'Taxonomies', 'rankweb' ) ],
			].map( ( [ store, label ] ) => (
				<fieldset key={ store } className="kits-shell-checks">
					<legend className="kits-shell-field__label">
						{ label }
					</legend>
					{ types
						.filter( ( t ) => t.store === store )
						.map( ( t ) => (
							<label
								key={ t.slug }
								htmlFor={ `rankweb-faqbox-${ t.slug }` }
							>
								<input
									id={ `rankweb-faqbox-${ t.slug }` }
									type="checkbox"
									checked={ !! on[ t.slug ] }
									disabled={ ! can }
									onChange={ ( e ) => {
										const v = e.target.checked;
										setOn( ( o ) => ( {
											...o,
											[ t.slug ]: v,
										} ) );
									} }
								/>{ ' ' }
								{ t.label } <code>{ t.slug }</code>
							</label>
						) ) }
				</fieldset>
			) ) }
			{ can ? (
				<div>
					<Button busy={ busy } disabled={ ! dirty } onClick={ save }>
						{ __( 'Save FAQ box types', 'rankweb' ) }
					</Button>
				</div>
			) : (
				<p className="kits-shell-field__help">
					{ __( 'Only administrators can change this.', 'rankweb' ) }
				</p>
			) }
		</SettingsBlock>
	);
}

export function Faq() {
	const [ q, setQ ] = useState( FIRST );
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );

	const load = useCallback( () => {
		setLoading( true );
		setError( '' );
		apiFetch( { path: path( 'faq', q ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) )
			.finally( () => setLoading( false ) );
	}, [ q ] );
	useEffect( load, [ load ] );
	const set = ( part ) => setQ( ( o ) => ( { ...o, page: 1, ...part } ) );

	const post = ( route, body ) => {
		setMsg( null );
		setBusy( true );
		return apiFetch( { path: path( route ), method: 'POST', data: body } )
			.then( ( r ) => setMsg( { tone: 'success', text: r.message } ) )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => {
				setBusy( false );
				load();
			} );
	};
	const approve = ( items ) => post( 'faq/approve', { items } );

	const waiting = 'waiting' === q.view;
	const rows = data?.rows || [];
	return (
		<>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			<SectionCard
				id="faq-list"
				title={ __( 'Pages with an FAQ', 'rankweb' ) }
				description={ __(
					'Every page’s questions are in its own FAQ box: open it with Edit. A page shows its FAQ when its box has enough questions to show. This list: the pages that show one, and the draft questions waiting for approval.',
					'rankweb'
				) }
			>
				<DataList
					label={ __( 'Pages with an FAQ', 'rankweb' ) }
					columns={ [
						{
							key: 'name',
							label: __( 'Name', 'rankweb' ),
							sortable: true,
							primary: true,
							render: ( r ) =>
								r.editUrl ? (
									<a href={ r.editUrl }>
										<strong>{ r.name }</strong>
									</a>
								) : (
									<strong>{ r.name }</strong>
								),
						},
						{
							key: 'type',
							label: __( 'Type', 'rankweb' ),
							sortable: true,
							render: ( r ) => r.typeLabel,
						},
						...( waiting
							? [
									{
										key: 'drafts',
										label: __(
											'Draft questions',
											'rankweb'
										),
										render: ( r ) => (
											<>
												{ num( r.drafts ) }
												{ r.draftQ.length > 0 && (
													<ul className="kits-shell-list">
														{ r.draftQ.map(
															( d ) => (
																<li key={ d }>
																	{ d }
																</li>
															)
														) }
													</ul>
												) }
											</>
										),
									},
								]
							: [
									{
										key: 'shown',
										label: __(
											'Questions shown',
											'rankweb'
										),
										sortable: true,
										render: ( r ) => num( r.shown ),
									},
									{
										key: 'mix',
										label: __(
											'Auto / edited / own',
											'rankweb'
										),
										render: ( r ) =>
											`${ r.auto } / ${ r.edited } / ${ r.own }`,
									},
								] ),
					] }
					rows={ rows }
					rowKey="key"
					total={ data?.total || 0 }
					page={ data?.page || 1 }
					pages={ data?.pages || 1 }
					onPage={ ( page ) => setQ( ( o ) => ( { ...o, page } ) ) }
					search={ q.s }
					onSearch={ ( s ) => set( { s } ) }
					searchLabel={ __( 'Search by name', 'rankweb' ) }
					views={ data?.views || [] }
					view={ q.view }
					onView={ ( view ) => set( { view } ) }
					filters={ [
						{
							key: 'type',
							label: __( 'Type', 'rankweb' ),
							options: data?.types || [],
							value: q.type,
						},
					] }
					onFilter={ ( key, value ) => set( { [ key ]: value } ) }
					sort={ { key: q.orderby, dir: q.order } }
					onSort={ ( orderby, order ) => set( { orderby, order } ) }
					bulkActions={
						waiting
							? [
									{
										value: 'approve',
										label: __( 'Approve', 'rankweb' ),
									},
								]
							: []
					}
					onBulk={ ( action, ids ) => approve( ids ) }
					rowActions={ ( r ) => [
						...( r.editUrl
							? [
									{
										icon: 'edit',
										label: __( 'Edit FAQ', 'rankweb' ),
										href: r.editUrl,
									},
								]
							: [] ),
						...( r.viewUrl
							? [
									{
										icon: 'view',
										label: __( 'View', 'rankweb' ),
										href: r.viewUrl,
									},
								]
							: [] ),
						...( waiting && r.editUrl
							? [
									{
										icon: 'success',
										label: __( 'Approve', 'rankweb' ),
										onClick: () => approve( [ r.key ] ),
									},
								]
							: [] ),
					] }
					loading={ loading && ! data }
					error={ error }
					onRetry={ load }
					emptyTitle={
						waiting
							? __( 'No draft questions waiting.', 'rankweb' )
							: __( 'No page shows an FAQ yet.', 'rankweb' )
					}
				/>
			</SectionCard>
			{ ! data && ! error && <LoadingState /> }
			{ data && (
				<>
					<SectionCard
						id="faq-box"
						title={ __( 'FAQ box', 'rankweb' ) }
					>
						<BoxOn
							types={ data.faqTypes }
							can={ data.canTypes }
							onSaved={ load }
							setMsg={ setMsg }
						/>
					</SectionCard>
					<SectionCard
						id="faq-counts"
						title={ __( 'Counts', 'rankweb' ) }
						description={ sprintf(
							/* translators: %s: date and time. */
							__( 'Counted %s.', 'rankweb' ),
							data.atText
						) }
						actions={
							<Button
								busy={ busy }
								onClick={ () => post( 'faq/recount', {} ) }
							>
								{ __( 'Recount', 'rankweb' ) }
							</Button>
						}
					>
						<RefTable
							caption={ __( 'FAQ counts by type', 'rankweb' ) }
							head={ [
								__( 'Type', 'rankweb' ),
								__( 'Published', 'rankweb' ),
								__( 'Show an FAQ', 'rankweb' ),
								__(
									'Questions, but fewer than the minimum (no FAQ)',
									'rankweb'
								),
								__( 'Draft questions waiting', 'rankweb' ),
							] }
							rows={ data.counts.map( ( c ) => [
								c.terms
									? sprintf(
											/* translators: %s: a taxonomy's name. */
											__( '%s (terms)', 'rankweb' ),
											c.type
										)
									: c.type,
								num( c.published ),
								num( c.faq ),
								num( c.below ),
								num( c.drafts ),
							] ) }
						/>
					</SectionCard>
				</>
			) }
		</>
	);
}
