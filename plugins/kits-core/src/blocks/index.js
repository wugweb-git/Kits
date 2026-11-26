/**
 * The Kits server-rendered blocks (countdown, metric, share, sticky action, letter, sponsored): one editor script, each
 * block a few settings in the sidebar and a server-side preview. Built by wp-scripts to build/blocks/.
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
// WordPress provides this script (wp-server-side-render); it is not a dependency of the build.
// eslint-disable-next-line import/no-unresolved
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

const fields = {
	'kits/countdown': [
		[ 'date', __( 'Date (YYYY-MM-DD)', 'kits-core' ), 'text' ],
		[ 'label', __( 'Label', 'kits-core' ), 'text' ],
	],
	'kits/metric': [
		[ 'key', __( 'Number to show (key)', 'kits-core' ), 'text' ],
		[ 'label', __( 'Label', 'kits-core' ), 'text' ],
		[ 'min', __( 'Show from this number', 'kits-core' ), 'number' ],
	],
	'kits/share': [
		[ 'button', __( 'One button text (optional)', 'kits-core' ), 'text' ],
	],
	'kits/sticky-cta': [
		[ 'href', __( 'Link', 'kits-core' ), 'text' ],
		[ 'label', __( 'Button text', 'kits-core' ), 'text' ],
	],
	'kits/letter': [
		[ 'to', __( 'Send to (email)', 'kits-core' ), 'text' ],
		[ 'subject', __( 'Subject', 'kits-core' ), 'text' ],
		[ 'grounds', __( 'Grounds (one per line)', 'kits-core' ), 'area' ],
		[
			'ticked',
			__( 'Ticked at first (numbers, comma-separated)', 'kits-core' ),
			'text',
		],
		[ 'salute', __( 'Greeting', 'kits-core' ), 'text' ],
		[ 'intro', __( 'Opening line', 'kits-core' ), 'area' ],
		[ 'closing', __( 'Closing line', 'kits-core' ), 'area' ],
		[ 'sign', __( 'Sign-off', 'kits-core' ), 'text' ],
	],
	'kits/sponsored': [
		[ 'heading', __( 'Heading', 'kits-core' ), 'text' ],
		[
			'items',
			__(
				'Items: name | https address | text, one per line',
				'kits-core'
			),
			'area',
		],
	],
};

Object.keys( fields ).forEach( ( name ) => {
	registerBlockType( name, {
		edit: function Edit( { attributes, setAttributes } ) {
			return (
				<div { ...useBlockProps() }>
					<InspectorControls>
						<PanelBody title={ __( 'Settings', 'kits-core' ) }>
							{ fields[ name ].map( ( [ key, label, type ] ) => {
								if ( 'number' === type ) {
									return (
										<TextControl
											type="number"
											key={ key }
											label={ label }
											value={ attributes[ key ] }
											__nextHasNoMarginBottom
											onChange={ ( v ) =>
												setAttributes( {
													[ key ]:
														parseInt( v, 10 ) || 0,
												} )
											}
										/>
									);
								}
								const C =
									'area' === type
										? TextareaControl
										: TextControl;
								return (
									<C
										key={ key }
										label={ label }
										value={ attributes[ key ] || '' }
										onChange={ ( v ) =>
											setAttributes( { [ key ]: v } )
										}
										__nextHasNoMarginBottom
									/>
								);
							} ) }
						</PanelBody>
					</InspectorControls>
					<ServerSideRender
						block={ name }
						attributes={ attributes }
						EmptyResponsePlaceholder={ () => (
							<p>
								{ __(
									'Nothing to show yet: set it up in the sidebar.',
									'kits-core'
								) }
							</p>
						) }
					/>
				</div>
			);
		},
		save: () => null,
	} );
} );
