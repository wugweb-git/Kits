/* eslint-disable jsx-a11y/label-has-associated-control -- each label wraps its control; the translated text is not seen by the rule */
/**
 * Listing Types, Schema & Fields, Form Integrations, Import / Export, and the Works with card (Settings).
 * One schema defines a listing; types choose fields; forms map into it.
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	ErrorState,
	LoadingState,
	Notice,
	SectionCard,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js

const app = window.directorywebApp || {};
const path = ( p ) => `/${ app.rest }/${ p }`;
const errText = ( e ) => e?.message || String( e );

/**
 * Loads a route once; gives the data, a setter, an error and a reload.
 *
 * @param {string} route Route under the plugin's namespace.
 */
function useRoute( route ) {
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( '' );
	const load = () => {
		setError( '' );
		apiFetch( { path: path( route ) } )
			.then( setData )
			.catch( ( e ) => setError( errText( e ) ) );
	};
	useEffect( load, [ route ] );
	return { data, setData, error, load };
}

/**
 * Posts a body; reports success or the error as a notice.
 *
 * @param {Function} setMsg  Notice setter.
 * @param {Function} setBusy Busy setter.
 */
function useSave( setMsg, setBusy ) {
	return ( route, body, done, text ) => {
		setBusy( true );
		setMsg( null );
		apiFetch( { path: path( route ), method: 'POST', data: body } )
			.then( ( r ) => {
				done( r );
				setMsg( { tone: 'success', text } );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
}

function Shell( { r, children } ) {
	if ( r.error ) {
		return <ErrorState message={ r.error } onRetry={ r.load } />;
	}
	if ( ! r.data ) {
		return <LoadingState label={ __( 'Loading…', 'directoryweb' ) } />;
	}
	return children;
}

/* ---------- Schema & Fields ---------- */

const FIELD_TYPES = [
	'text',
	'textarea',
	'number',
	'url',
	'email',
	'phone',
	'date',
	'boolean',
	'select',
	'multiselect',
];

export function SchemaScreen() {
	const r = useRoute( 'schema' );
	const [ fields, setFields ] = useState( null );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const save = useSave( setMsg, setBusy );
	useEffect( () => {
		if ( r.data && null === fields ) {
			setFields( r.data.fields );
		}
	}, [ r.data ] ); // eslint-disable-line react-hooks/exhaustive-deps -- take the first answer only
	const set = ( i, part ) =>
		setFields(
			fields.map( ( f, n ) => ( n === i ? { ...f, ...part } : f ) )
		);
	return (
		<Shell r={ r }>
			{ fields && (
				<>
					{ msg && (
						<Notice
							tone={ msg.tone }
							onDismiss={ () => setMsg( null ) }
						>
							{ msg.text }
						</Notice>
					) }
					<SectionCard
						id="fields"
						title={ __( 'Schema & Fields', 'directoryweb' ) }
						description={ __(
							'What a listing contains. Every form and every listing type uses these fields; no form has a schema of its own.',
							'directoryweb'
						) }
					>
						<table className="widefat striped">
							<thead>
								<tr>
									<th>{ __( 'Label', 'directoryweb' ) }</th>
									<th>{ __( 'Key', 'directoryweb' ) }</th>
									<th>{ __( 'Type', 'directoryweb' ) }</th>
									<th>
										{ __( 'Required', 'directoryweb' ) }
									</th>
									<th>
										{ __(
											'Choices (comma separated)',
											'directoryweb'
										) }
									</th>
									<th>{ __( 'Min', 'directoryweb' ) }</th>
									<th>{ __( 'Max', 'directoryweb' ) }</th>
									<th>{ __( 'Pattern', 'directoryweb' ) }</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{ fields.map( ( f, i ) => (
									<tr key={ i }>
										<td>
											<input
												type="text"
												value={ f.label }
												aria-label={ __(
													'Label',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														label: e.target.value,
													} )
												}
											/>
										</td>
										<td>
											<input
												type="text"
												value={ f.key }
												aria-label={ __(
													'Key',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														key: e.target.value,
													} )
												}
											/>
										</td>
										<td>
											<select
												value={ f.type }
												aria-label={ __(
													'Type',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														type: e.target.value,
													} )
												}
											>
												{ FIELD_TYPES.map( ( t ) => (
													<option
														key={ t }
														value={ t }
													>
														{ t }
													</option>
												) ) }
											</select>
										</td>
										<td>
											<input
												type="checkbox"
												checked={ !! f.required }
												aria-label={ __(
													'Required',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														required:
															e.target.checked,
													} )
												}
											/>
										</td>
										<td>
											{ [
												'select',
												'multiselect',
											].includes( f.type ) && (
												<input
													type="text"
													value={ (
														f.options || []
													).join( ', ' ) }
													aria-label={ __(
														'Choices',
														'directoryweb'
													) }
													onChange={ ( e ) =>
														set( i, {
															options:
																e.target.value
																	.split(
																		','
																	)
																	.map(
																		( x ) =>
																			x.trim()
																	)
																	.filter(
																		Boolean
																	),
														} )
													}
												/>
											) }
										</td>
										<td>
											<input
												type="number"
												value={ f.min ?? '' }
												aria-label={ __(
													'Min',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														min: e.target.value,
													} )
												}
											/>
										</td>
										<td>
											<input
												type="number"
												value={ f.max ?? '' }
												aria-label={ __(
													'Max',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														max: e.target.value,
													} )
												}
											/>
										</td>
										<td>
											<input
												type="text"
												value={ f.pattern || '' }
												aria-label={ __(
													'Pattern',
													'directoryweb'
												) }
												onChange={ ( e ) =>
													set( i, {
														pattern: e.target.value,
													} )
												}
											/>
										</td>
										<td>
											<Button
												onClick={ () =>
													setFields(
														fields.filter(
															( _, n ) => n !== i
														)
													)
												}
											>
												{ __(
													'Remove',
													'directoryweb'
												) }
											</Button>
										</td>
									</tr>
								) ) }
							</tbody>
						</table>
						<p>
							<Button
								onClick={ () =>
									setFields( [
										...fields,
										{
											key: '',
											label: '',
											type: 'text',
											required: false,
											options: [],
											min: '',
											max: '',
											pattern: '',
										},
									] )
								}
							>
								{ __( 'Add a field', 'directoryweb' ) }
							</Button>{ ' ' }
							<Button
								variant="primary"
								busy={ busy }
								onClick={ () =>
									save(
										'schema',
										{ fields },
										( d ) => setFields( d.fields ),
										__( 'Schema saved.', 'directoryweb' )
									)
								}
							>
								{ __( 'Save schema', 'directoryweb' ) }
							</Button>
						</p>
					</SectionCard>
				</>
			) }
		</Shell>
	);
}

