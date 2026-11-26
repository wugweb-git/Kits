/**
 * RankWeb → Transport, native: copy SEO titles, descriptions, focus keywords and robots settings from Yoast SEO, Rank
 * Math or All in One SEO. A dry run first; a field that already has a value is never overwritten.
 *
 * GET rankweb/v1/transport (the sources and how many items each has); POST transport/run ({ source, apply, after }) one
 * batch at a time. This screen asks for batches until the server says there are no more, and adds the reports up.
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	ErrorState,
	Field,
	LoadingState,
	Notice,
	SectionCard,
} from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js
import { DryThenApply, Report, errText, num, path, useRun } from './common';

/**
 * Run every batch of one source and add the reports up.
 *
 * @param {string}  source The source key.
 * @param {boolean} apply  False: a dry run.
 * @return {Promise<Object>} { dry, updated, kept, scanned, changes, error }.
 */
const runAll = async ( source, apply ) => {
	const total = {
		dry: ! apply,
		updated: 0,
		kept: 0,
		scanned: 0,
		changes: [],
	};
	let after = 0;
	do {
		const r = await apiFetch( {
			path: path( 'transport/run' ),
			method: 'POST',
			data: { source, apply, after },
		} );
		if ( r.error ) {
			return { dry: ! apply, error: r.error };
		}
		total.updated += r.updated;
		total.kept += r.kept;
		total.scanned += r.scanned;
		total.changes = total.changes.concat( r.changes ).slice( 0, 25 );
		after = r.next;
	} while ( after > 0 );
	return total;
};

export function Transport() {
	const [ info, setInfo ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ source, setSource ] = useState( '' );
	const run = useRun();
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'transport' ) } )
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
		<SectionCard
			id="transport"
			title={ __( 'Copy from another SEO plugin', 'rankweb' ) }
			description={ __(
				'Copies the SEO title, description, focus keyword and robots settings (noindex, nofollow, noarchive, nosnippet, max-snippet) into RankWeb’s fields. A field that already has a value is never overwritten, and a title or description that still holds the other plugin’s variables (like %title%) is skipped. The dry run reports what would be copied and writes nothing. Nothing is deleted from the other plugin.',
				'rankweb'
			) }
		>
			<Field
				label={ __( 'Copy from', 'rankweb' ) }
				render={ ( id ) => (
					<select
						id={ id }
						value={ source }
						onChange={ ( e ) => {
							run.clear();
							setSource( e.target.value );
						} }
					>
						<option value="">
							{ __( 'Choose a plugin', 'rankweb' ) }
						</option>
						{ info.sources.map( ( s ) => (
							<option key={ s.key } value={ s.key }>
								{ sprintf(
									/* translators: 1: plugin name, 2: number of items with its data. */
									__( '%1$s (%2$s items with data)', 'rankweb' ),
									s.name,
									num( s.items )
								) }
							</option>
						) ) }
					</select>
				) }
			/>
			{ run.error && <Notice tone="error">{ run.error }</Notice> }
			{ run.report && (
				<>
					<Report
						report={ run.report }
						noun={ __( 'items', 'rankweb' ) }
						line={ ( c ) => c }
						onClose={ run.clear }
					/>
					{ ! run.report.error && (
						<p>
							{ sprintf(
								/* translators: 1: items looked at, 2: values left because the field already had one. */
								__(
									'%1$s items looked at; %2$s values left as they were because the field already had one.',
									'rankweb'
								),
								num( run.report.scanned ),
								num( run.report.kept )
							) }
						</p>
					) }
				</>
			) }
			<DryThenApply
				run={ run }
				noun={ __( 'items', 'rankweb' ) }
				start={ ( apply ) => runAll( source, apply ) }
				dryText={ __( 'Dry run', 'rankweb' ) }
				disabled={ ! source }
			/>
		</SectionCard>
	);
}
