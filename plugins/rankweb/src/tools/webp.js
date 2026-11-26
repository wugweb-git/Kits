/**
 * RankWeb → Convert to WebP, native: make a .webp copy next to each JPEG and PNG in the media library. A dry run first;
 * originals are never changed.
 *
 * GET rankweb/v1/webp (is the server able, how many images); POST webp/run ({ apply, after }) one batch at a time. This
 * screen asks for batches until the server says there are no more, and adds the reports up.
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { ErrorState, LoadingState, Notice, SectionCard } from '@kits/shell'; // eslint-disable-line import/no-unresolved -- Kits Core's shell script (window.kits.shell), mapped in webpack.config.js
import { DryThenApply, Report, errText, num, path, useRun } from './common';

const runAll = async ( apply ) => {
	const total = {
		dry: ! apply,
		updated: 0,
		made: 0,
		scanned: 0,
		changes: [],
		skipped: [],
	};
	let after = 0;
	do {
		const r = await apiFetch( {
			path: path( 'webp/run' ),
			method: 'POST',
			data: { apply, after },
		} );
		if ( r.error ) {
			return { dry: ! apply, error: r.error };
		}
		total.updated += r.updated;
		total.made += r.made;
		total.scanned += r.scanned;
		total.changes = total.changes.concat( r.changes ).slice( 0, 25 );
		total.skipped = total.skipped.concat( r.skipped ).slice( 0, 25 );
		after = r.next;
	} while ( after > 0 );
	return total;
};

export function Webp() {
	const [ info, setInfo ] = useState( null );
	const [ error, setError ] = useState( '' );
	const run = useRun();
	const load = () => {
		setError( '' );
		apiFetch( { path: path( 'webp' ) } )
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
			id="webp"
			title={ __( 'Convert images to WebP', 'rankweb' ) }
			description={ __(
				'Makes a .webp copy next to each JPEG and PNG in the media library and each of its sizes. Originals are never changed. The dry run counts what is missing and writes nothing. To use the copies, turn on “Serve WebP copies of images” in Settings → Page speed.',
				'rankweb'
			) }
		>
			<p>
				{ sprintf(
					/* translators: %s: number of images. */
					__( '%s JPEG and PNG images in the library.', 'rankweb' ),
					num( info.images )
				) }
			</p>
			{ ! info.ready && (
				<Notice tone="warning">
					{ __(
						'This server cannot write WebP files (its image library has no WebP support).',
						'rankweb'
					) }
				</Notice>
			) }
			{ run.error && <Notice tone="error">{ run.error }</Notice> }
			{ run.report && (
				<Report
					report={ run.report }
					noun={ __( 'images', 'rankweb' ) }
					line={ ( c ) => c }
					onClose={ run.clear }
				/>
			) }
			<DryThenApply
				run={ run }
				noun={ __( 'images', 'rankweb' ) }
				start={ ( apply ) => runAll( apply ) }
				dryText={ __( 'Dry run', 'rankweb' ) }
				disabled={ ! info.ready }
			/>
		</SectionCard>
	);
}