/* ---------- Listing Types ---------- */

export function TypesScreen() {
	const r = useRoute( 'listing-types' );
	const [ types, setTypes ] = useState( null );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const save = useSave( setMsg, setBusy );
	useEffect( () => {
		if ( r.data && null === types ) {
			setTypes( r.data.types );
		}
	}, [ r.data ] ); // eslint-disable-line react-hooks/exhaustive-deps -- take the first answer only
	const set = ( i, part ) =>
		setTypes(
			types.map( ( t, n ) => ( n === i ? { ...t, ...part } : t ) )
		);
	const toggle = ( i, key ) => {
		const has = types[ i ].fields.includes( key );
		set( i, {
			fields: has
				? types[ i ].fields.filter( ( k ) => k !== key )
				: [ ...types[ i ].fields, key ],
		} );
	};
	return (
		<Shell r={ r }>
			{ types && (
				<>
					{ msg && (
						<Notice
							tone={ msg.tone }
							onDismiss={ () => setMsg( null ) }
						>
							{ msg.text }
						</Notice>
					) }
					{ types.map( ( t, i ) => (
						<SectionCard
							key={ i }
							id={ `type-${ i }` }
							title={
								t.label ||
								t.id ||
								__( 'New listing type', 'directoryweb' )
							}
							description={ __(
								'The fields this kind of listing uses, from the Schema.',
								'directoryweb'
							) }
						>
							<p>
								<label>
									{ __( 'Name', 'directoryweb' ) }{ ' ' }
									<input
										type="text"
										value={ t.label }
										onChange={ ( e ) =>
											set( i, { label: e.target.value } )
										}
									/>
								</label>{ ' ' }
								<label>
									{ __( 'Id', 'directoryweb' ) }{ ' ' }
									<input
										type="text"
										value={ t.id }
										onChange={ ( e ) =>
											set( i, { id: e.target.value } )
										}
									/>
								</label>
							</p>
							<p>
								{ r.data.fields.map( ( k ) => (
									<label
										key={ k }
										style={ { marginRight: '1em' } }
									>
										<input
											type="checkbox"
											checked={ t.fields.includes( k ) }
											onChange={ () => toggle( i, k ) }
										/>{ ' ' }
										{ k }
									</label>
								) ) }
							</p>
							<Button
								onClick={ () =>
									setTypes(
										types.filter( ( _, n ) => n !== i )
									)
								}
							>
								{ __( 'Remove this type', 'directoryweb' ) }
							</Button>
						</SectionCard>
					) ) }
					<p>
						<Button
							onClick={ () =>
								setTypes( [
									...types,
									{
										id: '',
										label: '',
										fields: [],
										post_type: '',
									},
								] )
							}
						>
							{ __( 'Add a listing type', 'directoryweb' ) }
						</Button>{ ' ' }
						<Button
							variant="primary"
							busy={ busy }
							onClick={ () =>
								save(
									'listing-types',
									{ types },
									( d ) => setTypes( d.types ),
									__( 'Listing types saved.', 'directoryweb' )
								)
							}
						>
							{ __( 'Save listing types', 'directoryweb' ) }
						</Button>
					</p>
				</>
			) }
		</Shell>
	);
}

/* ---------- Form Integrations ---------- */

export function FormsScreen() {
	const r = useRoute( 'integrations' );
	const [ maps, setMaps ] = useState( null );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const save = useSave( setMsg, setBusy );
	useEffect( () => {
		if ( r.data && null === maps ) {
			setMaps( r.data.mappings );
		}
	}, [ r.data ] ); // eslint-disable-line react-hooks/exhaustive-deps -- take the first answer only
	const set = ( i, part ) =>
		setMaps( maps.map( ( m, n ) => ( n === i ? { ...m, ...part } : m ) ) );
	const formOf = ( m ) =>
		r.data.providers
			.find( ( p ) => p.id === m.provider )
			?.forms.find( ( f ) => f.id === m.form );
	const typeOf = ( m ) => r.data.types.find( ( t ) => t.id === m.type );
	return (
		<Shell r={ r }>
			{ maps && (
				<>
					{ msg && (
						<Notice
							tone={ msg.tone }
							onDismiss={ () => setMsg( null ) }
						>
							{ msg.text }
						</Notice>
					) }
					<SectionCard
						id="providers"
						title={ __( 'Form providers', 'directoryweb' ) }
						description={ __(
							'Plugins whose forms can create listings. Each form is mapped to fields in the schema; many forms can feed one listing type.',
							'directoryweb'
						) }
					>
						<ul>
							{ r.data.providers.map( ( p ) => (
								<li key={ p.id }>
									<strong>{ p.label }</strong>:{ ' ' }
									{ p.active
										? sprintf(
												/* translators: %d: forms. */
												__(
													'active, %d forms',
													'directoryweb'
												),
												p.forms.length
											)
										: __(
												'not installed or not active',
												'directoryweb'
											) }
								</li>
							) ) }
						</ul>
					</SectionCard>
					{ maps.map( ( m, i ) => {
						const form = formOf( m );
						const type = typeOf( m );
						return (
							<SectionCard
								key={ i }
								id={ `map-${ i }` }
								title={
									form?.title ||
									__( 'New mapping', 'directoryweb' )
								}
								description={ __(
									'Send this form’s answers into a listing type.',
									'directoryweb'
								) }
							>
								<p>
									<select
										value={ m.provider }
										aria-label={ __(
											'Provider',
											'directoryweb'
										) }
										onChange={ ( e ) =>
											set( i, {
												provider: e.target.value,
												form: '',
												fields: {},
											} )
										}
									>
										<option value="">
											{ __(
												'Provider…',
												'directoryweb'
											) }
										</option>
										{ r.data.providers
											.filter( ( p ) => p.active )
											.map( ( p ) => (
												<option
													key={ p.id }
													value={ p.id }
												>
													{ p.label }
												</option>
											) ) }
									</select>{ ' ' }
									<select
										value={ m.form }
										aria-label={ __(
											'Form',
											'directoryweb'
										) }
										onChange={ ( e ) =>
											set( i, {
												form: e.target.value,
												fields: {},
											} )
										}
									>
										<option value="">
											{ __( 'Form…', 'directoryweb' ) }
										</option>
										{ (
											r.data.providers.find(
												( p ) => p.id === m.provider
											)?.forms || []
										).map( ( f ) => (
											<option key={ f.id } value={ f.id }>
												{ f.title }
											</option>
										) ) }
									</select>{ ' ' }
									<select
										value={ m.type }
										aria-label={ __(
											'Listing type',
											'directoryweb'
										) }
										onChange={ ( e ) =>
											set( i, {
												type: e.target.value,
												fields: {},
											} )
										}
									>
										<option value="">
											{ __(
												'Listing type…',
												'directoryweb'
											) }
										</option>
										{ r.data.types.map( ( t ) => (
											<option key={ t.id } value={ t.id }>
												{ t.label }
											</option>
										) ) }
									</select>
								</p>
								{ form && type && (
									<table className="widefat striped">
										<thead>
											<tr>
												<th>
													{ __(
														'Form field',
														'directoryweb'
													) }
												</th>
												<th>
													{ __(
														'Goes to',
														'directoryweb'
													) }
												</th>
											</tr>
										</thead>
										<tbody>
											{ form.fields.map( ( ff ) => (
												<tr key={ ff.id }>
													<td>{ ff.label }</td>
													<td>
														<select
															value={
																m.fields[
																	ff.id
																] || ''
															}
															aria-label={
																ff.label
															}
															onChange={ (
																e
															) => {
																const next = {
																	...m.fields,
																};
																if (
																	e.target
																		.value
																) {
																	next[
																		ff.id
																	] =
																		e.target.value;
																} else {
																	delete next[
																		ff.id
																	];
																}
																set( i, {
																	fields: next,
																} );
															} }
														>
															<option value="">
																{ __(
																	'Not used',
																	'directoryweb'
																) }
															</option>
															{ type.fields.map(
																( k ) => (
																	<option
																		key={
																			k
																		}
																		value={
																			k
																		}
																	>
																		{ k }
																	</option>
																)
															) }
														</select>
													</td>
												</tr>
											) ) }
										</tbody>
									</table>
								) }
								<p>
									<label>
										{ __(
											'New listings are',
											'directoryweb'
										) }{ ' ' }
										<select
											value={ m.status }
											onChange={ ( e ) =>
												set( i, {
													status: e.target.value,
												} )
											}
										>
											<option value="pending">
												{ __(
													'pending review',
													'directoryweb'
												) }
											</option>
											<option value="draft">
												{ __(
													'drafts',
													'directoryweb'
												) }
											</option>
										</select>
									</label>{ ' ' }
									<label>
										<input
											type="checkbox"
											checked={ !! m.enabled }
											onChange={ ( e ) =>
												set( i, {
													enabled: e.target.checked,
												} )
											}
										/>{ ' ' }
										{ __( 'On', 'directoryweb' ) }
									</label>{ ' ' }
									<Button
										onClick={ () =>
											setMaps(
												maps.filter(
													( _, n ) => n !== i
												)
											)
										}
									>
										{ __( 'Remove', 'directoryweb' ) }
									</Button>
								</p>
							</SectionCard>
						);
					} ) }
					<p>
						<Button
							onClick={ () =>
								setMaps( [
									...maps,
									{
										provider: '',
										form: '',
										type: '',
										fields: {},
										status: 'pending',
										enabled: false,
									},
								] )
							}
						>
							{ __( 'Add a form mapping', 'directoryweb' ) }
						</Button>{ ' ' }
						<Button
							variant="primary"
							busy={ busy }
							onClick={ () =>
								save(
									'integrations',
									{ mappings: maps },
									( d ) => setMaps( d.mappings ),
									__( 'Mappings saved.', 'directoryweb' )
								)
							}
						>
							{ __( 'Save mappings', 'directoryweb' ) }
						</Button>
					</p>
				</>
			) }
		</Shell>
	);
}

/* ---------- Import / Export ---------- */

export function TransferScreen() {
	const [ text, setText ] = useState( '' );
	const [ msg, setMsg ] = useState( null );
	const [ busy, setBusy ] = useState( false );
	const save = useSave( setMsg, setBusy );
	const download = () => {
		setBusy( true );
		apiFetch( { path: path( 'config' ) } )
			.then( ( d ) => {
				const url = URL.createObjectURL(
					new Blob( [ JSON.stringify( d, null, 2 ) ], {
						type: 'application/json',
					} )
				);
				const a = document.createElement( 'a' );
				a.href = url;
				a.download = 'directoryweb-schema.json';
				a.click();
				URL.revokeObjectURL( url );
			} )
			.catch( ( e ) => setMsg( { tone: 'error', text: errText( e ) } ) )
			.finally( () => setBusy( false ) );
	};
	const upload = () => {
		let body;
		try {
			body = JSON.parse( text );
		} catch {
			setMsg( {
				tone: 'error',
				text: __( 'That is not valid JSON.', 'directoryweb' ),
			} );
			return;
		}
		save(
			'config',
			body,
			() => setText( '' ),
			__(
				'Imported. Fields, listing types and form mappings are replaced.',
				'directoryweb'
			)
		);
	};
	return (
		<>
			{ msg && (
				<Notice tone={ msg.tone } onDismiss={ () => setMsg( null ) }>
					{ msg.text }
				</Notice>
			) }
			<SectionCard
				id="export"
				title={ __( 'Export the structure', 'directoryweb' ) }
				description={ __(
					'Fields, listing types and form mappings as one file, to move to another site. Listings themselves are not in it.',
					'directoryweb'
				) }
			>
				<Button busy={ busy } onClick={ download }>
					{ __( 'Download', 'directoryweb' ) }
				</Button>
			</SectionCard>
			<SectionCard
				id="import"
				title={ __( 'Import a structure', 'directoryweb' ) }
				description={ __(
					'Paste an exported file. It replaces this site’s fields, listing types and form mappings.',
					'directoryweb'
				) }
			>
				<textarea
					rows={ 8 }
					style={ { width: '100%' } }
					value={ text }
					aria-label={ __( 'Exported file', 'directoryweb' ) }
					onChange={ ( e ) => setText( e.target.value ) }
				/>
				<p>
					<Button variant="primary" busy={ busy } onClick={ upload }>
						{ __( 'Import', 'directoryweb' ) }
					</Button>
				</p>
			</SectionCard>
		</>
	);
}

/* ---------- Works with (on Settings) ---------- */

export function Companions() {
	const r = useRoute( 'companions' );
	return (
		<SectionCard
			id="companions"
			title={ __( 'Works with', 'directoryweb' ) }
			description={ __(
				'Other plugins that add to DirectoryWeb. DirectoryWeb works without them.',
				'directoryweb'
			) }
		>
			<Shell r={ r }>
				<ul>
					{ ( r.data || [] ).map( ( c ) => (
						<li key={ c.id }>
							<strong>{ c.label }</strong>: { c.purpose }{ ' ' }
							{ c.active ? (
								<em>{ __( 'Active', 'directoryweb' ) }</em>
							) : (
								<a href={ c.url }>
									{ __( 'Get it', 'directoryweb' ) }
								</a>
							) }
						</li>
					) ) }
				</ul>
			</Shell>
		</SectionCard>
	);
}
